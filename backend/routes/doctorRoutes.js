import express from 'express'
import {
  getDoctors,
  getDoctorById,
  getSpecialties,
  createDoctor,
  updateDoctor,
} from '../controllers/doctorController.js'

const router = express.Router()

// Meta routes
router.get('/meta/specialties', getSpecialties)

// Doctor CRUD & Search
router.get('/', getDoctors)
router.get('/:id', getDoctorById)
router.post('/', createDoctor)
router.put('/:id', updateDoctor)

export default router
