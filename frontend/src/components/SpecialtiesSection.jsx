import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './SpecialtiesSection.css'

const primarySpecialties = [
  {
    id: 'spec-period',
    image: '/images/specialties/period-pregnancy.jpg',
    title: 'Period doubts or Pregnancy',
    searchQuery: 'Gynecologist',
  },
  {
    id: 'spec-skin',
    image: '/images/specialties/acne-skin.jpg',
    title: 'Acne, pimple or skin issues',
    searchQuery: 'Dermatologist',
  },
  {
    id: 'spec-performance',
    image: '/images/specialties/performance-issues.jpg',
    title: 'Sexual health concerns',
    searchQuery: 'Sexologist',
  },
  {
    id: 'spec-cold',
    image: '/images/specialties/cold-cough-fever.jpg',
    title: 'Cold, cough or fever',
    searchQuery: 'General Physician',
  },
  {
    id: 'spec-child',
    image: '/images/specialties/child-unwell.jpg',
    title: 'Child not feeling well',
    searchQuery: 'Pediatrician',
  },
  {
    id: 'spec-depression',
    image: '/images/specialties/depression-anxiety.jpg',
    title: 'Depression or anxiety',
    searchQuery: 'Psychiatrist',
  },
]

const extraSpecialties = [
  {
    id: 'spec-diabetes',
    image: '/images/specialties/diabetes-management.png',
    title: 'Diabetes Management',
    searchQuery: 'Endocrinologist',
  },
  {
    id: 'spec-heart',
    image: '/images/specialties/heart-cardiology.png',
    title: 'Heart & Cardiology',
    searchQuery: 'Cardiologist',
  },
  {
    id: 'spec-hair',
    image: '/images/specialties/hairfall.png',
    title: 'Hair Fall & Loss',
    searchQuery: 'Trichologist',
  },
  {
    id: 'spec-eye',
    image: '/images/specialties/eye-problems.png',
    title: 'Eye Problems',
    searchQuery: 'Ophthalmologist',
  },
  {
    id: 'spec-bones',
    image: '/images/specialties/bone-joints.png',
    title: 'Bone & Joint Pain',
    searchQuery: 'Orthopedic',
  },
  {
    id: 'spec-stomach',
    image: '/images/specialties/stomach-digestion.png',
    title: 'Stomach & Digestion',
    searchQuery: 'Gastroenterologist',
  },
]

const SpecialtiesSection = () => {
  const navigate = useNavigate()
  const [showAll, setShowAll] = useState(false)

  const displayedSpecialties = showAll
    ? [...primarySpecialties, ...extraSpecialties]
    : primarySpecialties

  const handleConsult = (searchQuery) => {
    navigate(`/video-consult?specialty=${encodeURIComponent(searchQuery)}`)
  }

  return (
    <section className="specialties" id="specialties-section">
      <div className="container">
        {/* Header (Exact wording from Reference Image 1) */}
        <div className="specialties__header">
          <div className="specialties__header-left">
            <h2 className="specialties__title">
              Consult top doctors online for any health concern
            </h2>
            <p className="specialties__subtitle">
              Private online consultations with verified doctors in all specialists
            </p>
          </div>
          <button
            id="view-all-specialities-btn"
            className="specialties__view-all"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Show Top Specialities' : 'View All Specialities'}
          </button>
        </div>

        {/* 6 Circular Specialty Items (Matches Reference Image 1) */}
        <div className={`specialties__grid ${showAll ? 'specialties__grid--expanded' : ''}`}>
          {displayedSpecialties.map((spec, i) => (
            <div
              key={spec.id}
              id={spec.id}
              className="specialty-card"
              onClick={() => handleConsult(spec.searchQuery)}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && handleConsult(spec.searchQuery)}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="specialty-card__icon-wrap">
                <img
                  src={spec.image}
                  alt={spec.title}
                  className="specialty-card__img"
                  loading="lazy"
                />
              </div>

              <h3 className="specialty-card__title">{spec.title}</h3>

              <button
                type="button"
                className="specialty-card__consult-link"
                onClick={e => {
                  e.stopPropagation()
                  handleConsult(spec.searchQuery)
                }}
              >
                CONSULT NOW
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default SpecialtiesSection
