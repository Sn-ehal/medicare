import Patient from '../models/Patient.js'
import Appointment from '../models/Appointment.js'
import VideoConsultation from '../models/VideoConsultation.js'

/**
 * Ensures all patients who have taken an appointment in Find Doctor (In-Clinic)
 * or Video Consult are accurately stored in the Patient database.
 * Every booking corresponds 1-to-1 to a distinct patient record.
 */
export async function syncPatientsFromBookings() {
  try {
    const [appointments, videoConsultations] = await Promise.all([
      Appointment.find({}).lean(),
      VideoConsultation.find({}).lean(),
    ])

    // 1. Sync In-Clinic Appointments (Find Doctor)
    for (const apt of appointments) {
      const cleanPhone = (apt.patientPhone || '').trim()
      const cleanName = (apt.patientName || '').trim()
      if (!apt.id) continue

      let existing = await Patient.findOne({
        $or: [{ appointmentId: apt.id }, { lastAppointmentId: apt.id }, { id: apt.patientId }],
      })

      const historyEntry = {
        appointmentId: apt.id,
        consultationId: apt.id,
        doctorName: apt.doctorName,
        specialty: apt.specialty,
        date: apt.appointmentDate,
        timeSlot: apt.timeSlot,
        slotNumber: apt.slotNumber || 1,
        fee: apt.fee || '₹600',
        transactionId: apt.transactionId || '',
        paymentStatus: apt.paymentStatus || 'Paid',
        consultationType: 'In-Clinic',
        videoRoomUrl: '',
        bookedAt: apt.createdAt || new Date(),
      }

      if (existing) {
        if (cleanName) existing.name = cleanName
        if (cleanPhone) existing.phone = cleanPhone
        if (apt.patientEmail) existing.email = apt.patientEmail.trim()
        existing.appointmentId = apt.id
        existing.doctorName = apt.doctorName
        existing.specialty = apt.specialty
        existing.consultationType = 'In-Clinic'
        existing.appointmentDate = apt.appointmentDate
        existing.timeSlot = apt.timeSlot
        existing.lastBookingDate = apt.appointmentDate
        existing.lastTransactionId = apt.transactionId || existing.lastTransactionId
        existing.lastAppointmentId = apt.id
        existing.appointmentHistory = [historyEntry]
        await existing.save()
      } else {
        const newPatId = apt.patientId || `PAT-${Date.now().toString().slice(-4)}${Math.floor(100 + Math.random() * 900)}`
        try {
          await Patient.create({
            id: newPatId,
            appointmentId: apt.id,
            name: cleanName || 'Patient',
            phone: cleanPhone,
            email: (apt.patientEmail || '').trim(),
            gender: 'Not Specified',
            age: null,
            doctorName: apt.doctorName,
            specialty: apt.specialty,
            consultationType: 'In-Clinic',
            appointmentDate: apt.appointmentDate,
            timeSlot: apt.timeSlot,
            totalAppointments: 1,
            lastBookingDate: apt.appointmentDate,
            lastTransactionId: apt.transactionId || '',
            lastAppointmentId: apt.id,
            appointmentHistory: [historyEntry],
            createdAt: apt.createdAt || new Date(),
          })
        } catch (syncErr) {
          console.warn('[Patient Sync Insert In-Clinic]:', syncErr.message)
        }
      }
    }

    // 2. Sync Video Consultations
    for (const vc of videoConsultations) {
      const cleanPhone = (vc.patientPhone || '').trim()
      const cleanName = (vc.patientName || '').trim()
      if (!vc.id) continue

      let existing = await Patient.findOne({
        $or: [{ appointmentId: vc.id }, { lastAppointmentId: vc.id }, { id: vc.patientId }],
      })

      const historyEntry = {
        appointmentId: vc.id,
        consultationId: vc.id,
        doctorName: vc.doctorName,
        specialty: vc.specialty,
        date: vc.appointmentDate,
        timeSlot: vc.timeSlot,
        slotNumber: vc.slotNumber || 1,
        fee: vc.fee || '₹800',
        transactionId: vc.transactionId || '',
        paymentStatus: vc.paymentStatus || 'Paid',
        consultationType: 'Video Consult',
        videoRoomUrl: vc.videoRoomUrl || '',
        bookedAt: vc.createdAt || new Date(),
      }

      if (existing) {
        if (cleanName) existing.name = cleanName
        if (cleanPhone) existing.phone = cleanPhone
        if (vc.patientEmail) existing.email = vc.patientEmail.trim()
        existing.appointmentId = vc.id
        existing.doctorName = vc.doctorName
        existing.specialty = vc.specialty
        existing.consultationType = 'Video Consult'
        existing.appointmentDate = vc.appointmentDate
        existing.timeSlot = vc.timeSlot
        existing.lastBookingDate = vc.appointmentDate
        existing.lastTransactionId = vc.transactionId || existing.lastTransactionId
        existing.lastAppointmentId = vc.id
        existing.appointmentHistory = [historyEntry]
        await existing.save()
      } else {
        const newPatId = vc.patientId || `PAT-${Date.now().toString().slice(-4)}${Math.floor(100 + Math.random() * 900)}`
        try {
          await Patient.create({
            id: newPatId,
            appointmentId: vc.id,
            name: cleanName || 'Patient',
            phone: cleanPhone,
            email: (vc.patientEmail || '').trim(),
            gender: 'Not Specified',
            age: null,
            doctorName: vc.doctorName,
            specialty: vc.specialty,
            consultationType: 'Video Consult',
            appointmentDate: vc.appointmentDate,
            timeSlot: vc.timeSlot,
            totalAppointments: 1,
            lastBookingDate: vc.appointmentDate,
            lastTransactionId: vc.transactionId || '',
            lastAppointmentId: vc.id,
            appointmentHistory: [historyEntry],
            createdAt: vc.createdAt || new Date(),
          })
        } catch (syncErr) {
          console.warn('[Patient Sync Insert Video]:', syncErr.message)
        }
      }
    }

    const totalSynced = await Patient.countDocuments()
    return {
      success: true,
      totalPatients: totalSynced,
      totalInClinic: appointments.length,
      totalVideoConsults: videoConsultations.length,
    }
  } catch (err) {
    console.error('[Patient Sync Error]:', err.message)
    return { success: false, error: err.message }
  }
}
