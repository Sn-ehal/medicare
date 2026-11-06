import Doctor from '../models/Doctor.js'
import { isMongoConnected } from '../config/db.js'

// @desc    Get all doctors with filtering, searching, and sorting from MongoDB Atlas
// @route   GET /api/doctors
export const getDoctors = async (req, res) => {
  try {
    const {
      specialty,
      search,
      city,
      consultationType,
      minRating,
      sort,
    } = req.query

    const query = {}

    if (specialty && specialty.toLowerCase() !== 'all') {
      query.specialty = { $regex: new RegExp(`^${specialty}$`, 'i') }
    }

    if (city && city.toLowerCase() !== 'all') {
      query.city = { $regex: new RegExp(city, 'i') }
    }

    if (consultationType) {
      query.consultationTypes = { $regex: new RegExp(consultationType, 'i') }
    }

    if (minRating) {
      const min = parseFloat(minRating)
      if (!isNaN(min)) query.rating = { $gte: min }
    }

    if (search && search.trim() !== '') {
      const term = search.trim()
      query.$or = [
        { name: { $regex: term, $options: 'i' } },
        { specialty: { $regex: term, $options: 'i' } },
        { clinic: { $regex: term, $options: 'i' } },
        { city: { $regex: term, $options: 'i' } },
        { education: { $regex: term, $options: 'i' } },
        { about: { $regex: term, $options: 'i' } },
      ]
    }

    let sortOption = {}
    if (sort === 'rating_desc') sortOption = { rating: -1 }
    else if (sort === 'fee_asc') sortOption = { feeAmount: 1 }
    else if (sort === 'fee_desc') sortOption = { feeAmount: -1 }
    else if (sort === 'exp_desc') sortOption = { experienceYears: -1 }

    // Exclude doctors assigned to Video Consult (1 top specialist per specialty)
    if (req.query.includeVideo !== 'true') {
      const videoDocs = await Doctor.aggregate([
        { $sort: { rating: -1, reviews: -1 } },
        { $group: { _id: '$specialty', doctorId: { $first: '$id' } } },
      ])
      const videoDoctorIds = videoDocs.map((d) => d.doctorId)
      query.id = { $nin: videoDoctorIds }
    }

    const dbDoctors = await Doctor.find(query).sort(sortOption).lean()

    return res.status(200).json({
      success: true,
      source: 'mongodb',
      count: dbDoctors.length,
      note: 'Video consult specialists are excluded from Find Doctor for clean separation',
      data: dbDoctors,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve doctors from MongoDB Atlas',
      error: error.message,
    })
  }
}

// @desc    Get single doctor by ID from MongoDB Atlas
// @route   GET /api/doctors/:id
export const getDoctorById = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10)
    const doctor = await Doctor.findOne({ id }).lean()

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: `Doctor with id ${req.params.id} not found in database`,
      })
    }

    res.status(200).json({ success: true, source: 'mongodb', data: doctor })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching doctor details',
      error: error.message,
    })
  }
}

// @desc    Get list of all distinct specialties with doctor counts from MongoDB Atlas
// @route   GET /api/doctors/meta/specialties
export const getSpecialties = async (req, res) => {
  try {
    const videoDocs = await Doctor.aggregate([
      { $sort: { rating: -1, reviews: -1 } },
      { $group: { _id: '$specialty', doctorId: { $first: '$id' } } },
    ])
    const videoDoctorIds = videoDocs.map((d) => d.doctorId)

    const dbSpecialties = await Doctor.aggregate([
      { $match: { id: { $nin: videoDoctorIds } } },
      { $group: { _id: '$specialty', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ])

    const names = ['All', ...dbSpecialties.map((s) => s._id)]
    const list = dbSpecialties.map((s) => ({ name: s._id, count: s.count }))

    return res.status(200).json({
      success: true,
      source: 'mongodb',
      count: names.length,
      data: names,
      specialtiesWithCounts: list,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching specialties from MongoDB Atlas',
      error: error.message,
    })
  }
}

// @desc    Add a new doctor to MongoDB Atlas
// @route   POST /api/doctors
export const createDoctor = async (req, res) => {
  try {
    const {
      name,
      specialty,
      education,
      experienceYears,
      clinic,
      city,
      feeAmount,
      about,
      consultationTypes,
      availableSlots,
      contact,
      gender,
      emoji,
    } = req.body

    if (!name || !specialty || !clinic) {
      return res.status(400).json({
        success: false,
        message: 'Name, specialty, and clinic are required fields.',
      })
    }

    const lastDoc = await Doctor.findOne().sort({ id: -1 })
    const nextId = lastDoc && lastDoc.id ? lastDoc.id + 1 : 1

    const newDoc = {
      id: nextId,
      name,
      specialty,
      education: education || 'MBBS',
      experienceYears: Number(experienceYears) || 5,
      experience: `${experienceYears || 5} yrs`,
      clinic,
      city: city || 'Kolkata',
      rating: 5.0,
      reviews: 1,
      fee: feeAmount ? `₹${feeAmount}` : '₹500',
      feeAmount: Number(feeAmount) || 500,
      availability: 'Available Today',
      gender: gender || 'male',
      emoji: emoji || (gender === 'female' ? '👩‍⚕️' : '👨‍⚕️'),
      verified: true,
      about: about || 'Dedicated medical specialist.',
      consultationTypes: consultationTypes || ['In-Clinic'],
      availableSlots: availableSlots || ['10:00 AM', '02:00 PM', '05:00 PM'],
      contact: contact || '+91 99999-99999',
    }

    const created = await Doctor.create(newDoc)

    res.status(201).json({
      success: true,
      source: 'mongodb',
      message: 'Doctor added successfully to MongoDB Atlas',
      data: created,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create doctor in MongoDB Atlas',
      error: error.message,
    })
  }
}

// @desc    Update an existing doctor profile in MongoDB Atlas
// @route   PUT /api/doctors/:id
export const updateDoctor = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10)
    const updates = req.body

    const updated = await Doctor.findOneAndUpdate({ id }, updates, {
      new: true,
      runValidators: true,
    })

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Doctor not found in database' })
    }

    res.status(200).json({
      success: true,
      source: 'mongodb',
      message: 'Doctor updated successfully in MongoDB Atlas!',
      data: updated,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update doctor in MongoDB Atlas',
      error: error.message,
    })
  }
}
