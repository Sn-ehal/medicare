import VideoConsultation from '../models/VideoConsultation.js'
import Doctor from '../models/Doctor.js'
import Patient from '../models/Patient.js'
import { isSlotPast } from '../utils/timeSlotHelper.js'

// @desc    Get exactly 1 top doctor from each specialty for Video Consult
// @route   GET /api/video-consult/doctors
export const getVideoDoctors = async (req, res) => {
  try {
    const { search, specialty } = req.query

    // Aggregation: pick 1 highest-rated doctor from EVERY distinct specialty
    const list = await Doctor.aggregate([
      { $sort: { rating: -1, reviews: -1 } },
      {
        $group: {
          _id: '$specialty',
          doctor: { $first: '$$ROOT' },
        },
      },
      { $replaceRoot: { newRoot: '$doctor' } },
      { $sort: { specialty: 1 } },
    ])

    // Enrich doctor data with video consultation features
    let videoDoctors = list.map((doc) => ({
      ...doc,
      consultationTypes: ['Video Consult'],
      videoAvailable: true,
      videoPlatform: 'HD Telehealth Encrypted Video',
      videoLanguages: ['English', 'Hindi', 'Regional'],
      avgCallDuration: '15 - 20 mins',
      digitalPrescription: true,
      instantConnect: doc.id % 2 === 1, // some instant connect badges
    }))

    // Filter by specialty if specified
    if (specialty && specialty.toLowerCase() !== 'all') {
      videoDoctors = videoDoctors.filter(
        (d) => d.specialty.toLowerCase() === specialty.toLowerCase()
      )
    }

    // Filter by search term if provided
    if (search && search.trim() !== '') {
      const term = search.toLowerCase().trim()
      videoDoctors = videoDoctors.filter(
        (d) =>
          d.name.toLowerCase().includes(term) ||
          d.specialty.toLowerCase().includes(term) ||
          d.clinic.toLowerCase().includes(term) ||
          (d.education && d.education.toLowerCase().includes(term))
      )
    }

    return res.status(200).json({
      success: true,
      source: 'mongodb',
      count: videoDoctors.length,
      rule: '1 Doctor Per Specialty Selected for Video Consult',
      data: videoDoctors,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve video consult doctors from MongoDB Atlas',
      error: error.message,
    })
  }
}

