import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './SurgeryPage.css'

// =============================================================================
// MEDICARE SURGICAL CARE NETWORK DATA
// =============================================================================

// Partner Multi-Specialty Hospitals
const PARTNER_HOSPITALS = [
  {
    id: 'hosp-apollo',
    name: 'Apollo Hospitals',
    logoBadge: '🏥 Premier Tie-Up',
    accreditation: 'NABH & JCI Accredited',
    tagline: 'Multi-organ surgical care, robotic surgery & 24×7 ICU backup',
    features: ['Robotic & Laparoscopic OTs', 'Cashless TPA Desk', 'Dedicated Care Coordinator'],
    rating: 4.9,
    reviewsCount: 3420,
    cities: 'Kolkata, Mumbai, Delhi NCR, Bengaluru, Chennai, Hyderabad',
  },
  {
    id: 'hosp-fortis',
    name: 'Fortis Healthcare',
    logoBadge: '🏥 Premier Tie-Up',
    accreditation: 'NABH & JCI Accredited',
    tagline: 'Advanced orthopedics, cardiac surgery, and minimally invasive care',
    features: ['Ultra-Clean Modular OTs', 'Zero-Advance Cashless', 'Specialist Pre-Op Clinic'],
    rating: 4.8,
    reviewsCount: 2890,
    cities: 'Delhi NCR, Mumbai, Kolkata, Bengaluru, Mohali, Jaipur',
  },
  {
    id: 'hosp-max',
    name: 'Max Super Speciality Hospital',
    logoBadge: '🏥 Premier Tie-Up',
    accreditation: 'NABH & JCI Certified',
    tagline: 'Excellence in oncology, neurosurgery, bariatric, and general surgeries',
    features: ['Da Vinci Xi Surgical Robot', 'Fast-Track Recovery Protocol', 'Insurance Assistance'],
    rating: 4.9,
    reviewsCount: 2650,
    cities: 'Delhi NCR, Dehradun, Mohali, Lucknow',
  },
  {
    id: 'hosp-manipal',
    name: 'Manipal Hospitals',
    logoBadge: '🏥 Premier Tie-Up',
    accreditation: 'NABH Accredited',
    tagline: 'Leading quaternary care with cutting-edge surgical suites',
    features: ['Daycare Surgery Wing', 'International Infection Control', 'Pre-Anesthesia Clinic'],
    rating: 4.8,
    reviewsCount: 2150,
    cities: 'Bengaluru, Kolkata, Delhi, Jaipur, Goa, Pune',
  },
  {
    id: 'hosp-medanta',
    name: 'Medanta - The Medicity',
    logoBadge: '🏥 Premier Tie-Up',
    accreditation: 'JCI, NABH & NABL Accredited',
    tagline: 'World-renowned destination for complex cardiac, vascular, and neuro surgeries',
    features: ['Hybrid Operating Suites', 'Comprehensive Rehab Center', 'Global Standard Protocols'],
    rating: 4.9,
    reviewsCount: 3100,
    cities: 'Gurugram, Lucknow, Patna, Indore',
  },
  {
    id: 'hosp-narayana',
    name: 'Narayana Health',
    logoBadge: '🏥 Premier Tie-Up',
    accreditation: 'NABH Accredited',
    tagline: 'Affordable high-precision surgeries with clinical excellence',
    features: ['Transparent Package Pricing', 'Rapid Admission Protocol', '24×7 Specialist Coverage'],
    rating: 4.8,
    reviewsCount: 1980,
    cities: 'Bengaluru, Kolkata, Ahmedabad, Jaipur, Mumbai, Mysore',
  },
]

