import express from 'express'
import {
  getVideoDoctors,
  bookVideoConsult,
  getVideoConsultations,
  getVideoSlotAvailability,
  lookupVideoConsultByPhone,
  checkVideoConsultEligibility,
} from '../controllers/videoConsultController.js'

const router = express.Router()

router.get('/check-eligibility', checkVideoConsultEligibility)
router.get('/doctors', getVideoDoctors)
router.get('/slot-availability', getVideoSlotAvailability)
router.post('/book', bookVideoConsult)
router.get('/consultations', getVideoConsultations)
router.get('/lookup/:identifier', lookupVideoConsultByPhone)

export default router
