import mongoose from 'mongoose'

const patientSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: [true, 'Patient name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Patient mobile number is required'],
      trim: true,
      index: true,
    },
    appointmentId: {
      type: String,
      default: '',
      index: true,
    },
    doctorName: {
      type: String,
      default: '',
    },
    specialty: {
      type: String,
      default: '',
    },
    consultationType: {
      type: String,
      enum: ['In-Clinic', 'Video Consult'],
      default: 'In-Clinic',
    },
    appointmentDate: {
      type: String,
      default: '',
    },
    timeSlot: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      default: '',
      trim: true,
    },
    gender: {
      type: String,
      default: 'Not Specified',
    },
    age: {
      type: Number,
      default: null,
    },
    totalAppointments: {
      type: Number,
      default: 1,
    },
    lastBookingDate: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
    },
    lastTransactionId: {
      type: String,
      default: '',
      trim: true,
    },
    lastAppointmentId: {
      type: String,
      default: '',
      trim: true,
    },
    appointmentHistory: [
      {
        appointmentId: String,
        consultationId: String,
        doctorName: String,
        specialty: String,
        date: String,
        timeSlot: String,
        slotNumber: {
          type: Number,
          default: 1,
        },
        fee: String,
        transactionId: String,
        paymentStatus: String,
        consultationType: {
          type: String,
          default: 'In-Clinic',
        },
        videoRoomUrl: {
          type: String,
          default: '',
        },
        bookedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
)

const Patient = mongoose.models.Patient || mongoose.model('Patient', patientSchema)
export default Patient
