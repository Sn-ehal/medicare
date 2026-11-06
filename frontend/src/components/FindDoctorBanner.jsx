import { useNavigate } from 'react-router-dom'
import './FindDoctorBanner.css'

const FindDoctorBanner = () => {
  const navigate = useNavigate()

  return (
    <section className="find-banner" id="find-doctor-banner">
      <div className="container find-banner__container">
        {/* Left Column: Heading, Value Props & CTA */}
        <div className="find-banner__left">
          <div className="find-banner__pill">
            <span className="find-banner__pill-dot" />
            Verified Healthcare Network
          </div>

          <h2 className="find-banner__title">
            Find the <span className="find-banner__title-gradient">Right Doctor</span> for You
          </h2>

          <p className="find-banner__text">
            Browse 50,000+ verified specialists. Filter by specialty, location, availability, and rating with instant consultation confirmation.
          </p>

          <div className="find-banner__features">
            {[
              { icon: '✓', text: 'Instant Booking' },
              { icon: '✓', text: 'Verified Doctors' },
              { icon: '✓', text: 'No Hidden Fees' },
            ].map(f => (
              <div key={f.text} className="find-banner__feature">
                <span className="find-banner__feature-icon">{f.icon}</span>
                {f.text}
              </div>
            ))}
          </div>

          <div className="find-banner__action-group">
            <button
              id="find-doctor-cta-btn"
              className="find-banner__btn"
              onClick={() => navigate('/find-doctors?nearMe=true')}
            >
              <div className="find-banner__btn-icon-wrap">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </div>
              Find Doctors Near You
            </button>
            <div className="find-banner__sub-note">
              <span>⚡</span> Connect in under 60 secs
            </div>
          </div>
        </div>

        {/* Right Column: Animated Doctor Visual & Floating Badges (Matches Reference Image 2) */}
        <div className="find-banner__visual">
          {/* Ambient Glow & Orbiting Circles */}
          <div className="find-banner__doctor-glow" />
          <div className="find-banner__orbit-ring" />
          <div className="find-banner__orbit-ring-outer" />

          {/* Decorative Dot Matrix */}
          <div className="find-banner__dot-grid" aria-hidden="true">
            {Array.from({ length: 16 }).map((_, i) => (
              <span key={i} />
            ))}
          </div>

          {/* Doctor Portrait Circle */}
          <div className="find-banner__doctor-frame">
            <img
              src="/images/doctor-verified-hero.jpg"
              alt="Verified Specialist Doctor"
              className="find-banner__doctor-img"
              loading="lazy"
            />
          </div>

          {/* Floating Badge 1: Top-Left (Verified Doctor) */}
          <div className="find-banner__badge find-banner__badge--verified">
            <div className="find-banner__badge-icon find-banner__badge-icon--green">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div className="find-banner__badge-info">
              <span className="find-banner__badge-title">Verified doctor</span>
              <span className="find-banner__badge-sub">ID & license checked</span>
            </div>
          </div>

          {/* Floating Badge 2: Bottom-Left (11,353 Appointments Booked) */}
          <div className="find-banner__badge find-banner__badge--appointments">
            <div className="find-banner__badge-icon find-banner__badge-icon--blue">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <div className="find-banner__badge-info">
              <span className="find-banner__badge-title">11,353</span>
              <span className="find-banner__badge-sub">
                <span className="find-banner__live-dot" /> appointments booked
              </span>
            </div>
          </div>

          {/* Floating Badge 3: Middle-Right (5.0 / 5 Rating) */}
          <div className="find-banner__badge find-banner__badge--rating">
            <div className="find-banner__badge-icon find-banner__badge-icon--orange">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <div className="find-banner__badge-info">
              <span className="find-banner__badge-title">5.0 / 5</span>
              <span className="find-banner__badge-sub">264 reviews</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FindDoctorBanner