// @desc    Book a Video Consultation with payment verification & save to VideoConsultation collection
// @route   POST /api/video-consult/book
export const bookVideoConsult = async (req, res) => {
  try {
    const {
      doctorId,
      patientName,
      patientPhone,
      patientEmail,
      appointmentDate,
      timeSlot,
      transactionId,
      paymentStatus,
      paymentMethod,
      amountPaid,
      symptoms,
    } = req.body

    if (!doctorId || !patientName || !patientPhone || !appointmentDate || !timeSlot) {
      return res.status(400).json({
        success: false,
        message: 'doctorId, patientName, patientPhone, appointmentDate, and timeSlot are required.',
      })
    }

    // Verify slot has not already passed
    if (isSlotPast(appointmentDate, timeSlot)) {
      return res.status(400).json({
        success: false,
        message: `The slot ${timeSlot} on ${appointmentDate} has already passed. Please choose an upcoming time slot or date.`,
      })
    }

    const cleanTxn = (transactionId || '').trim()
    if (!cleanTxn) {
      return res.status(400).json({
        success: false,
        message: 'UPI Transaction ID / UTR is required to confirm video consultation.',
      })
    }

    const docIdNum = parseInt(doctorId, 10)
    const doctor = await Doctor.findOne({ id: docIdNum }).lean()

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Selected doctor not found.',
      })
    }

    const rawPhone = patientPhone.trim()
    const cleanDigits = rawPhone.replace(/\D/g, '').slice(-10)
    const cleanPhone = cleanDigits || rawPhone
    const cleanName = patientName.trim()
    const cleanEmail = patientEmail ? patientEmail.trim() : ''

    // 1. Capacity check: Max 3 Patients per Slot
    const MAX_SLOT_CAPACITY = 3

    // Prevent duplicate booking for same patient on same slot in VideoConsultation collection
    const duplicate = await VideoConsultation.findOne({
      doctorId: doctor.id,
      appointmentDate,
      timeSlot,
      patientPhone: cleanPhone,
      status: { $ne: 'Cancelled' },
    })

    if (duplicate) {
      return res.status(409).json({
        success: false,
        message: `You (${cleanPhone}) already have a video consultation booked for ${timeSlot} on ${appointmentDate}.`,
      })
    }

    // Check count of booked video consultations for this slot in Atlas
    const bookedCount = await VideoConsultation.countDocuments({
      doctorId: doctor.id,
      appointmentDate,
      timeSlot,
      status: { $ne: 'Cancelled' },
    })

    if (bookedCount >= MAX_SLOT_CAPACITY) {
      return res.status(409).json({
        success: false,
        message: `The slot ${timeSlot} on ${appointmentDate} is full (3/3 patients already booked). Please pick another time slot.`,
        bookedCount,
        maxCapacity: MAX_SLOT_CAPACITY,
      })
    }

    const slotNumber = bookedCount + 1

    // Generate unique IDs
    const consultationId = `VID-${Date.now().toString().slice(-4)}${Math.floor(100 + Math.random() * 900)}`
    const meetingCode = `MC-VID-${Math.floor(1000 + Math.random() * 9000)}`
    const videoRoomUrl = `https://meet.jit.si/medicare-telehealth-${consultationId.toLowerCase()}`

    // 2. Create Dedicated Patient Record in MongoDB Atlas for this video consultation booking
    const patientId = `PAT-${Date.now().toString().slice(-4)}${Math.floor(100 + Math.random() * 900)}`

    const appointmentHistoryEntry = {
      appointmentId: consultationId,
      consultationId,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      date: appointmentDate,
      timeSlot,
      slotNumber,
      fee: doctor.fee || '₹800',
      transactionId: cleanTxn,
      paymentStatus: paymentStatus || 'Paid',
      consultationType: 'Video Consult',
      videoRoomUrl,
      bookedAt: new Date(),
    }

    await Patient.create({
      id: patientId,
      appointmentId: consultationId,
      name: cleanName,
      phone: cleanPhone,
      email: cleanEmail,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      consultationType: 'Video Consult',
      appointmentDate,
      timeSlot,
      totalAppointments: 1,
      lastBookingDate: appointmentDate,
      lastTransactionId: cleanTxn,
      lastAppointmentId: consultationId,
      appointmentHistory: [appointmentHistoryEntry],
    })

    // 3. Create Dedicated VideoConsultation Record in MongoDB Atlas (videoconsultations collection)
    const newVideoConsult = await VideoConsultation.create({
      id: consultationId,
      appointmentId: consultationId,
      patientId: patientId || `PAT-${cleanDigits.slice(-6)}`,
      patientName: cleanName,
      patientPhone: cleanPhone,
      patientEmail: cleanEmail,
      doctorId: Number(doctor.id),
      doctorName: doctor.name,
      specialty: doctor.specialty,
      clinic: doctor.clinic || 'MediCare Virtual Telehealth Clinic',
      appointmentDate,
      timeSlot,
      slotNumber,
      consultationType: 'Video Consult',
      fee: doctor.fee || '₹800',
      amountPaid: amountPaid || doctor.fee || '₹800',
      transactionId: cleanTxn,
      paymentStatus: paymentStatus || 'Paid',
      paymentMethod: paymentMethod || 'UPI QR',
      videoRoomUrl,
      meetingCode,
      status: 'Scheduled',
      symptoms: symptoms || '',
    })

    return res.status(201).json({
      success: true,
      source: 'mongodb',
      collection: 'videoconsultations',
      message: `Video Consultation booked & saved to videoconsultations database! (Patient #${slotNumber} of 3 for ${timeSlot})`,
      data: newVideoConsult,
      patient: {
        id: patientId,
        name: cleanName,
        phone: cleanPhone,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to book video consultation',
      error: error.message,
    })
  }
}

// @desc    Get all booked video consultations from MongoDB Atlas
// @route   GET /api/video-consult/consultations
export const getVideoConsultations = async (req, res) => {
  try {
    const { patientPhone, doctorId, date } = req.query
    const query = {}

    if (patientPhone) query.patientPhone = { $regex: patientPhone.trim(), $options: 'i' }
    if (doctorId) query.doctorId = parseInt(doctorId, 10)
    if (date) query.appointmentDate = date

    const consultations = await VideoConsultation.find(query)
      .sort({ createdAt: -1 })
      .lean()

    return res.status(200).json({
      success: true,
      source: 'mongodb',
      count: consultations.length,
      data: consultations,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve video consultations from MongoDB Atlas',
      error: error.message,
    })
  }
}

// @desc    Get real-time slot availability for a video consult doctor on a specific date (capacity: up to 3 patients per slot)
// @route   GET /api/video-consult/slot-availability?doctorId=...&date=...
export const getVideoSlotAvailability = async (req, res) => {
  try {
    const { doctorId, date } = req.query

    if (!doctorId || !date) {
      return res.status(400).json({
        success: false,
        message: 'doctorId and date query parameters are required.',
      })
    }

    const docIdNum = parseInt(doctorId, 10)
    const MAX_CAPACITY = 3

    const doctor = await Doctor.findOne({ id: docIdNum }).lean()
    const slots = doctor?.availableSlots || [
      '10:00 AM',
      '11:30 AM',
      '02:00 PM',
      '04:30 PM',
      '06:00 PM',
    ]

    // Group and count booked video consultations per timeslot for this doctor & date from VideoConsultation collection
    const bookings = await VideoConsultation.aggregate([
      {
        $match: {
          doctorId: docIdNum,
          appointmentDate: date,
          status: { $ne: 'Cancelled' },
        },
      },
      {
        $group: {
          _id: '$timeSlot',
          bookedCount: { $sum: 1 },
        },
      },
    ])

    const availability = {}
    slots.forEach((slot) => {
      const found = bookings.find((b) => b._id === slot)
      const booked = found ? found.bookedCount : 0
      const isPast = isSlotPast(date, slot)
      availability[slot] = {
        booked,
        remaining: Math.max(0, MAX_CAPACITY - booked),
        maxCapacity: MAX_CAPACITY,
        isFull: booked >= MAX_CAPACITY,
        isPast,
      }
    })

    return res.status(200).json({
      success: true,
      doctorId: docIdNum,
      date,
      maxCapacity: MAX_CAPACITY,
      availability,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve slot availability from MongoDB Atlas',
      error: error.message,
    })
  }
}

