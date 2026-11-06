import mongoose from 'mongoose'
import Patient from '../models/Patient.js'
import Appointment from '../models/Appointment.js'
import VideoConsultation from '../models/VideoConsultation.js'
import { isMongoConnected } from '../config/db.js'
import { syncPatientsFromBookings } from '../utils/patientSync.js'

// In-memory fallback if database is offline
let memoryPatients = []

// @desc    Get all patients from MongoDB Atlas (includes both Find Doctor & Video Consult patients)
// @route   GET /api/patients
export const getPatients = async (req, res) => {
  try {
    const { search, phone } = req.query

    if (mongoose.connection.readyState === 1 || isMongoConnected()) {
      const query = {}
      if (phone) query.phone = { $regex: phone.trim(), $options: 'i' }
      if (search) {
        query.$or = [
          { name: { $regex: search.trim(), $options: 'i' } },
          { phone: { $regex: search.trim(), $options: 'i' } },
          { email: { $regex: search.trim(), $options: 'i' } },
        ]
      }
      const patients = await Patient.find(query).sort({ updatedAt: -1 }).lean()
      return res.status(200).json({
        success: true,
        source: 'mongodb',
        count: patients.length,
        data: patients,
      })
    }

    return res.status(200).json({
      success: true,
      source: 'memory',
      count: memoryPatients.length,
      data: memoryPatients,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve patients from MongoDB',
      error: error.message,
    })
  }
}

// @desc    Sync and aggregate all patients from both Find Doctor & Video Consult
// @route   POST /api/patients/sync
export const syncPatientsEndpoint = async (req, res) => {
  try {
    const result = await syncPatientsFromBookings()
    return res.status(200).json(result)
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to sync patients',
      error: error.message,
    })
  }
}

// @desc    Get single patient by ID, Phone, or Name with appointment history
// @route   GET /api/patients/:identifier
export const getPatientById = async (req, res) => {
  try {
    const { identifier } = req.params
    if (!identifier || !identifier.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide a valid Patient ID, Phone Number, or Appointment ID.' })
    }

    const cleanInput = identifier.trim()
    const cleanDigits = cleanInput.replace(/\D/g, '').slice(-10)

    if (mongoose.connection.readyState === 1 || isMongoConnected()) {
      const searchTerms = [{ id: cleanInput }]
      if (cleanDigits) {
        searchTerms.push({ phone: cleanDigits })
        searchTerms.push({ phone: cleanInput })
        searchTerms.push({ phone: { $regex: cleanDigits } })
      }
      searchTerms.push({ name: { $regex: new RegExp(`^${cleanInput}$`, 'i') } })

      let patient = await Patient.findOne({ $or: searchTerms }).lean()

      // Fetch all appointments (In-Clinic) and video consultations
      const phoneToMatch = cleanDigits || cleanInput
      const [appointments, videoConsultations] = await Promise.all([
        Appointment.find({
          $or: [
            ...(patient ? [{ patientId: patient.id }, { patientPhone: patient.phone }] : []),
            { patientPhone: { $regex: phoneToMatch } },
            { id: cleanInput },
          ],
        })
          .sort({ appointmentDate: -1, createdAt: -1 })
          .lean(),
        VideoConsultation.find({
          $or: [
            ...(patient ? [{ patientId: patient.id }, { patientPhone: patient.phone }] : []),
            { patientPhone: { $regex: phoneToMatch } },
            { id: cleanInput },
          ],
        })
          .sort({ appointmentDate: -1, createdAt: -1 })
          .lean(),
      ])

      if (!patient) {
        // If not in Patient collection but appointments exist, synthesize patient record
        if (appointments.length > 0 || videoConsultations.length > 0) {
          const sample = appointments[0] || videoConsultations[0]
          return res.status(200).json({
            success: true,
            source: 'mongodb',
            data: {
              id: sample.patientId || `PAT-${Math.floor(100 + Math.random() * 900)}`,
              name: sample.patientName,
              phone: sample.patientPhone,
              email: sample.patientEmail || '',
              totalAppointments: appointments.length + videoConsultations.length,
              lastBookingDate: sample.appointmentDate,
              lastAppointmentId: sample.id,
              appointments,
              videoConsultations,
            },
          })
        }
        return res.status(404).json({
          success: false,
          message: `No patient or appointment records found for "${cleanInput}". Please verify your phone number.`,
        })
      }

      return res.status(200).json({
        success: true,
        source: 'mongodb',
        data: {
          ...patient,
          appointments,
          videoConsultations,
        },
      })
    }

    const patient = memoryPatients.find(
      (p) => p.id === cleanInput || p.phone === cleanInput || (cleanDigits && p.phone.includes(cleanDigits))
    )

    if (!patient) {
      return res.status(404).json({ success: false, message: `No patient records found for "${cleanInput}".` })
    }

    return res.status(200).json({
      success: true,
      source: 'memory',
      data: {
        ...patient,
        appointments: [],
        videoConsultations: [],
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve patient details',
      error: error.message,
    })
  }
}