// Common Surgical Categories Facilitated Through Partner Hospitals
const SURGERY_CATEGORIES = [
  {
    id: 'cat-general',
    name: 'General & Laparoscopic Surgery',
    icon: '🩺',
    description: 'Minimally invasive, small incision procedures for faster recovery & minimal pain.',
    specialtyQuery: 'Orthopedic',
    procedures: [
      { name: 'Laparoscopic Gallbladder Stone Removal (Cholecystectomy)', stay: '1 Day Daycare', technique: 'Laser / Laparoscopic', rating: 4.9 },
      { name: 'Inguinal / Umbilical Hernia Repair (Mesh Plasty)', stay: 'Daycare / 1 Day', technique: 'Keyhole 3D Mesh', rating: 4.8 },
      { name: 'Laser Piles, Fissure & Fistula Treatment', stay: 'Daycare (Discharge in 6 hrs)', technique: 'German Laser', rating: 4.9 },
      { name: 'Laparoscopic Appendectomy', stay: '1-2 Days', technique: 'Minimally Invasive', rating: 4.8 },
    ],
  },
  {
    id: 'cat-ortho',
    name: 'Orthopedics & Joint Replacement',
    icon: '🦴',
    description: 'World-class joint reconstructions, robotic knee replacements, and sports injuries.',
    specialtyQuery: 'Orthopedic',
    procedures: [
      { name: 'Total Knee Replacement (Robotic / Navigated)', stay: '2-3 Days', technique: 'Robotic Sub-millimeter', rating: 4.9 },
      { name: 'Total Hip Replacement (Bipolar / Ceramic)', stay: '2-3 Days', technique: 'Minimally Invasive Posterior', rating: 4.9 },
      { name: 'Arthroscopic ACL Reconstruction & Meniscus Repair', stay: '1 Day', technique: 'Keyhole Sports Surgery', rating: 4.8 },
      { name: 'Carpal Tunnel & Trigger Finger Release', stay: 'Daycare', technique: 'Micro-surgical', rating: 4.8 },
    ],
  },
  {
    id: 'cat-eye',
    name: 'Ophthalmology (Eye Surgeries)',
    icon: '👁️',
    description: 'Blade-free vision restoration, premium toric/multifocal lenses, and laser corrections.',
    specialtyQuery: 'All',
    procedures: [
      { name: 'Micro-Incision Cataract Surgery (Phaco + Premium IOL)', stay: 'Daycare (1-2 Hours)', technique: 'Blade-Free Laser Phaco', rating: 5.0 },
      { name: 'Contoura Vision & Custom LASIK', stay: 'Daycare (30 Mins)', technique: 'Femtosecond Laser', rating: 4.9 },
      { name: 'Glaucoma Trabeculectomy & Valve Implants', stay: 'Daycare', technique: 'Micro-Shunt', rating: 4.8 },
    ],
  },
  {
    id: 'cat-gynae',
    name: 'Gynecology & Women’s Health',
    icon: '🌸',
    description: 'Compassionate surgical care for fibroids, endometriosis, cysts, and maternity.',
    specialtyQuery: 'Gynecologist',
    procedures: [
      { name: 'Laparoscopic Uterine Fibroid Removal (Myomectomy)', stay: '1-2 Days', technique: 'Uterus-Sparing Keyhole', rating: 4.9 },
      { name: 'Laparoscopic / Total Hysterectomy', stay: '2 Days', technique: 'Minimally Invasive', rating: 4.8 },
      { name: 'Ovarian Cystectomy & PCOD Laparoscopic Drilling', stay: '1 Day', technique: 'Fertility-Preserving', rating: 4.9 },
      { name: 'Planned Cesarean Section (C-Section)', stay: '3 Days', technique: 'Gentle Delivery Protocol', rating: 4.9 },
    ],
  },
  {
    id: 'cat-urology',
    name: 'Urology & Kidney Care',
    icon: '💧',
    description: 'Advanced laser lithotripsy for kidney stones and prostate management.',
    specialtyQuery: 'All',
    procedures: [
      { name: 'Laser Kidney Stone Removal (RIRS / PCNL)', stay: 'Daycare / 1 Day', technique: 'Holmium Laser Dusting', rating: 4.9 },
      { name: 'Laser Prostate Surgery (TURP / HoLEP)', stay: '1-2 Days', technique: 'Bloodless Laser Enucleation', rating: 4.8 },
      { name: 'Circumcision (Stapler / Laser Technique)', stay: 'Daycare', technique: 'ZSR Painless Stapler', rating: 4.9 },
    ],
  },
  {
    id: 'cat-ent',
    name: 'ENT & Sinus Surgeries',
    icon: '👂',
    description: 'Precision endoscopic sinus navigation, eardrum micro-repairs, and airway surgeries.',
    specialtyQuery: 'All',
    procedures: [
      { name: 'Functional Endoscopic Sinus Surgery (FESS)', stay: 'Daycare', technique: 'HD 4K Endoscopic Navigation', rating: 4.8 },
      { name: 'Deviated Septum Correction (Septoplasty)', stay: 'Daycare / 1 Day', technique: 'Minimally Invasive', rating: 4.8 },
      { name: 'Micro-Tympanoplasty (Eardrum Hole Repair)', stay: 'Daycare', technique: 'Endomeatal Micro-graft', rating: 4.9 },
      { name: 'Coblation Tonsillectomy & Adenoidectomy', stay: 'Daycare', technique: 'Plasma Cold Coblation', rating: 4.9 },
    ],
  },
]

