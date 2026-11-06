import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import UpiQrCode from '../components/UpiQrCode'
import {
  isSlotPast,
  getTodayDateString,
  getTomorrowDateString,
  getFirstAvailableSlot,
} from '../utils/timeSlotHelper'
import './VideoConsultPage.css'

const BACKEND_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname === '0.0.0.0')
    ? 'http://localhost:5000'
    : '')

// Default fallback 1 doctor per specialty (13 doctors)
const DEFAULT_VIDEO_DOCTORS = [
  {
    id: 1,
    name: 'Dr. Sonia sharma',
    specialty: 'Cardiologist',
    gender: 'female',
    education: 'MBBS, MD - Cardiology, FACC',
    clinic: 'Apollo Clinic, Bandra West',
    rating: 4.9,
    reviews: 1420,
    experience: '15 yrs',
    fee: '₹800',
    videoAvailable: true,
    availableSlots: ['10:00 AM', '11:30 AM', '02:00 PM', '04:30 PM', '06:00 PM'],
    videoLanguages: ['English', 'Hindi'],
    emoji: '👩‍⚕️',
  },
  {
    id: 5,
    name: 'Dr. Neha Kapoor',
    specialty: 'Dermatologist',
    gender: 'female',
    education: 'MBBS, MD - Dermatology & Cosmetology',
    clinic: 'Skin Renaissance Centre, GK-II',
    rating: 4.9,
    reviews: 1120,
    experience: '12 yrs',
    fee: '₹700',
    videoAvailable: true,
    availableSlots: ['10:00 AM', '11:30 AM', '02:00 PM', '05:00 PM'],
    videoLanguages: ['English', 'Hindi', 'Punjabi'],
    emoji: '👩‍⚕️',
  },
  {
    id: 9,
    name: 'Dr. Anita Desai',
    specialty: 'Pediatrician',
    gender: 'female',
    education: 'MBBS, DCH, DNB - Pediatrics',
    clinic: 'Rainbow Child Clinic, Indiranagar',
    rating: 4.9,
    reviews: 2450,
    experience: '18 yrs',
    fee: '₹800',
    videoAvailable: true,
    availableSlots: ['10:00 AM', '01:00 PM', '03:30 PM', '06:00 PM'],
    videoLanguages: ['English', 'Hindi', 'Kannada'],
    emoji: '👩‍⚕️',
  },
  {
    id: 14,
    name: 'Dr. Sharmistha Roy',
    specialty: 'Gynecologist',
    gender: 'female',
    education: 'MBBS, MS - Obstetrics & Gynaecology, FICOG',
    clinic: 'Fortis Hospital, Anandapur',
    rating: 4.9,
    reviews: 1380,
    experience: '16 yrs',
    fee: '₹900',
    videoAvailable: true,
    availableSlots: ['10:30 AM', '12:00 PM', '02:30 PM', '05:00 PM'],
    videoLanguages: ['English', 'Hindi', 'Bengali'],
    emoji: '👩‍⚕️',
  },
  {
    id: 11,
    name: 'Dr. Pradeep Bansal',
    specialty: 'Orthopedic',
    gender: 'male',
    education: 'MBBS, MS - Orthopaedics, M.Ch (UK)',
    clinic: 'Max Super Speciality Hospital, Saket',
    rating: 4.9,
    reviews: 1620,
    experience: '20 yrs',
    fee: '₹1100',
    videoAvailable: true,
    availableSlots: ['10:00 AM', '12:00 PM', '04:00 PM', '06:00 PM'],
    videoLanguages: ['English', 'Hindi'],
    emoji: '👨‍⚕️',
  },
  {
    id: 17,
    name: 'Dr. Subhashish Bhattacharya',
    specialty: 'Neurologist',
    gender: 'male',
    education: 'MBBS, MD, DM - Neurology (AIIMS)',
    clinic: 'Apollo Gleneagles Hospital, Salt Lake',
    rating: 4.9,
    reviews: 1890,
    experience: '22 yrs',
    fee: '₹1000',
    videoAvailable: true,
    availableSlots: ['11:00 AM', '02:00 PM', '04:30 PM', '06:30 PM'],
    videoLanguages: ['English', 'Hindi', 'Bengali'],
    emoji: '👨‍⚕️',
  },
  {
    id: 21,
    name: 'Dr. Sandeep Rao',
    specialty: 'General Physician',
    gender: 'male',
    education: 'MBBS, MD - Internal Medicine',
    clinic: 'Manipal Hospital, Old Airport Road',
    rating: 4.9,
    reviews: 2150,
    experience: '14 yrs',
    fee: '₹650',
    videoAvailable: true,
    availableSlots: ['09:30 AM', '11:30 AM', '02:00 PM', '04:00 PM', '06:00 PM'],
    videoLanguages: ['English', 'Hindi', 'Kannada'],
    emoji: '👨‍⚕️',
  },
  {
    id: 24,
    name: 'Dr. Rohan Iyer',
    specialty: 'Psychiatrist',
    gender: 'male',
    education: 'MBBS, MD - Psychiatry, Clinical Neuroscience',
    clinic: 'NIMHANS Mind Health Clinic, Jayanagar',
    rating: 4.9,
    reviews: 1730,
    experience: '13 yrs',
    fee: '₹1000',
    videoAvailable: true,
    availableSlots: ['10:00 AM', '01:00 PM', '03:30 PM', '06:00 PM'],
    videoLanguages: ['English', 'Hindi', 'Tamil'],
    emoji: '👨‍⚕️',
  },
  {
    id: 38,
    name: 'Dr. Saswati Mukherjee',
    specialty: 'ENT Specialist',
    gender: 'female',
    education: 'MBBS, MS - ENT, Head & Neck Surgery',
    clinic: 'Columbia Asia Hospital, Salt Lake',
    rating: 4.9,
    reviews: 940,
    experience: '12 yrs',
    fee: '₹700',
    videoAvailable: true,
    availableSlots: ['10:00 AM', '12:00 PM', '03:00 PM', '05:30 PM'],
    videoLanguages: ['English', 'Hindi', 'Bengali'],
    emoji: '👩‍⚕️',
  },
  {
    id: 28,
    name: 'Dr. Ritu Chawla',
    specialty: 'Ophthalmologist',
    gender: 'female',
    education: 'MBBS, MS - Ophthalmology, Fellowship Cornea',
    clinic: 'Centre for Sight, Safdarjung Enclave',
    rating: 4.9,
    reviews: 1290,
    experience: '15 yrs',
    fee: '₹700',
    videoAvailable: true,
    availableSlots: ['10:00 AM', '11:30 AM', '02:00 PM', '04:30 PM'],
    videoLanguages: ['English', 'Hindi'],
    emoji: '👩‍⚕️',
  },
  {
    id: 27,
    name: 'Dr. Ganesh Hegde',
    specialty: 'Endocrinologist',
    gender: 'male',
    education: 'MBBS, MD, DM - Endocrinology (PGI Chandigarh)',
    clinic: 'Fortis Hospital, Bannerghatta Road',
    rating: 4.9,
    reviews: 1180,
    experience: '17 yrs',
    fee: '₹950',
    videoAvailable: true,
    availableSlots: ['11:00 AM', '01:30 PM', '03:30 PM', '05:30 PM'],
    videoLanguages: ['English', 'Hindi', 'Kannada'],
    emoji: '👨‍⚕️',
  },
  {
    id: 31,
    name: 'Dr. Jayanta Paul',
    specialty: 'Gastroenterologist',
    gender: 'male',
    education: 'MBBS, MD, DM - Gastroenterology',
    clinic: 'Medica Superspecialty Hospital, Mukundapur',
    rating: 4.9,
    reviews: 1540,
    experience: '16 yrs',
    fee: '₹950',
    videoAvailable: true,
    availableSlots: ['10:00 AM', '12:30 PM', '03:00 PM', '05:00 PM'],
    videoLanguages: ['English', 'Hindi', 'Bengali'],
    emoji: '👨‍⚕️',
  },
  {
    id: 34,
    name: 'Dr. Gaurav Mittal',
    specialty: 'Dentist',
    gender: 'male',
    education: 'BDS, MDS - Oral & Maxillofacial Surgery',
    clinic: 'Clove Dental Supercentre, Greater Kailash',
    rating: 4.9,
    reviews: 1840,
    experience: '14 yrs',
    fee: '₹500',
    videoAvailable: true,
    availableSlots: ['10:00 AM', '11:30 AM', '02:00 PM', '04:30 PM', '06:00 PM'],
    videoLanguages: ['English', 'Hindi'],
    emoji: '👨‍⚕️',
  },
]

