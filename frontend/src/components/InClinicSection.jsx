import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './InClinicSection.css'

const inClinicSpecialties = [
  {
    id: 'clinic-physician',
    title: 'General Physician',
    subtitle: 'Consult for fever, cold, cough and other common health concerns',
    image: '/images/in-clinic/general-physician.jpg',
    searchQuery: 'General Physician',
  },
  {
    id: 'clinic-orthopedic',
    title: 'Orthopedic',
    subtitle: 'Expert care for bone, joint, sports injuries and mobility issues',
    image: '/images/in-clinic/orthopedic.jpg',
    searchQuery: 'Orthopedic',
  },
  {
    id: 'clinic-dentist',
    title: 'Dentist',
    subtitle: 'Teething troubles? Schedule a dental checkup',
    image: '/images/in-clinic/dentist.jpg',
    searchQuery: 'Dentist',
  },
  {
    id: 'clinic-gynecologist',
    title: 'Gynecologist/Obstetrician',
    subtitle: "Explore for women's health, pregnancy and fertility treatments",
    image: '/images/in-clinic/gynecologist.jpg',
    searchQuery: 'Gynecologist',
  },
  {
    id: 'clinic-pediatrician',
    title: 'Pediatrician',
    subtitle: "Specialized care for children's health and development",
    image: '/images/in-clinic/pediatrician.jpg',
    searchQuery: 'Pediatrician',
  },
  {
    id: 'clinic-dermatologist',
    title: 'Dermatologist',
    subtitle: 'Treatment for skin, hair and nail problems',
    image: '/images/in-clinic/dermatologist.jpg',
    searchQuery: 'Dermatologist',
  },
  {
    id: 'clinic-dietitian',
    title: 'Dietitian/Nutrition',
    subtitle: 'Get guidance on eating right, weight management and sports nutrition',
    image: '/images/in-clinic/dietitian.jpg',
    searchQuery: 'Dietitian',
  },
  {
    id: 'clinic-physiotherapist',
    title: 'Physiotherapist',
    subtitle: 'Pulled a muscle? Get it treated by a trained physiotherapist',
    image: '/images/in-clinic/physiotherapist.jpg',
    searchQuery: 'Physiotherapist',
  },
]

const InClinicSection = () => {
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerView, setItemsPerView] = useState(4)

  useEffect(() => {
    const updateItemsPerView = () => {
      const width = window.innerWidth
      if (width <= 520) {
        setItemsPerView(1)
      } else if (width <= 768) {
        setItemsPerView(2)
      } else if (width <= 1100) {
        setItemsPerView(3)
      } else {
        setItemsPerView(4)
      }
    }

    updateItemsPerView()
    window.addEventListener('resize', updateItemsPerView)
    return () => window.removeEventListener('resize', updateItemsPerView)
  }, [])

  const maxIndex = Math.max(0, inClinicSpecialties.length - itemsPerView)

  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(maxIndex, prev + 1))
  }

  const handleCardClick = (searchQuery) => {
    navigate(`/find-doctors?search=${encodeURIComponent(searchQuery)}`)
  }

  const gap = itemsPerView === 4 ? 24 : itemsPerView === 3 ? 20 : 16

  return (
    <section className="in-clinic" id="in-clinic-section">
      <div className="container">
        {/* Section Header (Matches Reference Image 1) */}
        <div className="in-clinic__header">
          <h2 className="in-clinic__title">Book an appointment for an in-clinic consultation</h2>
          <p className="in-clinic__subtitle">Find experienced doctors across all specialties</p>
        </div>

        {/* Carousel Slider */}
        <div className="in-clinic__carousel-wrapper">
          {/* Previous Arrow Button */}
          <button
            type="button"
            className="in-clinic__nav-btn in-clinic__nav-btn--prev"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            aria-label="Previous specialties"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          {/* Cards Viewport */}
          <div className="in-clinic__viewport">
            <div
              className="in-clinic__track"
              style={{
                transform: `translateX(calc(-${currentIndex} * ((100% + ${gap}px) / ${itemsPerView})))`,
              }}
            >
              {inClinicSpecialties.map((item) => (
                <div
                  key={item.id}
                  id={item.id}
                  className="in-clinic__card"
                  onClick={() => handleCardClick(item.searchQuery)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && handleCardClick(item.searchQuery)}
                >
                  <div className="in-clinic__image-wrap">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="in-clinic__image"
                      loading="lazy"
                    />
                  </div>
                  <div className="in-clinic__card-body">
                    <h3 className="in-clinic__card-title">{item.title}</h3>
                    <p className="in-clinic__card-subtitle">{item.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next Arrow Button */}
          <button
            type="button"
            className="in-clinic__nav-btn in-clinic__nav-btn--next"
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
            aria-label="Next specialties"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}

export default InClinicSection
