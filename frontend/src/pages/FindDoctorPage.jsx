import { useState, useEffect } from 'react'
import { useSearchParams, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import NearbyHospitalsMap from '../components/NearbyHospitalsMap'
import UpiQrCode from '../components/UpiQrCode'
import {
  isSlotPast,
  getTodayDateString,
  getTomorrowDateString,
  getFirstAvailableSlot,
} from '../utils/timeSlotHelper'
import './FindDoctorPage.css'

const RAW_BACKEND_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname === '0.0.0.0')
    ? 'http://localhost:5000'
    : '')

const BACKEND_URL = RAW_BACKEND_URL.replace(/\/+$/, '')

const DEFAULT_DOCTORS = [
  {
    id: 1,
    name: 'Dr. Sonia Sharma',
    specialty: 'Cardiologist',
    education: 'MBBS, MD - Cardiology, FACC',
    clinic: 'Apollo Clinic, Bandra West',
    rating: 4.8,
    reviews: 1240,
    experience: '15 yrs',
    fee: '₹800',
    availability: 'Available Today',
    gender: 'female',
    emoji: '👩‍⚕️',
    verified: true,
    consultationTypes: ['In-Clinic'],
    availableSlots: ['10:00 AM', '11:30 AM', '02:00 PM', '04:30 PM', '06:00 PM'],
  },
  {
    id: 4,
    name: 'Dr. Rajesh Sharma',
    specialty: 'Dermatologist',
    education: 'MBBS, DVD, MD - Dermatology & Cosmetology',
    clinic: 'Max Skin & Laser Clinic, Saket',
    rating: 4.8,
    reviews: 987,
    experience: '12 yrs',
    fee: '₹600',
    availability: 'Available Today',
    gender: 'male',
    emoji: '👨‍⚕️',
    verified: true,
    consultationTypes: ['In-Clinic'],
    availableSlots: ['09:30 AM', '11:00 AM', '01:30 PM', '05:00 PM'],
  },
  {
    id: 8,
    name: 'Dr. Sanjay Mukherjee',
    specialty: 'Pediatrician',
    education: 'MBBS, DCH, DNB - Pediatrics',
    clinic: 'Rainbow Children Hospital, Marathahalli',
    rating: 4.8,
    reviews: 1103,
    experience: '16 yrs',
    fee: '₹700',
    availability: 'Next: 2PM',
    gender: 'male',
    emoji: '👨‍⚕️',
    verified: true,
    consultationTypes: ['In-Clinic'],
    availableSlots: ['02:00 PM', '03:30 PM', '05:00 PM', '06:30 PM'],
  },
  {
    id: 10,
    name: 'Dr. Arun Patel',
    specialty: 'Orthopedic',
    education: 'MBBS, MS - Orthopedics',
    clinic: 'Fortis Bone & Joint Center, Mulund',
    rating: 4.7,
    reviews: 654,
    experience: '10 yrs',
    fee: '₹900',
    availability: 'Available Today',
    gender: 'male',
    emoji: '👨‍⚕️',
    verified: true,
    consultationTypes: ['In-Clinic'],
    availableSlots: ['10:30 AM', '12:00 PM', '03:00 PM', '05:30 PM'],
  },
  {
    id: 13,
    name: 'Dr. Meena Gupta',
    specialty: 'Gynecologist',
    education: 'MBBS, MS - Obstetrics & Gynaecology',
    clinic: 'Cloudnine Maternity Clinic, Sector 51',
    rating: 4.8,
    reviews: 1456,
    experience: '14 yrs',
    fee: '₹750',
    availability: 'Next: 4PM',
    gender: 'female',
    emoji: '👩‍⚕️',
    verified: true,
    consultationTypes: ['In-Clinic'],
    availableSlots: ['04:00 PM', '05:00 PM', '06:00 PM', '07:30 PM'],
  },
  {
    id: 16,
    name: 'Dr. Vikram Singh',
    specialty: 'Neurologist',
    education: 'MBBS, MD - General Medicine, DM - Neurology',
    clinic: 'Medanta Neuro Institute, Sector 38',
    rating: 4.8,
    reviews: 822,
    experience: '20 yrs',
    fee: '₹1200',
    availability: 'Available Today',
    gender: 'male',
    emoji: '👨‍⚕️',
    verified: true,
    consultationTypes: ['In-Clinic'],
    availableSlots: ['11:00 AM', '01:00 PM', '03:30 PM', '05:00 PM'],
  },
  {
    id: 19,
    name: 'Dr. Ananya Roy',
    specialty: 'General Physician',
    education: 'MBBS, MD - Internal Medicine',
    clinic: 'AMRI Health Clinic, Salt Lake',
    rating: 4.8,
    reviews: 730,
    experience: '9 yrs',
    fee: '₹500',
    availability: 'Available Today',
    gender: 'female',
    emoji: '👩‍⚕️',
    verified: true,
    consultationTypes: ['In-Clinic'],
    availableSlots: ['09:00 AM', '10:30 AM', '12:00 PM', '04:00 PM', '06:00 PM'],
  },
  {
    id: 3,
    name: 'Dr. Vivek Saxena',
    specialty: 'Cardiologist',
    education: 'MBBS, MD, DM (Cardiology)',
    clinic: 'Apollo Cardiac Center, Mukundapur',
    rating: 4.8,
    reviews: 950,
    experience: '18 yrs',
    fee: '₹1000',
    availability: 'Next: Tomorrow',
    gender: 'male',
    emoji: '👨‍⚕️',
    verified: true,
    consultationTypes: ['In-Clinic'],
    availableSlots: ['11:30 AM', '02:30 PM', '04:00 PM'],
  },
]

