import mongoose from 'mongoose'

const doctorSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: [true, 'Doctor name is required'],
      trim: true,
    },
    specialty: {
      type: String,
      required: [true, 'Specialty is required'],
      trim: true,
    },
    education: {
      type: String,
      default: 'MBBS',
    },
    experienceYears: {
      type: Number,
      default: 5,
    },
    experience: {
      type: String,
      default: '5 yrs',
    },
    clinic: {
      type: String,
      required: [true, 'Clinic name is required'],
    },
    city: {
      type: String,
      default: 'Kolkata',
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 1,
      max: 5,
    },
    reviews: {
      type: Number,
      default: 100,
    },
    fee: {
      type: String,
      default: '₹600',
    },
    feeAmount: {
      type: Number,
      default: 600,
    },
    availability: {
      type: String,
      default: 'Available Today',
    },
    emoji: {
      type: String,
      default: '👨‍⚕️',
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
      default: 'male',
    },
    verified: {
      type: Boolean,
      default: true,
    },
    about: {
      type: String,
      default: '',
    },
    consultationTypes: {
      type: [String],
      default: ['In-Clinic'],
    },
    availableSlots: {
      type: [String],
      default: ['10:00 AM', '02:00 PM', '05:00 PM'],
    },
    contact: {
      type: String,
      default: '+91 99999-99999',
    },
  },
  {
    timestamps: true,
  }
)

const Doctor = mongoose.models.Doctor || mongoose.model('Doctor', doctorSchema)
export default Doctor
