import mongoose from 'mongoose'

const appointmentSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    // Reference to Patient
    patientId: {
      type: String,
      required: true,
      index: true,
    },
    patientName: {
      type: String,
      required: true,
      trim: true,
    },
    patientPhone: {
      type: String,
      required: true,
      trim: true,
    },
    patientEmail: {
      type: String,
      default: '',
      trim: true,
    },
    // Reference to Doctor
    doctorId: {
      type: Number,
      required: true,
      index: true,
    },
    doctorName: {
      type: String,
      required: true,
    },
    specialty: {
      type: String,
      required: true,
    },
    clinic: {
      type: String,
      required: true,
    },
    // Booking details
    appointmentDate: {
      type: String,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
    },
    // Patient queue number for this specific time slot (Capacity: up to 3 patients)
    slotNumber: {
      type: Number,
      default: 1,
      min: 1,
      max: 3,
    },
    consultationType: {
      type: String,
      default: 'In-Clinic',
    },
    fee: {
      type: String,
      default: '₹600',
    },
    // Payment & UPI Transaction details
    transactionId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ['Paid', 'Pending', 'Verified', 'Failed'],
      default: 'Paid',
    },
    paymentMethod: {
      type: String,
      default: 'UPI QR',
    },
    amountPaid: {
      type: String,
      default: '',
    },
    symptoms: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Confirmed', 'Pending', 'Cancelled', 'Completed'],
      default: 'Confirmed',
    },
  },
  {
    timestamps: true,
  }
)

const Appointment =
  mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema)
export default Appointment
