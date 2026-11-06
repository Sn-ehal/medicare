import { useNavigate } from 'react-router-dom'
import './FloatingFindDoctorBtn.css'

const FloatingFindDoctorBtn = () => {
  const navigate = useNavigate()

  return (
    <button
      id="floating-find-doctor-btn"
      className="floating-find-doctor"
      onClick={() => navigate('/find-doctors?nearMe=true')}
      aria-label="Find Doctor Near You"
    >
      <div className="floating-find-doctor__icon-wrap">
        <svg
          className="floating-find-doctor__icon"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <span className="floating-find-doctor__online-badge" aria-hidden="true" />
      </div>

      <div className="floating-find-doctor__label">
        <span className="floating-find-doctor__text">Find Doctor Near You</span>
        <span className="floating-find-doctor__live-dot" title="Doctors online & available" />
      </div>
    </button>
  )
}

export default FloatingFindDoctorBtn
