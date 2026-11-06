import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { connectDB } from './config/db.js'
import doctorRoutes from './routes/doctorRoutes.js'
import appointmentRoutes from './routes/appointmentRoutes.js'
import patientRoutes from './routes/patientRoutes.js'
import videoConsultRoutes from './routes/videoConsultRoutes.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config()
if (!process.env.MONGO_URI) {
  dotenv.config({ path: path.join(__dirname, '.env') })
}

const app = express()
const PORT = process.env.PORT || 5000

// Initialize MongoDB Connection (with auto-seeder & resilient fallback)
connectDB()

// Middleware
app.use(
  cors({
    origin: '*', // Allow frontend development requests
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Normalize duplicate slashes in incoming request URLs (e.g. //api -> /api)
app.use((req, res, next) => {
  if (req.url.startsWith('//')) {
    req.url = req.url.replace(/^\/+/, '/')
  }
  next()
})

// Simple request logging
app.use((req, res, next) => {
  const time = new Date().toLocaleTimeString()
  console.log(`[${time}] ${req.method} ${req.originalUrl}`)
  next()
})

// Root & Healthcheck
app.get('/', (req, res) => {
  res.json({
    name: 'MediCare Doctor Management System API',
    status: 'online',
    version: '1.0.0',
    documentation: {
      doctors: '/api/doctors',
      specialties: '/api/doctors/meta/specialties',
      appointments: '/api/appointments',
      patients: '/api/patients',
    },
  })
})

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() })
})

// API Routes
app.use('/api/doctors', doctorRoutes)
app.use('/api/appointments', appointmentRoutes)
app.use('/api/patients', patientRoutes)
app.use('/api/video-consult', videoConsultRoutes)

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.method} ${req.originalUrl} not found`,
  })
})

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack)
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  })
})

// Start Server
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log('==================================================')
    console.log(` MediCare Express Backend running on port ${PORT}`)
    console.log(` Base URL: http://localhost:${PORT}`)
    console.log(` Doctors API: http://localhost:${PORT}/api/doctors`)
    console.log(` Specialties API: http://localhost:${PORT}/api/doctors/meta/specialties`)
    console.log(` Appointments API: http://localhost:${PORT}/api/appointments`)
    console.log(` Patients API: http://localhost:${PORT}/api/patients`)
    console.log('==================================================')
  })
}

export default app