const DEFAULT_SPECIALTIES = [
  'All',
  'Cardiologist',
  'Dermatologist',
  'Pediatrician',
  'Orthopedic',
  'Gynecologist',
  'Neurologist',
  'General Physician',
]

const FindDoctorPage = () => {
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const isNearMeRequested =
    searchParams.get('nearMe') === 'true' ||
    location.pathname.toLowerCase().includes('near-you') ||
    location.pathname.toLowerCase().includes('near-me')

  const [doctors, setDoctors] = useState(DEFAULT_DOCTORS)
  const [specialties, setSpecialties] = useState(DEFAULT_SPECIALTIES)
  const [selectedSpec, setSelectedSpec] = useState('All')
  const [search, setSearch] = useState('')
  const [backendOnline, setBackendOnline] = useState(false)
  const [loading, setLoading] = useState(false)

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
  const [bookingSubmitting, setBookingSubmitting] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(null)
  const [bookingError, setBookingError] = useState('')
  const [slotAvailability, setSlotAvailability] = useState({})
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [validatingEligibility, setValidatingEligibility] = useState(false)

  // Patient / Appointment Lookup by Mobile Number State
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

  const handleSearchPatientByPhone = async (e, directPhone) => {
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
      const res = await fetch(`${BACKEND_URL}/api/patients/${cleanDigits}`)
      const data = await res.json()
      if (res.ok && data.success && data.data) {
        setLookupResult(data.data)
      } else {
        setLookupError(
          data.message ||
          `No patient record or appointments found for mobile number +91 ${cleanDigits}.`
        )
      }
    } catch (err) {
      setLookupError('Unable to connect to the patient database. Please try again.')
    } finally {
      setLookupLoading(false)
    }
  }

  // Set dynamic document title based on route
  useEffect(() => {
    if (location.pathname.includes('near-you') || location.pathname.includes('near-me')) {
      document.title = 'Find Doctors & Clinics Near You | MediCare'
    } else {
      document.title = 'Find Verified Doctors & Book Appointments | MediCare'
    }
  }, [location.pathname])

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

  // 1. Fetch doctors from Express Backend API
  useEffect(() => {
    let isMounted = true
    setLoading(true)

    const fetchUrl = `${BACKEND_URL}/api/doctors?specialty=${encodeURIComponent(
      selectedSpec
    )}&search=${encodeURIComponent(search)}`

    fetch(fetchUrl)
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok')
        return res.json()
      })
      .then((resData) => {
        if (isMounted && resData.success && Array.isArray(resData.data)) {
          setDoctors(resData.data)
          setBackendOnline(true)
        }
      })
      .catch(() => {
        if (isMounted) {
          // Fallback to local filter if backend isn't running
          setBackendOnline(false)
          const filtered = DEFAULT_DOCTORS.filter((d) => {
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

  // 2. Fetch specialties list from Backend API
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/doctors/meta/specialties`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.data) {
          setSpecialties(data.data)
        }
      })
      .catch(() => { })
  }, [])

  // 3. Fetch live time slot availability (Max 3 patients per slot)
  useEffect(() => {
    if (!bookingDoctor || !appointmentDate) return
    let isMounted = true
    setLoadingSlots(true)

    fetch(
      `${BACKEND_URL}/api/appointments/slot-availability?doctorId=${bookingDoctor.id}&date=${appointmentDate}`
    )
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data && data.success && data.availability) {
          setSlotAvailability(data.availability)
          // If currently selected slot is full (3/3) or in the past, pick first available slot
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

  // Auto-scroll if nearMe param exists
  useEffect(() => {
    if (isNearMeRequested) {
      const timer = setTimeout(() => {
        const el = document.getElementById('nearby-map-section')
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [isNearMeRequested])

  // Open booking modal
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
        `All consultation slots for ${appointmentDate} have passed or are full. Please choose another date above.`
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

    // Check if slot capacity is already reached
    const avail = slotAvailability[selectedSlot]
    if (avail && avail.isFull) {
      setBookingError(
        `The slot ${selectedSlot} on ${appointmentDate} is full (3/3 patients already booked). Please choose another time slot.`
      )
      return
    }

    setValidatingEligibility(true)
    setBookingError('')

    try {
      const checkUrl = `${BACKEND_URL}/api/appointments/check-eligibility?doctorId=${bookingDoctor.id}&date=${appointmentDate}&slot=${encodeURIComponent(
        selectedSlot
      )}&phone=${cleanDigits}`

      const res = await fetch(checkUrl)
      const data = await res.json()

      if (!res.ok || !data.success || !data.eligible) {
        // Patient already booked this slot or slot is full: Show error right here in Step 1!
        setBookingError(
          data.message ||
          `You (${cleanDigits}) already have an appointment booked for ${selectedSlot} on ${appointmentDate}.`
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

  // Step 2: Submit appointment with UPI Transaction ID & save to Database
  const handleFinalBookingSubmit = async (e) => {
    e.preventDefault()
    const cleanTxn = transactionId.trim()
    if (!cleanTxn) {
      setBookingError('Please enter the UPI Transaction ID / UTR number from your payment app.')
      return
    }
    if (cleanTxn.length < 6) {
      setBookingError('Transaction ID / UTR must be at least 6 characters (e.g. 12-digit UTR).')
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
        consultationType: 'In-Clinic',
        transactionId: cleanTxn,
        paymentStatus: 'Paid',
        paymentMethod: 'UPI QR',
        amountPaid: bookingDoctor.fee || '₹800',
      }

      const res = await fetch(`${BACKEND_URL}/api/appointments`, {
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
        setBookingError(data.message || 'Booking failed. Please check your transaction details.')
      }
    } catch (err) {
      console.error('Booking submission error:', err)
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

  const handleCopyAptId = (id) => {
    navigator.clipboard.writeText(id)
    setCopiedId(true)
    setTimeout(() => setCopiedId(false), 2200)
  }

  const handlePrintReceipt = () => {
    window.print()
  }

  return (
    <div className="find-page">
      <Navbar />

      <div className="find-page__hero">
        <div className="container">
          <div className="find-page__hero-pill">
            <span>🏥 5,000+ Verified Doctors & Clinics</span>
            <span className="find-page__hero-pill-dot">•</span>
            <span className="find-page__hero-pill-badge">
              ⚡ Instant Appointment Confirmation
            </span>
          </div>

          <h1 className="find-page__title">Find Doctors & Clinics Near You</h1>
          <p className="find-page__subtitle">
            Enter your area name or pincode to discover nearest hospitals and clinics on live Google Maps, or search specific specialists around you.
          </p>

          {/* Highlighted Banner: Get Appointment ID by Number */}
          <div className="find-page__hero-lookup-banner">
            <div className="find-page__hero-lookup-content">
              <span className="find-page__hero-lookup-icon">🎫</span>
              <div>
                <strong>Forgot your Appointment ID?</strong>
                <p>Enter your mobile number to retrieve your confirmed Appointment ID instantly.</p>
              </div>
            </div>
            <button
              type="button"
              className="find-page__hero-lookup-btn"
              onClick={() => {
                setShowLookupModal(true)
                setLookupError('')
                setLookupResult(null)
              }}
            >
              Get Appointment ID by Number →
            </button>
          </div>
        </div>
      </div>

      <div className="container find-page__body">
        {/* Google Maps Nearby Finder */}
        <NearbyHospitalsMap autoTrigger={isNearMeRequested} />

        {/* Verified Specialists Directory */}
        <div className="find-page__doctors-directory" id="doctors-directory-section">
          <div className="find-page__directory-header">
            <div>
              <span className="find-page__directory-badge">👨‍⚕️ Verified Network</span>
              <h2 className="find-page__directory-title">Book Top Doctors & Specialists</h2>
              <p className="find-page__directory-sub">
                Confirmed appointments with verified physicians, dermatologists, cardiologists, and surgeons.
              </p>
            </div>

            <div className="find-page__directory-actions">
              <div className="find-page__directory-search">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  id="find-page-doctor-search"
                  type="text"
                  placeholder="Filter by doctor name, clinic, specialty..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* Highlighted Button: Get Appointment ID by Number */}
              <button
                type="button"
                className="find-page__highlight-lookup-btn"
                onClick={() => {
                  setShowLookupModal(true)
                  setLookupError('')
                  setLookupResult(null)
                }}
                title="Forgot your Appointment ID? Click to find it by mobile number"
              >
                <span className="highlight-lookup-icon">🎫</span>
                <span>Get Appointment ID by Number</span>
              </button>
            </div>
          </div>

          {/* Specialty Filters */}
          <div className="find-page__filters">
            {specialties.map((spec) => (
              <button
                key={spec}
                id={`filter-${spec.toLowerCase().replace(/\s/g, '-')}`}
                className={`find-page__filter-btn ${selectedSpec === spec ? 'find-page__filter-btn--active' : ''}`}
                onClick={() => setSelectedSpec(spec)}
              >
                {spec}
              </button>
            ))}
          </div>

          {/* Results Grid */}
          <div className="find-page__results">
            <div className="find-page__results-header">
              <p className="find-page__count">
                {loading ? 'Searching doctors...' : `${doctors.length} doctors found`}
              </p>
            </div>

            <div className="find-page__grid">
              {doctors.map((doc) => (
                <div key={doc.id} id={`doctor-card-${doc.id}`} className="doctor-card">
                  <div className="doctor-card__avatar">
                    <span className="doctor-card__emoji">{doc.emoji || '👨‍⚕️'}</span>
                    {doc.verified && <span className="doctor-card__verified">✓</span>}
                  </div>
                  <div className="doctor-card__info">
                    <h3 className="doctor-card__name">{doc.name}</h3>
                    <p className="doctor-card__spec">
                      {doc.specialty} {doc.education && <span className="doctor-card__edu">({doc.education})</span>}
                    </p>

                    <p className="doctor-card__clinic">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <span>{doc.clinic}</span>
                    </p>

                    <div className="doctor-card__stats">
                      <span className="doctor-card__rating">★ {doc.rating}</span>
                      <span className="doctor-card__reviews">({doc.reviews} reviews)</span>
                      <span className="doctor-card__exp">{doc.experience}</span>
                    </div>

                    <div className="doctor-card__footer">
                      <div>
                        <p className="doctor-card__fee">{doc.fee}</p>
                        <p className="doctor-card__avail">{doc.availability}</p>
                      </div>
                      <div className="doctor-card__actions">
                        <button
                          className="doctor-card__book-btn"
                          id={`book-btn-${doc.id}`}
                          onClick={() => handleOpenBooking(doc)}
                        >
                          Book Now
                        </button>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(doc.clinic)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="doctor-card__map-btn"
                          id={`map-btn-${doc.id}`}
                          title="View clinic on Google Maps"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                            <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                            <line x1="9" y1="3" x2="9" y2="18" />
                            <line x1="15" y1="6" x2="15" y2="21" />
                          </svg>
                          Map
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Booking Modal */}
      {bookingDoctor && (
        <div className="book-modal__overlay" onClick={() => setBookingDoctor(null)}>
          <div className="book-modal__dialog" onClick={(e) => e.stopPropagation()}>
            <div className="book-modal__header">
              <div>
                <span className="book-modal__tag">Instant Appointment Booking</span>
                <h3 className="book-modal__title">{bookingDoctor.name}</h3>
                <p className="book-modal__sub">{bookingDoctor.specialty} • {bookingDoctor.clinic}</p>
              </div>
              <button
                className="book-modal__close-btn"
                onClick={() => setBookingDoctor(null)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Step Progress Indicator */}
            <div className="book-modal__stepper">
              <div className={`book-modal__step-item ${bookingStep === 'details' ? 'book-modal__step-item--active' : 'book-modal__step-item--done'}`}>
                <span className="book-modal__step-num">{bookingStep !== 'details' ? '✓' : '1'}</span>
                <span>Patient Info</span>
              </div>
              <div className={`book-modal__step-line ${bookingStep !== 'details' ? 'book-modal__step-line--done' : ''}`}></div>
              <div className={`book-modal__step-item ${bookingStep === 'payment' ? 'book-modal__step-item--active' : bookingStep === 'success' ? 'book-modal__step-item--done' : ''}`}>
                <span className="book-modal__step-num">{bookingStep === 'success' ? '✓' : '2'}</span>
                <span>UPI QR Payment</span>
              </div>
              <div className={`book-modal__step-line ${bookingStep === 'success' ? 'book-modal__step-line--done' : ''}`}></div>
              <div className={`book-modal__step-item ${bookingStep === 'success' ? 'book-modal__step-item--active' : ''}`}>
                <span className="book-modal__step-num">3</span>
                <span>Confirmed</span>
              </div>
            </div>

            {/* STEP 1: Patient Details Form */}
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
                    <div className="book-modal__label-row">
                      <label>Mobile Number *</label>
                      <button
                        type="button"
                        className="book-modal__forgot-btn"
                        onClick={() => {
                          const digits = patientPhone.replace(/\D/g, '').slice(-10)
                          setLookupPhone(digits || patientPhone)
                          setShowLookupModal(true)
                          setLookupError('')
                          setLookupResult(null)
                          if (digits.length >= 10) {
                            handleSearchPatientByPhone(null, digits)
                          }
                        }}
                      >
                        Forgot Appointment ID? Get it by number
                      </button>
                    </div>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765-43210"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="book-modal__grid">
                  <div className="book-modal__field">
                    <label>Appointment Date *</label>
                    <input
                      type="date"
                      required
                      min={getTodayDateString()}
                      value={appointmentDate}
                      onChange={(e) => handleDateChange(e.target.value)}
                    />
                  </div>

                  <div className="book-modal__field">
                    <label>Email Address (Optional)</label>
                    <input
                      type="email"
                      placeholder="patient@example.com"
                      value={patientEmail}
                      onChange={(e) => setPatientEmail(e.target.value)}
                    />
                  </div>
                </div>

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
                                className={`book-modal__slot-btn ${selectedSlot === slot ? 'book-modal__slot-btn--active' : ''
                                  } ${isFull ? 'book-modal__slot-btn--full' : ''} ${isPast ? 'book-modal__slot-btn--past' : ''
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
                                  className={`book-modal__slot-badge ${isPast
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
                    <span className="book-modal__fee-label">Consultation Fee</span>
                    <span className="book-modal__fee-val">{bookingDoctor.fee || '₹800'}</span>
                  </div>
                  <span className="book-modal__fee-note">⚡ Pay via UPI QR in next step</span>
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
                      value={`upi://pay?pa=medicare.pay@okaxis&pn=MediCare+Healthcare&am=${(bookingDoctor.fee || '800').replace(/[^\d]/g, '')}&cu=INR&tn=Doctor+Consultation+${encodeURIComponent(bookingDoctor.name || 'Doctor')}`}
                      size={200}
                      centerIcon="₹"
                    />

                    <p className="book-modal__qr-instruction">
                      Scan this QR with <strong>Google Pay</strong>, <strong>PhonePe</strong>, or <strong>Paytm</strong> to pay <strong>{bookingDoctor.fee || '₹800'}</strong>
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
                    📌 Copy the 12-digit UTR or UPI Reference Number from your payment receipt and paste it above.
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
                    {bookingSubmitting ? 'Verifying & Saving...' : 'Confirm & Save Appointment'}
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: Booking & Payment Confirmation */}
            {bookingStep === 'success' && bookingSuccess && (
              <div className="book-modal__success-card" id="printable-receipt">
                <div className="book-modal__success-icon">✓</div>
                <span className="book-modal__success-badge">✓ Payment & Booking Confirmed</span>
                <h4>Appointment Confirmed!</h4>
                <p className="book-modal__success-sub">
                  Your in-clinic doctor appointment has been successfully booked and confirmed.
                </p>

                <div className="book-modal__ids-grid">
                  <div className="book-modal__id-box">
                    <span className="book-modal__id-label">Appointment ID</span>
                    <strong className="book-modal__id-val">{bookingSuccess.id}</strong>
                    <button
                      type="button"
                      className="book-modal__id-copy"
                      onClick={() => handleCopyAptId(bookingSuccess.id)}
                    >
                      {copiedId ? '✓ Copied' : 'Copy ID'}
                    </button>
                  </div>

                  <div className="book-modal__id-box">
                    <span className="book-modal__id-label">Patient ID</span>
                    <strong className="book-modal__id-val">{bookingSuccess.patientId || 'PAT-REG'}</strong>
                    <span className="book-modal__id-sub">Permanent Patient Record</span>
                  </div>
                </div>

                <div className="book-modal__summary-box">
                  <div className="book-modal__summary-row">
                    <span>Doctor:</span>
                    <strong>{bookingSuccess.doctorName} ({bookingSuccess.specialty})</strong>
                  </div>
                  <div className="book-modal__summary-row">
                    <span>Clinic / Hospital:</span>
                    <strong>{bookingSuccess.clinic}</strong>
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
                    <span>Patient Queue Token:</span>
                    <strong className="book-modal__token-badge">Patient #{bookingSuccess.slotNumber || 1} of 3 for this slot</strong>
                  </div>
                  <div className="book-modal__summary-row">
                    <span>Consultation Type:</span>
                    <strong>{bookingSuccess.consultationType || 'In-Clinic'} (In-Person Clinic Visit)</strong>
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

      {/* Patient & Appointment Lookup Modal by Mobile Number */}
      {showLookupModal && (
        <div className="book-modal__overlay" onClick={() => setShowLookupModal(false)}>
          <div className="book-modal__dialog patient-lookup-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="book-modal__header">
              <div>
                <span className="book-modal__tag">🎫 APPOINTMENT ID RECOVERY</span>
                <h3 className="book-modal__title">Get Appointment ID by Number</h3>
                <p className="book-modal__sub">
                  Forgot your Appointment ID? Enter your 10-digit registered mobile number below to retrieve your Appointment ID and booking details instantly.
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
              <form onSubmit={handleSearchPatientByPhone} className="patient-lookup__form">
                <div className="patient-lookup__input-group">
                  <div className="patient-lookup__prefix">
                    <span>🇮🇳 +91</span>
                  </div>
                  <input
                    type="tel"
                    className="patient-lookup__input"
                    placeholder="Enter 10-digit mobile number (e.g. 9876543210)"
                    maxLength={10}
                    value={lookupPhone}
                    onChange={(e) => setLookupPhone(e.target.value.replace(/\D/g, ''))}
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="patient-lookup__submit-btn"
                    disabled={lookupLoading}
                  >
                    {lookupLoading ? 'Searching...' : 'Get Appointment ID →'}
                  </button>
                </div>
              </form>

              {lookupError && (
                <div className="patient-lookup__error">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{lookupError}</span>
                </div>
              )}

              {lookupResult && (
                <div className="patient-lookup__result">
                  <div className="appointment-recovery__header-bar">
                    <span className="appointment-recovery__found-badge">
                      ✓ {((lookupResult.appointments?.length || 0) + (lookupResult.videoConsultations?.length || 0))} Confirmed Appointment(s) Found
                    </span>
                    <span className="appointment-recovery__mobile-tag">
                      Registered Number: +91 {lookupResult.phone}
                    </span>
                  </div>

                  {/* Appointments List - Focused on APPOINTMENT ID */}
                  <div className="patient-lookup__appointments-sec">
                    {(!lookupResult.appointments?.length && !lookupResult.videoConsultations?.length) ? (
                      <p className="patient-lookup__empty">
                        No appointments found on file for mobile number +91 {lookupResult.phone}.
                      </p>
                    ) : (
                      <div className="patient-lookup__appointments-list">
                        {/* In-Clinic Appointments */}
                        {(lookupResult.appointments || []).map((apt) => (
                          <div key={apt.id || apt.appointmentId} className="appointment-id-hero-card">
                            <div className="appointment-id-hero-badge-row">
                              <span className="appointment-id-type-pill">
                                🏥 In-Clinic Doctor Visit
                              </span>
                              <span className="appointment-id-status-pill">
                                ✓ {apt.status || 'Confirmed'}
                              </span>
                            </div>

                            {/* Huge Prominent Appointment ID Box */}
                            <div className="appointment-id-highlight-box">
                              <div>
                                <span className="appointment-id-sublabel">YOUR APPOINTMENT ID</span>
                                <strong className="appointment-id-large">{apt.id || apt.appointmentId}</strong>
                              </div>
                              <button
                                type="button"
                                className="appointment-id-copy-action"
                                onClick={() => handleCopyLookupText(apt.id || apt.appointmentId, apt.id || apt.appointmentId)}
                              >
                                {copiedLookupKey === (apt.id || apt.appointmentId) ? '✓ Copied ID!' : '📋 Copy Appointment ID'}
                              </button>
                            </div>

                            <div className="appointment-id-details-grid">
                              <div>
                                <span className="appointment-id-detail-label">Doctor:</span>
                                <strong className="appointment-id-detail-val">{apt.doctorName}</strong>
                                <small className="appointment-id-detail-sub">{apt.specialty}</small>
                              </div>

                              <div>
                                <span className="appointment-id-detail-label">Date & Time Slot:</span>
                                <strong className="appointment-id-detail-val">{apt.appointmentDate || apt.date}</strong>
                                <small className="appointment-id-detail-sub">{apt.timeSlot} {apt.slotNumber ? `(Token #${apt.slotNumber})` : ''}</small>
                              </div>

                              <div>
                                <span className="appointment-id-detail-label">Patient Name:</span>
                                <strong className="appointment-id-detail-val">{apt.patientName || lookupResult.name}</strong>
                                <small className="appointment-id-detail-sub">Patient ID: {lookupResult.id}</small>
                              </div>

                              <div>
                                <span className="appointment-id-detail-label">Clinic Location:</span>
                                <strong className="appointment-id-detail-val">{apt.clinic || 'Partner Clinic'}</strong>
                                <small className="appointment-id-detail-sub">{apt.fee || '₹800'}</small>
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* Video Consultations */}
                        {(lookupResult.videoConsultations || []).map((vc) => (
                          <div key={vc.id || vc.consultationId} className="appointment-id-hero-card appointment-id-hero-card--video">
                            <div className="appointment-id-hero-badge-row">
                              <span className="appointment-id-type-pill appointment-id-type-pill--video">
                                📹 Telehealth Video Consult
                              </span>
                              <span className="appointment-id-status-pill">
                                ✓ {vc.status || 'Scheduled'}
                              </span>
                            </div>

                            {/* Huge Prominent Appointment ID Box */}
                            <div className="appointment-id-highlight-box appointment-id-highlight-box--video">
                              <div>
                                <span className="appointment-id-sublabel">YOUR APPOINTMENT ID</span>
                                <strong className="appointment-id-large">{vc.id || vc.consultationId}</strong>
                              </div>
                              <button
                                type="button"
                                className="appointment-id-copy-action"
                                onClick={() => handleCopyLookupText(vc.id || vc.consultationId, vc.id || vc.consultationId)}
                              >
                                {copiedLookupKey === (vc.id || vc.consultationId) ? '✓ Copied ID!' : '📋 Copy Appointment ID'}
                              </button>
                            </div>

                            <div className="appointment-id-details-grid">
                              <div>
                                <span className="appointment-id-detail-label">Doctor:</span>
                                <strong className="appointment-id-detail-val">{vc.doctorName}</strong>
                                <small className="appointment-id-detail-sub">{vc.specialty}</small>
                              </div>

                              <div>
                                <span className="appointment-id-detail-label">Date & Time Slot:</span>
                                <strong className="appointment-id-detail-val">{vc.appointmentDate || vc.date}</strong>
                                <small className="appointment-id-detail-sub">{vc.timeSlot}</small>
                              </div>

                              <div>
                                <span className="appointment-id-detail-label">Patient Name:</span>
                                <strong className="appointment-id-detail-val">{vc.patientName || lookupResult.name}</strong>
                                <small className="appointment-id-detail-sub">Patient ID: {lookupResult.id}</small>
                              </div>

                              <div>
                                <span className="appointment-id-detail-label">Fee:</span>
                                <strong className="appointment-id-detail-val">{vc.fee || '₹800'}</strong>
                                <small className="appointment-id-detail-sub">Txn: {vc.transactionId || 'Verified'}</small>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
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

export default FindDoctorPage