const ALL_SPECIALTIES = [
  'All',
  'Cardiologist',
  'Dentist',
  'Dermatologist',
  'ENT Specialist',
  'Endocrinologist',
  'Gastroenterologist',
  'General Physician',
  'Gynecologist',
  'Neurologist',
  'Ophthalmologist',
  'Orthopedic',
  'Pediatrician',
  'Psychiatrist',
]

const VideoConsultPage = () => {
  const [searchParams] = useSearchParams()
  const [doctors, setDoctors] = useState(DEFAULT_VIDEO_DOCTORS)
  const [selectedSpec, setSelectedSpec] = useState('All')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  // Sync selected specialty from URL query parameters (e.g. from SpecialtiesSection)
  useEffect(() => {
    const specParam = searchParams.get('specialty') || searchParams.get('search') || ''
    if (!specParam) return

    const normalized = specParam.trim().toLowerCase()
    let targetSpec = ''
    if (normalized.includes('tricholog') || normalized.includes('hair')) {
      targetSpec = 'Dermatologist'
    } else if (normalized.includes('sexolog')) {
      targetSpec = 'General Physician'
    } else {
      const found = ALL_SPECIALTIES.find(
        (s) => s.toLowerCase() === normalized || normalized.includes(s.toLowerCase())
      )
      if (found) targetSpec = found
    }

    if (targetSpec && ALL_SPECIALTIES.includes(targetSpec)) {
      setSelectedSpec(targetSpec)
    } else if (specParam) {
      setSearch(specParam)
    }

    setTimeout(() => {
      const dirElement = document.getElementById('video-doctors-directory')
      if (dirElement) {
        dirElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 150)
  }, [searchParams])

  // Booking Modal State
  const [bookingDoctor, setBookingDoctor] = useState(null)
  const [bookingStep, setBookingStep] = useState('details') // 'details' | 'payment' | 'success'
  const [patientName, setPatientName] = useState('')
  const [patientPhone, setPatientPhone] = useState('')
  const [patientEmail, setPatientEmail] = useState('')
  const [appointmentDate, setAppointmentDate] = useState(() => getTomorrowDateString())
  const [selectedSlot, setSelectedSlot] = useState('')
  const [transactionId, setTransactionId] = useState('')
  const [copiedUpi, setCopiedUpi] = useState(false)
  const [copiedId, setCopiedId] = useState(false)
  const [copiedRoom, setCopiedRoom] = useState(false)
  const [bookingSubmitting, setBookingSubmitting] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(null)
  const [bookingError, setBookingError] = useState('')
  const [slotAvailability, setSlotAvailability] = useState({})
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [validatingEligibility, setValidatingEligibility] = useState(false)

  // Patient / Consultation Lookup by Mobile Number State
  const [showLookupModal, setShowLookupModal] = useState(false)
  const [lookupPhone, setLookupPhone] = useState('')
  const [lookupLoading, setLookupLoading] = useState(false)
  const [lookupResult, setLookupResult] = useState(null)
  const [lookupError, setLookupError] = useState('')
  const [copiedLookupKey, setCopiedLookupKey] = useState('')

  const handleCopyLookupText = (key, text) => {
    if (!text) return
    navigator.clipboard.writeText(text)
    setCopiedLookupKey(key)
    setTimeout(() => setCopiedLookupKey(''), 2000)
  }

  const handleSearchConsultationByPhone = async (e, directPhone) => {
    if (e && e.preventDefault) e.preventDefault()
    const target = directPhone || lookupPhone
    const cleanDigits = (target || '').trim().replace(/\D/g, '').slice(-10)
    if (!cleanDigits || cleanDigits.length < 10) {
      setLookupError('Please enter a valid 10-digit mobile number.')
      setLookupResult(null)
      return
    }

    setLookupLoading(true)
    setLookupError('')
    setLookupResult(null)

    try {
      // 1. Dedicated video-consult lookup endpoint
      let res = await fetch(`${BACKEND_URL}/api/video-consult/lookup/${cleanDigits}`)
      let data = await res.json()

      if (res.ok && data.success && data.data && data.data.length > 0) {
        setLookupResult({
          patient: data.patient || { name: 'Verified Patient', phone: cleanDigits },
          consultations: data.data,
        })
      } else {
        // 2. Fallback to general patient endpoint
        const patientRes = await fetch(`${BACKEND_URL}/api/patients/${cleanDigits}`)
        const patientData = await patientRes.json()

        if (patientRes.ok && patientData.success && patientData.data) {
          const p = patientData.data
          const consults =
            p.videoConsultations && p.videoConsultations.length > 0
              ? p.videoConsultations
              : (p.appointmentHistory || []).filter(
                (h) => h.consultationType === 'Video Consult' || h.videoRoomUrl
              )

          if (consults.length > 0) {
            setLookupResult({
              patient: { id: p.id, name: p.name, phone: p.phone || cleanDigits },
              consultations: consults,
            })
          } else {
            setLookupError(`No video consultations found for mobile number +91 ${cleanDigits}.`)
          }
        } else {
          setLookupError(
            data.message ||
            `No video consultations found on file for mobile number +91 ${cleanDigits}.`
          )
        }
      }
    } catch {
      setLookupError(
        'Unable to connect to the consultations database. Please check your connection and try again.'
      )
    } finally {
      setLookupLoading(false)
    }
  }

  // Dynamic document title
  useEffect(() => {
    document.title = 'Online Doctor Video Consultation | MediCare'
  }, [])

  // Keyboard accessibility: Escape key closes active modals
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (bookingDoctor) setBookingDoctor(null)
        if (showLookupModal) setShowLookupModal(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [bookingDoctor, showLookupModal])

  // 1. Fetch exactly 1 doctor per specialty for Video Consult from Backend / Atlas
  useEffect(() => {
    let isMounted = true
    setLoading(true)

    const url = `${BACKEND_URL}/api/video-consult/doctors?specialty=${encodeURIComponent(
      selectedSpec
    )}&search=${encodeURIComponent(search)}`

    fetch(url)
      .then((res) => (res.ok ? res.json() : null))
      .then((resData) => {
        if (isMounted && resData && resData.success && Array.isArray(resData.data)) {
          setDoctors(resData.data)
        }
      })
      .catch(() => {
        if (isMounted) {
          // Local fallback filter
          const filtered = DEFAULT_VIDEO_DOCTORS.filter((d) => {
            const matchSpec = selectedSpec === 'All' || d.specialty === selectedSpec
            const matchSearch =
              d.name.toLowerCase().includes(search.toLowerCase()) ||
              d.specialty.toLowerCase().includes(search.toLowerCase()) ||
              d.clinic.toLowerCase().includes(search.toLowerCase())
            return matchSpec && matchSearch
          })
          setDoctors(filtered)
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [selectedSpec, search])

  // 2. Fetch live 3-patient slot availability
  useEffect(() => {
    if (!bookingDoctor || !appointmentDate) return
    let isMounted = true
    setLoadingSlots(true)

    fetch(
      `${BACKEND_URL}/api/video-consult/slot-availability?doctorId=${bookingDoctor.id}&date=${appointmentDate}`
    )
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data && data.success && data.availability) {
          setSlotAvailability(data.availability)
          // If currently selected slot is full or in the past, pick first available slot
          const currentAvail = data.availability[selectedSlot]
          const isCurrentPast = isSlotPast(appointmentDate, selectedSlot)
          if (!selectedSlot || isCurrentPast || (currentAvail && currentAvail.isFull)) {
            const slots =
              bookingDoctor.availableSlots || Object.keys(data.availability)
            const firstOpen = getFirstAvailableSlot(
              appointmentDate,
              slots,
              data.availability
            )
            setSelectedSlot(firstOpen)
          }
        }
      })
      .catch(() => {
        if (isMounted) setSlotAvailability({})
      })
      .finally(() => {
        if (isMounted) setLoadingSlots(false)
      })

    return () => {
      isMounted = false
    }
  }, [bookingDoctor, appointmentDate, selectedSlot])

  // Modal open
  const handleOpenBooking = (doc) => {
    setBookingDoctor(doc)
    const slots = doc.availableSlots || [
      '10:00 AM',
      '11:30 AM',
      '02:00 PM',
      '04:30 PM',
      '06:00 PM',
    ]
    const firstOpen = getFirstAvailableSlot(appointmentDate, slots, {})
    setSelectedSlot(firstOpen)
    setBookingStep('details')
    setTransactionId('')
    setCopiedUpi(false)
    setCopiedId(false)
    setCopiedRoom(false)
    setBookingSuccess(null)
    setBookingError('')
    setSlotAvailability({})
  }

  // Handle date change and update selected slot to first available upcoming slot
  const handleDateChange = (newDate) => {
    setAppointmentDate(newDate)
    setBookingError('')
    if (bookingDoctor) {
      const slots = bookingDoctor.availableSlots || [
        '10:00 AM',
        '11:30 AM',
        '02:00 PM',
        '04:30 PM',
        '06:00 PM',
      ]
      const firstOpen = getFirstAvailableSlot(newDate, slots, slotAvailability)
      setSelectedSlot(firstOpen)
    }
  }

  // Step 1: Validate patient details and verify eligibility BEFORE moving to UPI QR Payment
  const handleProceedToPayment = async (e) => {
    e.preventDefault()
    if (!patientName.trim() || !patientPhone.trim()) {
      setBookingError('Please enter both patient full name and mobile number.')
      return
    }
    const cleanDigits = patientPhone.trim().replace(/\D/g, '')
    if (cleanDigits.length < 10) {
      setBookingError('Please enter a valid 10-digit mobile number.')
      return
    }

    if (!selectedSlot) {
      setBookingError(
        `All video consultation slots for ${appointmentDate} have passed or are full. Please choose another date above.`
      )
      return
    }

    // Verify slot has not already passed
    if (isSlotPast(appointmentDate, selectedSlot)) {
      setBookingError(
        `The slot ${selectedSlot} on ${appointmentDate} has already passed. Please choose an upcoming time slot or date.`
      )
      return
    }

    const avail = slotAvailability[selectedSlot]
    if (avail && avail.isFull) {
      setBookingError(
        `The slot ${selectedSlot} is full (3/3 patients already booked). Please choose another time slot.`
      )
      return
    }

    setValidatingEligibility(true)
    setBookingError('')

    try {
      const checkUrl = `${BACKEND_URL}/api/video-consult/check-eligibility?doctorId=${bookingDoctor.id}&date=${appointmentDate}&slot=${encodeURIComponent(
        selectedSlot
      )}&phone=${cleanDigits}`

      const res = await fetch(checkUrl)
      const data = await res.json()

      if (!res.ok || !data.success || !data.eligible) {
        // Patient already booked this video consult slot or slot is full: Show error right here in Step 1!
        setBookingError(
          data.message ||
            `You (${cleanDigits}) already have a video consultation booked for ${selectedSlot} on ${appointmentDate}.`
        )
        return
      }

      // Patient is eligible! Safe to proceed to payment
      setBookingError('')
      setBookingStep('payment')
    } catch (err) {
      console.warn('Pre-check network warning, proceeding to payment:', err)
      // Fallback: proceed to payment where final submission validates
      setBookingError('')
      setBookingStep('payment')
    } finally {
      setValidatingEligibility(false)
    }
  }

  // Step 2: Submit Video Consult & save to VideoConsultation collection
  const handleFinalBookingSubmit = async (e) => {
    e.preventDefault()
    const cleanTxn = transactionId.trim()
    if (!cleanTxn) {
      setBookingError('Please enter your UPI Transaction ID / UTR number from your payment app.')
      return
    }
    if (cleanTxn.length < 6) {
      setBookingError('Transaction ID / UTR must be at least 6 characters.')
      return
    }

    setBookingSubmitting(true)
    setBookingError('')

    try {
      const payload = {
        doctorId: bookingDoctor.id,
        patientName: patientName.trim(),
        patientPhone: patientPhone.trim(),
        patientEmail: patientEmail.trim(),
        appointmentDate,
        timeSlot: selectedSlot,
        consultationType: 'Video Consult',
        transactionId: cleanTxn,
        paymentStatus: 'Paid',
        paymentMethod: 'UPI QR',
        amountPaid: bookingDoctor.fee || '₹800',
      }

      const res = await fetch(`${BACKEND_URL}/api/video-consult/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setBookingSuccess({
          ...data.data,
          patientId: data.patient?.id || data.data.patientId,
          transactionId: cleanTxn,
        })
        setBookingStep('success')
      } else {
        setBookingError(data.message || 'Video consult booking failed. Please try another slot.')
      }
    } catch (err) {
      console.error('Video consult booking error:', err)
      setBookingError(
        'try again later'
      )
    } finally {
      setBookingSubmitting(false)
    }
  }

  const handleCopyUpi = () => {
    navigator.clipboard.writeText('medicare.pay@okaxis')
    setCopiedUpi(true)
    setTimeout(() => setCopiedUpi(false), 2200)
  }

  const handleCopyId = (id) => {
    navigator.clipboard.writeText(id)
    setCopiedId(true)
    setTimeout(() => setCopiedId(false), 2200)
  }

  const handleCopyRoom = (url) => {
    navigator.clipboard.writeText(url)
    setCopiedRoom(true)
    setTimeout(() => setCopiedRoom(false), 2200)
  }

  const handlePrintSlip = () => {
    window.print()
  }

  return (
    <div className="vc-page">
      <Navbar />

      {/* Hero Section */}
      <section className="vc-hero">
        <div className="container">
          <div className="vc-hero__pill">
            <span className="vc-hero__pulse"></span>
            <span>Verified Doctors Online • Instant Video Consultation</span>
          </div>

          <h1 className="vc-hero__title">
            Online Doctor Video Consultation
          </h1>
          <p className="vc-hero__subtitle">
            Connect in HD Video with India’s top certified physicians, dermatologists, pediatricians, and surgeons. Instant private consultations from phone or PC.
          </p>

          {/* Telemedicine Feature Pills */}
          <div className="vc-features-grid">
            <div className="vc-feature-card">
              <div className="vc-feature-icon">📹</div>
              <div>
                <h4>Instant HD Video Call</h4>
                <p>Join from phone or PC. No app download needed.</p>
              </div>
            </div>

            <div className="vc-feature-card">
              <div className="vc-feature-icon">🔒</div>
              <div>
                <h4>100% End-to-End Encrypted</h4>
                <p>Private & confidential medical consultations.</p>
              </div>
            </div>
          </div>

          {/* Prominent Hero Callout Banner: Get Consultation ID & Meeting Link by Number */}
          <div className="vc-hero-lookup-banner">
            <div className="vc-hero-lookup-content">
              <span className="vc-hero-lookup-icon">📹</span>
              <div>
                <strong>Forgot your Consultation ID or Video Call Link?</strong>
                <p>
                  Enter your registered 10-digit mobile number to immediately retrieve your <strong>Consultation ID (VID-XXXX)</strong> and launch your <strong>Telehealth Meeting Room</strong>.
                </p>
              </div>
            </div>
            <button
              type="button"
              className="vc-hero-lookup-btn"
              onClick={() => {
                setShowLookupModal(true)
                setLookupError('')
                setLookupResult(null)
              }}
            >
              <span>🎥 Get Consultation ID & Video Link by Number</span>
              <span>➔</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Body */}
      <div className="container vc-body">
        {/* DOCTORS DIRECTORY */}
        <div id="video-doctors-directory" className="vc-directory-section">
          {/* Directory Heading */}
          <div className="vc-directory-heading">
            <h2 className="vc-directory-title">
              👨‍⚕️ Verified Telehealth Specialists
            </h2>
            <span className="vc-directory-count">
              {doctors.length} Specialist{doctors.length !== 1 ? 's' : ''} Online
            </span>
          </div>

          {/* Search Bar + Highlighted Lookup Action Row */}
          <div className="vc-actions-row">
            <div className="vc-search-box">
              <span className="vc-search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search video specialist by doctor name, specialty, or condition..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button className="vc-search-clear" onClick={() => setSearch('')}>
                  ✕
                </button>
              )}
            </div>

            <button
              type="button"
              className="vc-highlight-lookup-btn"
              onClick={() => {
                setShowLookupModal(true)
                setLookupError('')
                setLookupResult(null)
              }}
              title="Forgot your Consultation ID or Video Call Link? Retrieve by mobile number"
            >
              <span>🎫 Get Consultation ID & Video Link by Number</span>
            </button>
          </div>

          {/* Specialties Filter Carousel */}
          <div className="vc-spec-pills-wrap">
            {ALL_SPECIALTIES.map((spec) => (
              <button
                key={spec}
                type="button"
                className={`vc-spec-pill ${selectedSpec === spec ? 'vc-spec-pill--active' : ''}`}
                onClick={() => setSelectedSpec(spec)}
              >
                {spec === 'All' ? '🌟 All (13 Fields)' : spec}
              </button>
            ))}
          </div>

          {/* Doctor Cards Grid */}
          <div className="vc-doctors-grid">
            {loading ? (
              <div className="vc-empty-state">
                <p>Loading Verified Video Specialists...</p>
              </div>
            ) : doctors.length === 0 ? (
              <div className="vc-empty-state">
                <p>No video specialists found matching your search.</p>
                <button
                  className="vc-btn-reset"
                  onClick={() => {
                    setSelectedSpec('All')
                    setSearch('')
                  }}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              doctors.map((doc) => (
                <div key={doc.id} className="vc-card">
                  <div className="vc-card__top">
                    <div className="vc-card__avatar-wrap">
                      <span className="vc-card__avatar">{doc.emoji || '👨‍⚕️'}</span>
                      <span className="vc-card__online-dot" title="Online for Video Consult"></span>
                    </div>
                    <div className="vc-card__top-info">
                      <span className="vc-card__spec-badge">{doc.specialty}</span>
                      <h3 className="vc-card__name">{doc.name}</h3>
                      <p className="vc-card__edu">{doc.education}</p>
                    </div>
                  </div>

                  <div className="vc-card__telehealth-tags">
                    <span className="vc-tag">🎥 HD Video Call</span>
                    <span className="vc-tag">📜 e-Prescription</span>
                    <span className="vc-tag">⚡ 15-20 mins</span>
                  </div>

                  <div className="vc-card__meta-row">
                    <div className="vc-card__rating">
                      ★ {doc.rating} <span>({doc.reviews} reviews)</span>
                    </div>
                    <div className="vc-card__exp">{doc.experience} exp</div>
                  </div>

                  <div className="vc-card__footer">
                    <div className="vc-card__fee-block">
                      <span className="vc-card__fee-label">Video Consult Fee</span>
                      <strong className="vc-card__fee-val">{doc.fee || '₹800'}</strong>
                    </div>
                    <button
                      type="button"
                      className="vc-card__book-btn"
                      onClick={() => handleOpenBooking(doc)}
                    >
                      📞 Book Video Call
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* VIDEO CONSULT BOOKING MODAL (Same 3-step payment flow) */}
      {bookingDoctor && (
        <div className="book-modal__overlay" onClick={() => setBookingDoctor(null)}>
          <div className="book-modal__dialog" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="book-modal__header">
              <div>
                <span className="book-modal__tag">📹 Telehealth Video Consultation</span>
                <h3 className="book-modal__title">{bookingDoctor.name}</h3>
                <p className="book-modal__sub">{bookingDoctor.specialty} • 1 Specialist per Field</p>
              </div>
              <button
                className="book-modal__close-btn"
                onClick={() => setBookingDoctor(null)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Stepper */}
            <div className="book-modal__stepper">
              <div className={`book-modal__step-item ${bookingStep === 'details' ? 'book-modal__step-item--active' : 'book-modal__step-item--done'}`}>
                <span className="book-modal__step-num">{bookingStep !== 'details' ? '✓' : '1'}</span>
                <span>Patient Info</span>
              </div>
              <div className={`book-modal__step-line ${bookingStep !== 'details' ? 'book-modal__step-line--done' : ''}`}></div>
              <div className={`book-modal__step-item ${bookingStep === 'payment' ? 'book-modal__step-item--active' : bookingStep === 'success' ? 'book-modal__step-item--done' : ''}`}>
                <span className="book-modal__step-num">{bookingStep === 'success' ? '✓' : '2'}</span>
                <span>UPI Payment</span>
              </div>
              <div className={`book-modal__step-line ${bookingStep === 'success' ? 'book-modal__step-line--done' : ''}`}></div>
              <div className={`book-modal__step-item ${bookingStep === 'success' ? 'book-modal__step-item--active' : ''}`}>
                <span className="book-modal__step-num">3</span>
                <span>Meeting Ready</span>
              </div>
            </div>

            {/* STEP 1: Patient Details */}
            {bookingStep === 'details' && (
              <form className="book-modal__form" onSubmit={handleProceedToPayment}>
                {bookingError && <div className="book-modal__error">{bookingError}</div>}

                <div className="book-modal__grid">
                  <div className="book-modal__field">
                    <label>Patient Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sen"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                    />
                  </div>

                  <div className="book-modal__field">
                    <label>Mobile Number (for SMS Video Link) *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765-43210"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                    />
                    <button
                      type="button"
                      className="vc-quick-lookup-link"
                      onClick={() => {
                        const currentPhone = patientPhone
                        setBookingDoctor(null)
                        setShowLookupModal(true)
                        setLookupError('')
                        setLookupResult(null)
                        if (currentPhone) {
                          setLookupPhone(currentPhone)
                          handleSearchConsultationByPhone(null, currentPhone)
                        }
                      }}
                    >
                      Forgot previous Consultation ID or Meeting Link? Retrieve it by number →
                    </button>
                  </div>
                </div>

                <div className="book-modal__grid">
                  <div className="book-modal__field">
                    <label>Consultation Date *</label>
                    <input
                      type="date"
                      required
                      min={getTodayDateString()}
                      value={appointmentDate}
                      onChange={(e) => handleDateChange(e.target.value)}
                    />
                  </div>

                  <div className="book-modal__field">
                    <label>Email Address (for Digital Rx & Link)</label>
                    <input
                      type="email"
                      placeholder="patient@example.com"
                      value={patientEmail}
                      onChange={(e) => setPatientEmail(e.target.value)}
                    />
                  </div>
                </div>

                {/* Slot Selection with 3-Patient Capacity */}
                <div className="book-modal__field">
                  <div className="book-modal__slots-header">
                    <label>Select Time Slot * (Capacity: Max 3 Patients per Slot)</label>
                    {loadingSlots && <span className="book-modal__slots-loading">Checking capacity...</span>}
                  </div>
                  <div className="book-modal__slots">
                    {(() => {
                      const slots =
                        bookingDoctor.availableSlots || [
                          '10:00 AM',
                          '11:30 AM',
                          '02:00 PM',
                          '04:30 PM',
                          '06:00 PM',
                        ]
                      const allPast = slots.every((s) => isSlotPast(appointmentDate, s))

                      return (
                        <>
                          {slots.map((slot) => {
                            const avail = slotAvailability[slot]
                            const bookedCount = avail ? avail.booked : 0
                            const remaining = avail ? avail.remaining : 3
                            const isFull = bookedCount >= 3
                            const isPast = isSlotPast(appointmentDate, slot)
                            const isUnavailable = isFull || isPast

                            return (
                              <button
                                type="button"
                                key={slot}
                                disabled={isUnavailable}
                                title={
                                  isPast
                                    ? `The ${slot} slot on ${appointmentDate} has already passed.`
                                    : isFull
                                    ? `Slot full (3/3 patients booked)`
                                    : `Click to select ${slot}`
                                }
                                className={`book-modal__slot-btn ${
                                  selectedSlot === slot ? 'book-modal__slot-btn--active' : ''
                                } ${isFull ? 'book-modal__slot-btn--full' : ''} ${
                                  isPast ? 'book-modal__slot-btn--past' : ''
                                }`}
                                onClick={() => {
                                  if (!isUnavailable) {
                                    setSelectedSlot(slot)
                                    setBookingError('')
                                  }
                                }}
                              >
                                <span className="book-modal__slot-time">{slot}</span>
                                <span
                                  className={`book-modal__slot-badge ${
                                    isPast
                                      ? 'book-modal__slot-badge--past'
                                      : isFull
                                      ? 'book-modal__slot-badge--full'
                                      : ''
                                  }`}
                                >
                                  {isPast ? 'Passed' : isFull ? 'Full (3/3)' : `${remaining} left`}
                                </span>
                              </button>
                            )
                          })}
                          {allPast && (
                            <div className="book-modal__past-notice">
                              ⏰ All consultation slots for today ({appointmentDate}) have already passed. Please select an upcoming date above.
                            </div>
                          )}
                        </>
                      )
                    })()}
                  </div>
                </div>

                <div className="book-modal__fee-row">
                  <div>
                    <span className="book-modal__fee-label">Video Consultation Fee</span>
                    <span className="book-modal__fee-val">{bookingDoctor.fee || '₹800'}</span>
                  </div>
                  <span className="book-modal__fee-note">⚡ Includes Official Digital Prescription</span>
                </div>

                <div className="book-modal__actions">
                  <button
                    type="button"
                    className="book-modal__btn book-modal__btn--ghost"
                    onClick={() => setBookingDoctor(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="book-modal__btn book-modal__btn--primary"
                    disabled={validatingEligibility}
                  >
                    {validatingEligibility ? 'Verifying Availability...' : 'Proceed to UPI Payment →'}
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: UPI QR Payment & Transaction ID Entry */}
            {bookingStep === 'payment' && (
              <form className="book-modal__form" onSubmit={handleFinalBookingSubmit}>
                {bookingError && <div className="book-modal__error">{bookingError}</div>}

                <div className="book-modal__qr-container">
                  <div className="book-modal__qr-summary-pill">
                    <span>Payable Fee:</span>
                    <strong>{bookingDoctor.fee || '₹800'}</strong>
                  </div>

                  <div className="book-modal__qr-card">
                    <div className="book-modal__qr-apps-row">
                      <span className="book-modal__upi-badge">Google Pay</span>
                      <span className="book-modal__upi-badge">PhonePe</span>
                      <span className="book-modal__upi-badge">Paytm</span>
                      <span className="book-modal__upi-badge">BHIM UPI</span>
                    </div>

                    <UpiQrCode
                      value={`upi://pay?pa=medicare.pay@okaxis&pn=MediCare+Healthcare&am=${(bookingDoctor.fee || '800').replace(/[^\d]/g, '')}&cu=INR&tn=Video+Consult+${encodeURIComponent(bookingDoctor.name || 'Doctor')}`}
                      size={200}
                      centerIcon="₹"
                    />

                    <p className="book-modal__qr-instruction">
                      Scan with <strong>Google Pay</strong>, <strong>PhonePe</strong>, or <strong>Paytm</strong> to pay <strong>{bookingDoctor.fee || '₹800'}</strong>
                    </p>

                    <div className="book-modal__upi-id-bar">
                      <span className="book-modal__upi-label">UPI ID:</span>
                      <span className="book-modal__upi-val">medicare.pay@okaxis</span>
                      <button
                        type="button"
                        className="book-modal__copy-btn"
                        onClick={handleCopyUpi}
                      >
                        {copiedUpi ? '✓ Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="book-modal__field book-modal__txn-field">
                  <label>
                    Enter UPI Transaction ID / UTR (12 digits) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 431289012345 or T241102123456"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    autoFocus
                  />
                  <span className="book-modal__field-hint">
                    📌 Copy the 12-digit UTR from your payment screen and paste it here.
                  </span>
                </div>

                <div className="book-modal__actions">
                  <button
                    type="button"
                    className="book-modal__btn book-modal__btn--ghost"
                    onClick={() => {
                      setBookingError('')
                      setBookingStep('details')
                    }}
                  >
                    ← Back to Details
                  </button>
                  <button
                    type="submit"
                    disabled={bookingSubmitting}
                    className="book-modal__btn book-modal__btn--primary"
                  >
                    {bookingSubmitting ? 'Verifying & Saving...' : 'Confirm Video Consult & Save'}
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: Booking Confirmation & Video Meeting Room */}
            {bookingStep === 'success' && bookingSuccess && (
              <div className="book-modal__success-card" id="printable-receipt">
                <div className="book-modal__success-icon">📹</div>
                <span className="book-modal__success-badge">✓ Video Consultation Booked</span>
                <h4>Video Consultation Confirmed!</h4>
                <p className="book-modal__success-sub">
                  Your private telehealth consultation has been successfully confirmed with your doctor.
                </p>

                {/* Instant Video Room Launch Box */}
                <div className="vc-modal-room-card">
                  <div className="vc-modal-room-header">
                    <span>🎥 Your Encrypted Video Call Link</span>
                    <span className="vc-modal-room-status">● Ready</span>
                  </div>
                  <div className="vc-modal-room-url">
                    <code>{bookingSuccess.videoRoomUrl}</code>
                  </div>
                  <div className="vc-modal-room-actions">
                    <a
                      href={bookingSuccess.videoRoomUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="vc-modal-join-btn"
                    >
                      🚀 Open Video Call Room Now
                    </a>
                    <button
                      type="button"
                      className="vc-modal-copy-btn"
                      onClick={() => handleCopyRoom(bookingSuccess.videoRoomUrl)}
                    >
                      {copiedRoom ? '✓ Link Copied' : 'Copy Room Link'}
                    </button>
                  </div>
                </div>

                {/* IDs Grid */}
                <div className="book-modal__ids-grid">
                  <div className="book-modal__id-box">
                    <span className="book-modal__id-label">Consultation ID</span>
                    <strong className="book-modal__id-val">{bookingSuccess.id}</strong>
                    <button
                      type="button"
                      className="book-modal__id-copy"
                      onClick={() => handleCopyId(bookingSuccess.id)}
                    >
                      {copiedId ? '✓ Copied' : 'Copy ID'}
                    </button>
                  </div>

                  <div className="book-modal__id-box">
                    <span className="book-modal__id-label">Meeting Code</span>
                    <strong className="book-modal__id-val">{bookingSuccess.meetingCode || bookingSuccess.id}</strong>
                    <span className="book-modal__id-sub">Telehealth Access Code</span>
                  </div>
                </div>

                {/* Summary Table */}
                <div className="book-modal__summary-box">
                  <div className="book-modal__summary-row">
                    <span>Specialist:</span>
                    <strong>{bookingSuccess.doctorName} ({bookingSuccess.specialty})</strong>
                  </div>
                  <div className="book-modal__summary-row">
                    <span>Patient Name:</span>
                    <strong>{bookingSuccess.patientName} ({bookingSuccess.patientPhone})</strong>
                  </div>
                  <div className="book-modal__summary-row">
                    <span>Date & Time Slot:</span>
                    <strong>{bookingSuccess.appointmentDate} at {bookingSuccess.timeSlot}</strong>
                  </div>
                  <div className="book-modal__summary-row">
                    <span>Queue Token:</span>
                    <strong className="book-modal__token-badge">Patient #{bookingSuccess.slotNumber || 1} of 3 for this slot</strong>
                  </div>
                  <div className="book-modal__summary-row">
                    <span>Type:</span>
                    <strong>HD Video Consultation</strong>
                  </div>
                  <div className="book-modal__summary-row">
                    <span>UPI Transaction ID:</span>
                    <strong className="book-modal__txn-val">{bookingSuccess.transactionId}</strong>
                  </div>
                  <div className="book-modal__summary-row book-modal__summary-row--highlight">
                    <span>Amount Paid:</span>
                    <strong>{bookingSuccess.amountPaid || bookingSuccess.fee || '₹800'} (Verified Paid)</strong>
                  </div>
                </div>

                <div className="book-modal__actions book-modal__actions--center">
                  <button
                    type="button"
                    className="book-modal__btn book-modal__btn--primary"
                    onClick={() => setBookingDoctor(null)}
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* RETRIEVE CONSULTATION ID & MEETING LINK MODAL */}
      {showLookupModal && (
        <div className="book-modal__overlay" onClick={() => setShowLookupModal(false)}>
          <div className="book-modal__dialog vc-lookup-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="book-modal__header vc-lookup-dialog__header">
              <div>
                <span className="book-modal__tag">📹 Telehealth Verification</span>
                <h3 className="book-modal__title">Get Consultation ID & Meeting Link</h3>
                <p className="book-modal__sub">
                  Retrieve your official <strong>Consultation ID (VID-XXXX)</strong> and direct <strong>Video Room Link</strong> using your 10-digit mobile number.
                </p>
              </div>
              <button
                className="book-modal__close-btn"
                onClick={() => setShowLookupModal(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="patient-lookup__body">
              <form className="patient-lookup__form" onSubmit={handleSearchConsultationByPhone}>
                <label className="patient-lookup__label">
                  Enter Registered 10-Digit Mobile Number
                </label>
                <div className="patient-lookup__input-row">
                  <div className="patient-lookup__prefix">+91</div>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="e.g. 9876543210"
                    value={lookupPhone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '')
                      setLookupPhone(val)
                      if (lookupError) setLookupError('')
                    }}
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={lookupLoading || !lookupPhone.trim()}
                    className="patient-lookup__submit-btn"
                  >
                    {lookupLoading ? 'Searching...' : 'Search Telehealth Records 🔍'}
                  </button>
                </div>
                <small className="patient-lookup__hint">
                  🔒 Securely searches your verified consultation records.
                </small>
              </form>

              {lookupError && (
                <div className="patient-lookup__error" role="alert">
                  <span>⚠️</span>
                  <div>{lookupError}</div>
                </div>
              )}

              {lookupResult && (
                <div className="patient-lookup__result">
                  {/* Patient Info Header */}
                  <div className="patient-lookup__header-card">
                    <div className="patient-lookup__avatar">
                      {(lookupResult.patient?.name || 'P').charAt(0).toUpperCase()}
                    </div>
                    <div className="patient-lookup__info">
                      <div className="patient-lookup__name-row">
                        <h4>{lookupResult.patient?.name || 'Patient'}</h4>
                        <span className="patient-lookup__badge">
                          Patient ID: {lookupResult.patient?.id || 'PAT-Verified'}
                        </span>
                      </div>
                      <div className="patient-lookup__meta">
                        <span>📱 +91 {lookupResult.patient?.phone || lookupPhone}</span>
                        <span>•</span>
                        <span>
                          🎥 {lookupResult.consultations?.length || 0} Video Consultation(s)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Consultations List */}
                  {(!lookupResult.consultations || lookupResult.consultations.length === 0) ? (
                    <p className="patient-lookup__empty">
                      No video consultations found on file for mobile number +91 {lookupPhone}.
                    </p>
                  ) : (
                    <div className="patient-lookup__appointments-list">
                      {lookupResult.consultations.map((vc) => {
                        const consultId = vc.id || vc.consultationId || vc.appointmentId
                        const meetingUrl = vc.videoRoomUrl || `https://meet.jit.si/medicare-telehealth-${consultId.toLowerCase()}`

                        return (
                          <div key={consultId} className="appointment-id-hero-card appointment-id-hero-card--video">
                            {/* Consultation ID Hero Banner */}
                            <div className="appointment-id-hero-badge-row">
                              <span className="appointment-id-type-pill appointment-id-type-pill--video">
                                📹 TELEHEALTH VIDEO CONSULT
                              </span>
                              <span className="appointment-id-status-pill">
                                ● {vc.status || 'Scheduled'}
                              </span>
                            </div>

                            <div className="appointment-id-highlight-box">
                              <span className="appointment-id-highlight-label">
                                YOUR CONSULTATION ID
                              </span>
                              <strong className="appointment-id-highlight-code">
                                {consultId}
                              </strong>
                              <button
                                type="button"
                                className="appointment-id-copy-action"
                                onClick={() => handleCopyLookupText(`id-${consultId}`, consultId)}
                              >
                                {copiedLookupKey === `id-${consultId}` ? '✓ Copied ID!' : '📋 Copy Consultation ID'}
                              </button>
                            </div>

                            {/* Meeting Room Link Highlight Box */}
                            <div className="vc-lookup-room-box">
                              <div className="vc-lookup-room-header">
                                <span className="vc-lookup-room-title">🎥 Official Encrypted Video Call Link</span>
                                <span className="vc-lookup-room-badge">● Room Active</span>
                              </div>
                              <div className="vc-lookup-room-url">
                                <code>{meetingUrl}</code>
                              </div>
                              <div className="vc-lookup-room-actions">
                                <a
                                  href={meetingUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="vc-lookup-join-btn"
                                >
                                  🚀 Join Video Call Room Now
                                </a>
                                <button
                                  type="button"
                                  className="vc-lookup-copy-btn"
                                  onClick={() => handleCopyLookupText(`room-${consultId}`, meetingUrl)}
                                >
                                  {copiedLookupKey === `room-${consultId}` ? '✓ Link Copied!' : '📋 Copy Meeting Link'}
                                </button>
                              </div>
                            </div>

                            {/* Appointment Details Grid */}
                            <div className="appointment-id-details-grid">
                              <div>
                                <span className="appointment-id-detail-label">Doctor & Specialty:</span>
                                <strong className="appointment-id-detail-val">
                                  {vc.doctorName}
                                </strong>
                                <small className="appointment-id-detail-sub">
                                  {vc.specialty} • {vc.clinic || 'MediCare Telehealth'}
                                </small>
                              </div>

                              <div>
                                <span className="appointment-id-detail-label">Patient Name:</span>
                                <strong className="appointment-id-detail-val">
                                  {vc.patientName || lookupResult.patient?.name}
                                </strong>
                                <small className="appointment-id-detail-sub">
                                  Registered Mobile: +91 {vc.patientPhone || lookupResult.patient?.phone}
                                </small>
                              </div>

                              <div>
                                <span className="appointment-id-detail-label">Scheduled Date & Time Slot:</span>
                                <strong className="appointment-id-detail-val appointment-id-detail-val--accent">
                                  📅 {vc.appointmentDate || vc.date} at ⏰ {vc.timeSlot}
                                </strong>
                                <small className="appointment-id-detail-sub">
                                  Queue Token: Patient #{vc.slotNumber || 1} of 3
                                </small>
                              </div>

                              <div>
                                <span className="appointment-id-detail-label">Payment Status:</span>
                                <strong className="appointment-id-detail-val">
                                  {vc.fee || vc.amountPaid || '₹800'} ({vc.paymentStatus || 'Paid'})
                                </strong>
                                <small className="appointment-id-detail-sub appointment-id-detail-sub--code">
                                  Txn ID: {vc.transactionId || 'Verified'}
                                </small>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="book-modal__actions book-modal__actions--center">
              <button
                type="button"
                className="book-modal__btn book-modal__btn--primary"
                onClick={() => setShowLookupModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

export default VideoConsultPage
