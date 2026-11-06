import express from 'express'
import {
  bookAppointment,
  getAppointments,
  cancelAppointment,
  getSlotAvailability,
  checkAppointmentEligibility,
} from '../controllers/appointmentController.js'

const router = express.Router()

router.get('/check-eligibility', checkAppointmentEligibility)
router.get('/slot-availability', getSlotAvailability)
router.post('/book', bookAppointment)
router.post('/', bookAppointment)
router.get('/', getAppointments)
router.patch('/:id/cancel', cancelAppointment)

export default router
