import mongoose from 'mongoose'

const videoConsultationSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    appointmentId: {
      type: String,
      default: '',
      index: true,
    },
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
      default: 'MediCare Virtual Telehealth Clinic',
    },
    appointmentDate: {
      type: String,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
    },
    slotNumber: {
      type: Number,
      default: 1,
      min: 1,
      max: 3,
    },
    consultationType: {
      type: String,
      default: 'Video Consult',
    },
    fee: {
      type: String,
      required: true,
    },
    amountPaid: {
      type: String,
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ['Paid', 'Pending', 'Verified', 'Refunded'],
      default: 'Paid',
    },
    paymentMethod: {
      type: String,
      default: 'UPI QR',
    },
    videoRoomUrl: {
      type: String,
      required: true,
    },
    meetingCode: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Scheduled', 'InProgress', 'Completed', 'Cancelled'],
      default: 'Scheduled',
    },
    symptoms: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
)

const VideoConsultation =
  mongoose.models.VideoConsultation ||
  mongoose.model('VideoConsultation', videoConsultationSchema)

export default VideoConsultation
