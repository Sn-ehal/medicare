import Appointment from '../models/Appointment.js'
import Patient from '../models/Patient.js'
import Doctor from '../models/Doctor.js'
import { isMongoConnected } from '../config/db.js'
import { isSlotPast } from '../utils/timeSlotHelper.js'

// In-memory fallback if database is temporarily disconnected
let memoryAppointments = []

// @desc    Book an appointment with a doctor
// @route   POST /api/appointments
export const bookAppointment = async (req, res) => {
  try {
    const {
      doctorId,
      patientName,
      patientPhone,
      patientEmail,
      appointmentDate,
      timeSlot,
      consultationType,
      symptoms,
      transactionId,
      paymentStatus,
      paymentMethod,
      amountPaid,
    } = req.body

    if (!doctorId || !patientName || !patientPhone || !appointmentDate || !timeSlot) {
      return res.status(400).json({
        success: false,
        message:
          'Please provide doctorId, patientName, patientPhone, appointmentDate, and timeSlot.',
      })
    }

    // Verify slot has not already passed
    if (isSlotPast(appointmentDate, timeSlot)) {
      return res.status(400).json({
        success: false,
        message: `The slot ${timeSlot} on ${appointmentDate} has already passed. Please choose an upcoming time slot or date.`,
      })
    }

    const cleanTransactionId = (transactionId || '').trim()
    if (!cleanTransactionId) {
      return res.status(400).json({
        success: false,
        message: 'UPI Transaction ID / UTR is required to confirm booking.',
      })
    }

    const docIdNum = parseInt(doctorId, 10)

    // 1. Lookup Doctor directly in MongoDB Atlas
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

    // 2. Maximum 3 Patients Allowed Per Doctor Time Slot
    const MAX_SLOT_CAPACITY = 3

    // Prevent duplicate booking for the exact same patient on the same slot
    const alreadyBookedByPatient = await Appointment.findOne({
      doctorId: doctor.id,
      appointmentDate,
      timeSlot,
      patientPhone: cleanPhone,
      status: { $ne: 'Cancelled' },
    })

    if (alreadyBookedByPatient) {
      return res.status(409).json({
        success: false,
        message: `You (${cleanPhone}) already have an appointment booked for ${timeSlot} on ${appointmentDate}.`,
      })
    }

    // Count currently booked patients in MongoDB Atlas for this doctor, date, and timeslot
    const bookedCount = await Appointment.countDocuments({
      doctorId: doctor.id,
      appointmentDate,
      timeSlot,
      status: { $ne: 'Cancelled' },
    })

    // If already 3 patients booked, reject new appointment
    if (bookedCount >= MAX_SLOT_CAPACITY) {
      return res.status(409).json({
        success: false,
        message: `The slot ${timeSlot} on ${appointmentDate} is full (${bookedCount}/${MAX_SLOT_CAPACITY} patients already booked). Please choose another time slot.`,
        bookedCount,
        maxCapacity: MAX_SLOT_CAPACITY,
      })
    }

    // Since bookedCount is less than 3, accept! Assign slot token number (1, 2, or 3)
    const slotNumber = bookedCount + 1

    // Generate unique Appointment ID
    const appointmentId = `APT-${Date.now().toString().slice(-4)}${Math.floor(100 + Math.random() * 900)}`

    // 3. Create Dedicated Patient Record in MongoDB Atlas for this booking
    const patientId = `PAT-${Date.now().toString().slice(-4)}${Math.floor(100 + Math.random() * 900)}`

    const appointmentHistoryEntry = {
      appointmentId,
      consultationId: appointmentId,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      date: appointmentDate,
      timeSlot,
      slotNumber,
      consultationType: 'In-Clinic',
      fee: doctor.fee || '₹600',
      transactionId: cleanTransactionId,
      paymentStatus: paymentStatus || 'Paid',
      bookedAt: new Date(),
    }

    await Patient.create({
      id: patientId,
      appointmentId,
      name: cleanName,
      phone: cleanPhone,
      email: cleanEmail,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      consultationType: 'In-Clinic',
      appointmentDate,
      timeSlot,
      totalAppointments: 1,
      lastBookingDate: appointmentDate,
      lastTransactionId: cleanTransactionId,
      lastAppointmentId: appointmentId,
      appointmentHistory: [appointmentHistoryEntry],
    })

    // 4. Create Appointment in MongoDB Atlas
    const newAppointment = {
      id: appointmentId,
      patientId: patientId || `PAT-${cleanDigits.slice(-6)}`,
      patientName: cleanName,
      patientPhone: cleanPhone,
      patientEmail: cleanEmail,
      doctorId: Number(doctor.id),
      doctorName: doctor.name,
      specialty: doctor.specialty,
      clinic: doctor.clinic || 'MediCare Clinic',
      appointmentDate,
      timeSlot,
      slotNumber,
      consultationType: 'In-Clinic',
      fee: doctor.fee || '₹600',
      transactionId: cleanTransactionId,
      paymentStatus: paymentStatus || 'Paid',
      paymentMethod: paymentMethod || 'UPI QR',
      amountPaid: amountPaid || doctor.fee || '₹600',
      symptoms: symptoms || '',
      status: 'Confirmed',
    }

    const created = await Appointment.create(newAppointment)

    return res.status(201).json({
      success: true,
      source: 'mongodb',
      message: `Appointment confirmed! (Patient #${slotNumber} of ${MAX_SLOT_CAPACITY} for ${timeSlot})`,
      data: created,
      patient: {
        id: patientId,
        name: cleanName,
        phone: cleanPhone,
        lastTransactionId: cleanTransactionId,
        lastAppointmentId: appointmentId,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to book appointment',
      error: error.message,
    })
  }
}

// @desc    Get appointments list (filter by doctorId, patientId, or patientPhone)
// @route   GET /api/appointments
export const getAppointments = async (req, res) => {
  try {
    const { doctorId, patientId, patientPhone, date } = req.query

    const query = {}
    if (doctorId) query.doctorId = parseInt(doctorId, 10)
    if (patientId) query.patientId = patientId
    if (patientPhone) query.patientPhone = { $regex: patientPhone.trim(), $options: 'i' }
    if (date) query.appointmentDate = date

    const dbAppointments = await Appointment.find(query)
      .sort({ createdAt: -1 })
      .lean()

    return res.status(200).json({
      success: true,
      source: 'mongodb',
      count: dbAppointments.length,
      data: dbAppointments,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve appointments from MongoDB Atlas',
      error: error.message,
    })
  }
}

// @desc    Cancel an appointment
// @route   PATCH /api/appointments/:id/cancel
export const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params

    const apt = await Appointment.findOneAndUpdate(
      { id },
      { status: 'Cancelled' },
      { new: true }
    )

    if (!apt) {
      return res.status(404).json({ success: false, message: 'Appointment not found in MongoDB Atlas' })
    }

    return res.status(200).json({
      success: true,
      source: 'mongodb',
      message: 'Appointment cancelled successfully in MongoDB Atlas',
      data: apt,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to cancel appointment in MongoDB Atlas',
      error: error.message,
    })
  }
}

