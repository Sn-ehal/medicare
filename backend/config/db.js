import mongoose from 'mongoose'
import Doctor from '../models/Doctor.js'

let isConnected = false

export const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/medicare'

  try {
    mongoose.set('strictQuery', false)
    const conn = await mongoose.connect(mongoURI)

    isConnected = true
    console.log(`[MongoDB Atlas] Connected successfully: ${conn.connection.host}/${conn.connection.name}`)

    const count = await Doctor.countDocuments()
    console.log(`[MongoDB Atlas] Database active with ${count} doctors in cloud.`)

    // Automatically sync and verify all patients from both Find Doctor & Video Consult
    import('../utils/patientSync.js')
      .then((m) => m.syncPatientsFromBookings())
      .then((res) => {
        if (res && res.success) {
          console.log(`[MongoDB Atlas] Patient sync active: ${res.totalPatients} verified patient(s) in database.`)
        }
      })
      .catch((err) => console.warn('[Patient Sync Warning]:', err.message))
  } catch (error) {
    isConnected = false
    console.error(`[MongoDB Atlas Error] Failed to connect: ${error.message}`)
  }
}

export const isMongoConnected = () => isConnected
