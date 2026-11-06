import express from 'express'
import {
  getPatients,
  getPatientById,
  syncPatientsEndpoint,
} from '../controllers/patientController.js'

const router = express.Router()

router.get('/', getPatients)
router.post('/sync', syncPatientsEndpoint)
router.get('/:identifier', getPatientById)

export default router