// Verified Patient Reviews & Testimonials for Partner Hospital Surgeries
const SURGERY_REVIEWS = [
  {
    id: 'rev-1',
    patientName: 'Ramesh K. Sengupta',
    location: 'Salt Lake, Kolkata',
    procedure: 'Laparoscopic Gallbladder Surgery',
    hospitalName: 'Apollo Hospitals, Kolkata',
    doctorConsulted: 'Consulted General Surgeon via MediCare',
    rating: 5,
    date: '18 Oct 2026',
    verified: true,
    feedback:
      'I was worried about direct surgery booking, but MediCare explained that a doctor consultation is compulsory. The surgeon thoroughly examined my ultrasound, confirmed the stone size, and scheduled the surgery at Apollo. Cashless insurance was approved within 90 minutes. I walked back home the very next day with zero complications!',
  },
  {
    id: 'rev-2',
    patientName: 'Sunita V. Deshpande',
    location: 'Andheri West, Mumbai',
    procedure: 'Robotic Bilateral Knee Replacement',
    hospitalName: 'Fortis Healthcare, Mulund',
    doctorConsulted: 'Dr. Arun Patel (Orthopedic Surgeon)',
    rating: 5,
    date: '04 Oct 2026',
    verified: true,
    feedback:
      'Suffered from severe osteoarthritis for 5 years. I booked an appointment with Dr. Arun Patel on the Find Doctor page. He explained the robotic navigation technique at Fortis. The hospital OT was immaculate, nursing care was 10/10, and my MediCare care coordinator handled all the paperwork. Best decision for my mobility!',
  },
  {
    id: 'rev-3',
    patientName: 'Amitabh Sharma',
    location: 'Saket, New Delhi',
    procedure: 'Micro-Incision Cataract Surgery with Multifocal Lens',
    hospitalName: 'Max Super Speciality Hospital, Saket',
    doctorConsulted: 'Consulted Senior Ophthalmologist',
    rating: 5,
    date: '24 Sep 2026',
    verified: true,
    feedback:
      'Zero pain, completed in just 20 minutes under daycare! The doctor examined my eyes carefully during the initial OPD visit, checked my diabetic reports, and cleared me for surgery. The partner hospital tie-up gave me complete peace of mind. No hidden costs whatsoever.',
  },
  {
    id: 'rev-4',
    patientName: 'Pooja Datta',
    location: 'Indiranagar, Bengaluru',
    procedure: 'Laparoscopic Uterine Fibroid Removal (Myomectomy)',
    hospitalName: 'Manipal Hospitals, Bengaluru',
    doctorConsulted: 'Dr. Meena Gupta (Gynecologist & Laparoscopic Surgeon)',
    rating: 5,
    date: '12 Sep 2026',
    verified: true,
    feedback:
      'Finding the right surgeon on MediCare gave me the confidence I needed. Dr. Meena took the time to answer all my questions and guided me to Manipal Hospital where the laparoscopy was performed. The partner hospital room was comfortable and recovery was smooth. Highly recommend consulting first!',
  },
  {
    id: 'rev-5',
    patientName: 'Kishore J. Nair',
    location: 'Banjara Hills, Hyderabad',
    procedure: 'Holmium Laser Kidney Stone Removal (RIRS)',
    hospitalName: 'Apollo Hospitals, Hyderabad',
    doctorConsulted: 'Consulted Urologist via MediCare',
    rating: 5,
    date: '29 Aug 2026',
    verified: true,
    feedback:
      'I had a 12mm kidney stone causing unbearable flank pain. The doctor evaluated my CT KUB scan and recommended laser dusting. Admission at Apollo was arranged within 4 hours. No incisions, no scars, discharged the next morning. Fantastic coordination!',
  },
]