// @desc    Lookup video consultations, Consultation ID, and meeting links by phone number or ID
// @route   GET /api/video-consult/lookup/:identifier
export const lookupVideoConsultByPhone = async (req, res) => {
  try {
    const { identifier } = req.params
    if (!identifier || !identifier.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 10-digit mobile number or Consultation ID.',
      })
    }

    const cleanInput = identifier.trim()
    const cleanDigits = cleanInput.replace(/\D/g, '').slice(-10)

    const query = {
      $or: [
        { id: cleanInput },
        { appointmentId: cleanInput },
        ...(cleanDigits ? [{ patientPhone: cleanDigits }, { patientPhone: { $regex: cleanDigits } }] : []),
        { patientPhone: cleanInput },
      ],
    }

    const consultations = await VideoConsultation.find(query)
      .sort({ appointmentDate: -1, createdAt: -1 })
      .lean()

    // Also look up patient info if available
    let patient = null
    if (cleanDigits || cleanInput) {
      patient = await Patient.findOne({
        $or: [
          ...(cleanDigits ? [{ phone: cleanDigits }, { phone: { $regex: cleanDigits } }] : []),
          { phone: cleanInput },
          { id: cleanInput },
        ],
      }).lean()
    }

    if (consultations.length === 0 && !patient) {
      return res.status(404).json({
        success: false,
        message: `No video consultation found for "${cleanInput}". Please verify your 10-digit mobile number.`,
      })
    }

    return res.status(200).json({
      success: true,
      source: 'mongodb',
      count: consultations.length,
      patient: patient
        ? { id: patient.id, name: patient.name, phone: patient.phone }
        : consultations[0]
        ? {
            id: consultations[0].patientId,
            name: consultations[0].patientName,
            phone: consultations[0].patientPhone,
          }
        : null,
      data: consultations,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to lookup video consultations',
      error: error.message,
    })
  }
}

// @desc    Pre-check if a patient/phone is eligible to book a video consult slot (before payment)
// @route   GET /api/video-consult/check-eligibility
export const checkVideoConsultEligibility = async (req, res) => {
  try {
    const { doctorId, date, slot, phone } = req.query

    if (!doctorId || !date || !slot || !phone) {
      return res.status(400).json({
        success: false,
        eligible: false,
        message: 'doctorId, date, slot, and phone query parameters are required.',
      })
    }

    const docIdNum = parseInt(doctorId, 10)
    const rawPhone = phone.trim()
    const cleanDigits = rawPhone.replace(/\D/g, '').slice(-10)
    const cleanPhone = cleanDigits || rawPhone

    // 0. Verify slot has not already passed
    if (isSlotPast(date, slot)) {
      return res.status(400).json({
        success: false,
        eligible: false,
        slotPast: true,
        message: `The slot ${slot} on ${date} has already passed. Please choose an upcoming time slot or date.`,
      })
    }

    // 1. Check if patient already has an active video consult booked for this slot
    const phoneRegex = new RegExp(cleanPhone + '$')
    const existing = await VideoConsultation.findOne({
      doctorId: docIdNum,
      appointmentDate: date,
      timeSlot: slot,
      patientPhone: phoneRegex,
      status: { $ne: 'Cancelled' },
    })

    if (existing) {
      return res.status(409).json({
        success: false,
        eligible: false,
        alreadyBooked: true,
        message: `You (${cleanPhone}) already have a video consultation booked for ${slot} on ${date}.`,
      })
    }

    // 2. Check slot capacity (max 3 patients)
    const bookedCount = await VideoConsultation.countDocuments({
      doctorId: docIdNum,
      appointmentDate: date,
      timeSlot: slot,
      status: { $ne: 'Cancelled' },
    })

    if (bookedCount >= 3) {
      return res.status(409).json({
        success: false,
        eligible: false,
        slotFull: true,
        message: `The slot ${slot} on ${date} is full (3/3 patients already booked). Please pick another time slot.`,
      })
    }

    return res.status(200).json({
      success: true,
      eligible: true,
      message: 'Slot available and patient is eligible to proceed to payment.',
    })
  } catch (error) {
    console.error('Error checking video consult eligibility:', error)
    return res.status(500).json({
      success: false,
      eligible: false,
      message: 'Failed to verify slot eligibility. Please try again.',
      error: error.message,
    })
  }
}