// @desc    Get real-time slot availability for a doctor on a specific date (capacity: up to 3 patients per slot)
// @route   GET /api/appointments/slot-availability?doctorId=...&date=...
export const getSlotAvailability = async (req, res) => {
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

    // Group and count booked appointments per timeslot for this doctor & date
    const bookings = await Appointment.aggregate([
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

// @desc    Pre-check if a patient/phone is eligible to book a specific slot (before payment)
// @route   GET /api/appointments/check-eligibility
export const checkAppointmentEligibility = async (req, res) => {
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

    // 1. Check if patient has already booked this exact slot for this doctor & date
    const phoneRegex = new RegExp(cleanPhone + '$')
    const existing = await Appointment.findOne({
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
        message: `You (${cleanPhone}) already have an appointment booked for ${slot} on ${date}.`,
      })
    }

    // 2. Check slot capacity (max 3 patients)
    const bookedCount = await Appointment.countDocuments({
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
        message: `The slot ${slot} on ${date} is full (3/3 patients already booked). Please choose another time slot.`,
      })
    }

    return res.status(200).json({
      success: true,
      eligible: true,
      message: 'Slot available and patient is eligible to proceed to payment.',
    })
  } catch (error) {
    console.error('Error checking appointment eligibility:', error)
    return res.status(500).json({
      success: false,
      eligible: false,
      message: 'Failed to verify slot eligibility. Please try again.',
      error: error.message,
    })
  }
}