// Frequently Asked Questions
const SURGERY_FAQS = [
  {
    q: 'Why can’t I book a surgery directly online without a doctor consultation?',
    a: 'Surgery is a serious clinical intervention. Medical ethics and regulatory protocols require that every patient undergo an in-depth clinical evaluation, diagnostic review (e.g. imaging, pre-op blood panels, cardiac fitness), and a thorough risk assessment by a qualified surgeon before any procedure can be scheduled. This protects patient safety and ensures that non-surgical or minimally invasive alternatives are considered first.',
  },
  {
    q: 'How does MediCare facilitate surgeries if you do not operate hospitals?',
    a: 'MediCare operates as a healthcare network aggregator. We tie up with premier NABH and JCI accredited hospitals across India (including Apollo, Fortis, Max, Manipal, Medanta, and Narayana Health). Our role is to connect you with verified specialist surgeons, coordinate your hospital admission, and assist with cashless insurance paperwork.',
  },
  {
    q: 'How do I start if I or a family member needs surgery?',
    a: 'Simply click "Find a Doctor & Book Consultation" to visit our Find Doctor directory. Choose your relevant specialist (e.g., General Surgeon, Orthopedic, Gynecologist, Ophthalmologist) and book an in-person or video consultation. Your doctor will diagnose your condition, review prior reports, and arrange admission at our partner hospitals if surgery is indicated.',
  },
  {
    q: 'Is health insurance and cashless claim accepted at partner hospitals?',
    a: 'Yes! All our partner hospitals feature dedicated 24×7 TPA and insurance desks supporting 40+ leading public and private health insurers (Star Health, HDFC ERGO, Care, Niva Bupa, ICICI Lombard, Medi Assist, etc.). Our care coordinators assist with pre-authorization so you experience seamless cashless hospitalization.',
  },
  {
    q: 'Can I get a second opinion on an already advised surgery?',
    a: 'Absolutely. Many patients consult our verified senior surgeons specifically for an unbiased second opinion before committing to major surgical procedures.',
  },
]

const SurgeryPage = () => {
  const navigate = useNavigate()
  const hospitalSectionRef = useRef(null)
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    document.title = 'Surgical Care & Partner Hospital Network | MediCare'
  }, [])

  const filteredCategories = selectedCategory === 'all'
    ? SURGERY_CATEGORIES
    : SURGERY_CATEGORIES.filter(c => c.id === selectedCategory)

  return (
    <div className="surgery-page">
      <Navbar />

      {/* =========================================================================
          HERO SECTION: SURGICAL CARE VIA PARTNER HOSPITALS
          ========================================================================= */}
      <header className="surgery-hero">
        <div className="container">
          <div className="surgery-hero__badge">
            <span className="surgery-hero__badge-pulse" />
            <span>🏥 Accredited Hospital Network • Verified Specialist Doctors</span>
          </div>

          <h1 className="surgery-hero__title">
            Advanced Surgical Care at <span>Partner Multi-Specialty Hospitals</span>
          </h1>

          <p className="surgery-hero__subtitle">
            <strong>Direct online surgery booking is not available.</strong> For clinical safety, every surgery
            must begin with an evaluation by a verified specialist doctor. MediCare has partnered with top
            NABH & JCI accredited hospital networks across India to provide transparent pricing, cashless insurance, and world-class surgical facilities.
          </p>

          {/* Primary Call to Action Group */}
          <div className="surgery-hero__cta-group">
            <button
              type="button"
              id="hero-find-doctor-btn"
              className="surgery-hero-btn surgery-hero-btn--primary"
              onClick={() => navigate('/find-doctors')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>Consult Doctor First & Book OPD</span>
            </button>

            <button
              type="button"
              id="hero-view-hospitals-btn"
              className="surgery-hero-btn surgery-hero-btn--secondary"
              onClick={() => hospitalSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 21h18M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16M9 9h6M9 13h6M9 17h6" />
              </svg>
              <span>View Partner Hospitals</span>
            </button>
          </div>

          {/* Key Confidence Metric Cards */}
          <div className="surgery-hero__stats">
            <div className="surgery-stat-box">
              <span className="surgery-stat-num">150+</span>
              <span className="surgery-stat-label">NABH & JCI Partner Hospitals</span>
            </div>
            <div className="surgery-stat-box">
              <span className="surgery-stat-num">25,000+</span>
              <span className="surgery-stat-label">Successful Surgeries Facilitated</span>
            </div>
            <div className="surgery-stat-box">
              <span className="surgery-stat-num">4.9 ★</span>
              <span className="surgery-stat-label">Positive Patient Reviews</span>
            </div>
            <div className="surgery-stat-box">
              <span className="surgery-stat-num">100%</span>
              <span className="surgery-stat-label">Cashless Insurance Support</span>
            </div>
          </div>
        </div>
      </header>

      {/* =========================================================================
          IMPORTANT CLINICAL NOTICE: WHY DIRECT SURGERY IS NOT AVAILABLE
          ========================================================================= */}
      <section className="surgery-notice-strip">
        <div className="container">
          <div className="surgery-notice-card">
            <div className="surgery-notice-card__icon">⚠️</div>
            <div className="surgery-notice-card__content">
              <h3>Notice for Patients: No Direct Online Surgery Booking</h3>
              <p>
                Under established medical guidelines, <strong>no medical surgery can be booked directly online</strong> without
                an in-person clinical diagnosis, review of medical imaging/pathology reports, and anesthesia clearance.
                MediCare acts as your healthcare liaison: <strong>we connect you with top certified surgeons on our Find Doctor portal</strong>,
                who assess your condition and arrange admission at our accredited partner hospitals.
              </p>
            </div>
            <button
              type="button"
              className="surgery-notice-btn"
              onClick={() => navigate('/find-doctors')}
            >
              Go to Find Doctor Page ➔
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          THE 4-STEP SURGICAL CARE PATHWAY
          ========================================================================= */}
      <section className="surgery-pathway-section">
        <div className="container">
          <div className="surgery-section-heading text-center">
            <span className="surgery-pill surgery-pill--blue">Standard Care Protocol</span>
            <h2>How Surgical Care Works at MediCare</h2>
            <p>From initial specialist consultation to safe recovery at partner hospitals.</p>
          </div>

          <div className="surgery-pathway-steps">
            <div className="pathway-step">
              <div className="pathway-step__num">1</div>
              <div className="pathway-step__icon">👨‍⚕️</div>
              <h3>Consult a Verified Doctor</h3>
              <p>
                Visit our <Link to="/find-doctors" className="pathway-link">Find Doctor</Link> page.
                Choose a verified general surgeon, orthopedic specialist, or gynecologist for a detailed evaluation.
              </p>
            </div>

            <div className="pathway-step__arrow">➔</div>

            <div className="pathway-step">
              <div className="pathway-step__num">2</div>
              <div className="pathway-step__icon">🔬</div>
              <h3>Pre-Operative Diagnostics</h3>
              <p>
                Your doctor orders essential pre-op blood tests, ECG, and scans to confirm surgical necessity and assess anesthetic fitness.
              </p>
            </div>

            <div className="pathway-step__arrow">➔</div>

            <div className="pathway-step">
              <div className="pathway-step__num">3</div>
              <div className="pathway-step__icon">🏥</div>
              <h3>Partner Hospital Admission</h3>
              <p>
                Your procedure is scheduled at our NABH/JCI accredited partner hospitals (Apollo, Fortis, Max, etc.) with 100% cashless insurance support.
              </p>
            </div>

            <div className="pathway-step__arrow">➔</div>

            <div className="pathway-step">
              <div className="pathway-step__num">4</div>
              <div className="pathway-step__icon">💚</div>
              <h3>Post-Op Recovery & Follow-up</h3>
              <p>
                Experience fast-track recovery, discharge assistance, and follow-up reviews directly with your operating specialist.
              </p>
            </div>
          </div>

          <div className="surgery-pathway-cta text-center">
            <button
              type="button"
              className="surgery-main-cta-btn"
              onClick={() => navigate('/find-doctors')}
            >
              <span>Step 1: Book Your Doctor Consultation on Find Doctor</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          PARTNER HOSPITALS NETWORK
          ========================================================================= */}
      <section className="surgery-hospitals-section" id="hospital-network" ref={hospitalSectionRef}>
        <div className="container">
          <div className="surgery-section-heading text-center">
            <span className="surgery-pill surgery-pill--teal">Hospital Tie-Ups</span>
            <h2>Our Accredited Hospital Partners Across India</h2>
            <p>
              MediCare partners exclusively with multi-specialty hospitals certified by
              <strong> NABH (National Accreditation Board for Hospitals)</strong> and <strong>JCI (Joint Commission International)</strong>.
            </p>
          </div>

          <div className="surgery-hospitals-grid">
            {PARTNER_HOSPITALS.map((hosp) => (
              <div key={hosp.id} className="surgery-hospital-card">
                <div className="surgery-hospital-card__top">
                  <span className="surgery-hospital-badge">{hosp.logoBadge}</span>
                  <span className="surgery-hospital-rating">⭐ {hosp.rating} ({hosp.reviewsCount} reviews)</span>
                </div>

                <h3 className="surgery-hospital-name">{hosp.name}</h3>
                <p className="surgery-hospital-accred">{hosp.accreditation}</p>
                <p className="surgery-hospital-tagline">{hosp.tagline}</p>

                <div className="surgery-hospital-features">
                  {hosp.features.map((feat) => (
                    <span key={feat} className="surgery-feature-tag">✓ {feat}</span>
                  ))}
                </div>

                <div className="surgery-hospital-cities">
                  <span className="cities-label">Locations:</span>
                  <span className="cities-val">{hosp.cities}</span>
                </div>

                <div className="surgery-hospital-actions">
                  <button
                    type="button"
                    className="surgery-hospital-btn"
                    onClick={() => navigate('/find-doctors')}
                  >
                    <span>Consult Doctor for this Hospital</span>
                    <span>➔</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SURGERIES OFFERED VIA PARTNER HOSPITALS
          ========================================================================= */}
      <section className="surgery-procedures-section">
        <div className="container">
          <div className="surgery-section-heading text-center">
            <span className="surgery-pill surgery-pill--blue">Procedures & Specialities</span>
            <h2>Common Surgeries Performed at Partner Hospitals</h2>
            <p>All surgeries are conducted with minimally invasive techniques, short hospital stays, and full insurance coverage.</p>
          </div>

          {/* Category Filter Pills */}
          <div className="surgery-filter-row">
            <button
              type="button"
              className={`surgery-filter-pill ${selectedCategory === 'all' ? 'surgery-filter-pill--active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              All Specialties ({SURGERY_CATEGORIES.length})
            </button>
            {SURGERY_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`surgery-filter-pill ${selectedCategory === cat.id ? 'surgery-filter-pill--active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>

          {/* Procedures List */}
          <div className="surgery-categories-list">
            {filteredCategories.map((cat) => (
              <div key={cat.id} className="surgery-category-block">
                <div className="surgery-category-header">
                  <span className="category-icon">{cat.icon}</span>
                  <div>
                    <h3>{cat.name}</h3>
                    <p>{cat.description}</p>
                  </div>
                </div>

                <div className="surgery-procedures-table">
                  {cat.procedures.map((proc) => (
                    <div key={proc.name} className="procedure-row">
                      <div className="procedure-row__info">
                        <strong className="procedure-name">{proc.name}</strong>
                        <div className="procedure-badges">
                          <span className="proc-tech-badge">⚡ {proc.technique}</span>
                          <span className="proc-stay-badge">⏱️ {proc.stay}</span>
                          <span className="proc-rating-badge">★ {proc.rating} rating</span>
                        </div>
                      </div>

                      <div className="procedure-row__action">
                        <button
                          type="button"
                          className="procedure-consult-btn"
                          onClick={() => navigate('/find-doctors')}
                        >
                          <span>Consult Doctor</span>
                          <span>➔</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          POSITIVE PATIENT REVIEWS & TESTIMONIALS
          ========================================================================= */}
      <section className="surgery-reviews-section" id="patient-reviews">
        <div className="container">
          <div className="surgery-section-heading text-center">
            <span className="surgery-pill surgery-pill--gold">Verified Patient Feedback</span>
            <h2>Positive Reviews from Treated Surgical Patients</h2>
            <p>
              Over <strong>25,000+ patients</strong> have consulted our specialist doctors and completed successful
              surgeries through our partner hospital network with an average rating of <strong>4.9 / 5.0</strong>.
            </p>
          </div>

          <div className="surgery-reviews-grid">
            {SURGERY_REVIEWS.map((rev) => (
              <article key={rev.id} className="surgery-review-card">
                <div className="surgery-review-card__header">
                  <div className="surgery-reviewer-avatar">
                    {rev.patientName.charAt(0)}
                  </div>
                  <div className="surgery-reviewer-info">
                    <strong className="reviewer-name">{rev.patientName}</strong>
                    <span className="reviewer-location">📍 {rev.location}</span>
                  </div>
                  <div className="surgery-review-stars">
                    {'★'.repeat(rev.rating)}
                  </div>
                </div>

                <div className="surgery-review-meta">
                  <span className="meta-tag meta-tag--procedure">📋 {rev.procedure}</span>
                  <span className="meta-tag meta-tag--hospital">🏥 {rev.hospitalName}</span>
                </div>

                <blockquote className="surgery-review-text">
                  “{rev.feedback}”
                </blockquote>

                <div className="surgery-review-footer">
                  <span className="reviewer-doctor">🩺 {rev.doctorConsulted}</span>
                  <span className="reviewer-verified">✓ Verified Patient</span>
                </div>
              </article>
            ))}
          </div>

          {/* Review Summary Scorecard */}
          <div className="surgery-scorecard">
            <div className="scorecard-left">
              <span className="scorecard-score">4.9</span>
              <div className="scorecard-stars">★★★★★</div>
              <span className="scorecard-sub">Overall Surgical Care Satisfaction</span>
            </div>
            <div className="scorecard-bars">
              <div className="scorecard-bar-item">
                <span>Doctor Consultation & Guidance</span>
                <div className="bar-track"><div className="bar-fill" style={{ width: '99%' }} /></div>
                <span>99%</span>
              </div>
              <div className="scorecard-bar-item">
                <span>Partner Hospital OT & Cleanliness</span>
                <div className="bar-track"><div className="bar-fill" style={{ width: '98%' }} /></div>
                <span>98%</span>
              </div>
              <div className="scorecard-bar-item">
                <span>Cashless Insurance Hassle-Free</span>
                <div className="bar-track"><div className="bar-fill" style={{ width: '97%' }} /></div>
                <span>97%</span>
              </div>
              <div className="scorecard-bar-item">
                <span>Post-Op Recovery & Follow-up</span>
                <div className="bar-track"><div className="bar-fill" style={{ width: '99%' }} /></div>
                <span>99%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CALL TO ACTION BANNER: CONSULT DOCTOR ON FIND DOCTOR
          ========================================================================= */}
      <section className="surgery-cta-banner">
        <div className="container">
          <div className="surgery-cta-box">
            <div className="surgery-cta-box__text">
              <span className="cta-badge">Ready for Safe Surgical Care?</span>
              <h2>Start Your Care with a Verified Doctor Today</h2>
              <p>
                Do not wait with unaddressed pain or symptoms. Book an initial evaluation with a senior doctor
                on our Find Doctor portal. We coordinate everything with our accredited partner hospitals.
              </p>
            </div>
            <div className="surgery-cta-box__actions">
              <button
                type="button"
                id="cta-find-doctor-btn"
                className="surgery-cta-main-btn"
                onClick={() => navigate('/find-doctors')}
              >
                <span>Go to Find Doctor Page</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
              <span className="cta-assurance">🔒 100% Confidential • Verified Medical Specialists</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FAQ SECTION
          ========================================================================= */}
      <section className="surgery-faq-section">
        <div className="container">
          <div className="surgery-section-heading text-center">
            <span className="surgery-pill surgery-pill--blue">Frequently Asked Questions</span>
            <h2>Surgery & Hospital Care FAQs</h2>
            <p>Transparent information regarding surgery protocols, hospital tie-ups, and insurance.</p>
          </div>

          <div className="surgery-faq-list">
            {SURGERY_FAQS.map((faq, idx) => (
              <details key={faq.q} className="surgery-faq-item" open={idx === 0}>
                <summary className="surgery-faq-question">
                  <span>{faq.q}</span>
                  <span className="faq-chevron">▼</span>
                </summary>
                <div className="surgery-faq-answer">
                  <p>{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default SurgeryPage
