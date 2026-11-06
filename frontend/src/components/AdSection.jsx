import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './AdSection.css'

// 12 Authentic Indian Patient Reviews (4 slides × 3 reviews per slide)
const allReviews = [
  // Slide 1
  [
    {
      id: 1,
      name: 'Priya Sharma',
      location: 'Mumbai',
      specialty: 'General Medicine',
      avatar: '/images/patients/patient-1.jpg',
      rating: 5,
      text: 'MediCare connected me to a senior doctor within 2 minutes. The video call was crystal clear and the prescribed medicines reached my home in 2 hours!',
      time: '2 days ago',
    },
    {
      id: 2,
      name: 'Rahul Verma',
      location: 'Delhi NCR',
      specialty: 'Cardiology',
      avatar: '/images/patients/patient-2.jpg',
      rating: 5,
      text: 'Got an urgent second opinion from a top cardiologist late at night. Extremely patient, calm and explained the reports in simple Hindi & English. Life-saver!',
      time: '3 days ago',
    },
    {
      id: 3,
      name: 'Anita Patel',
      location: 'Bengaluru',
      specialty: 'Dermatology',
      avatar: '/images/patients/patient-3.jpg',
      rating: 5,
      text: 'Consulted for chronic acne that wouldn’t go away. The dermatologist prescribed a personalized routine and my skin improved dramatically in 3 weeks!',
      time: '5 days ago',
    },
  ],
  // Slide 2
  [
    {
      id: 4,
      name: 'Vikram Malhotra',
      location: 'Pune',
      specialty: 'Orthopedics',
      avatar: '/images/patients/patient-4.jpg',
      rating: 5,
      text: 'Booking my knee consultation was super seamless. MediCare coordinated my hospital appointment, MRI scan, and cashless insurance without any hassle.',
      time: '1 week ago',
    },
    {
      id: 5,
      name: 'Sneha Mukherjee',
      location: 'Kolkata',
      specialty: 'Pediatrics',
      avatar: '/images/patients/patient-5.jpg',
      rating: 5,
      text: 'My 3-year-old had a sudden high fever near midnight. Connected immediately with an empathetic pediatrician who guided us calmly step by step.',
      time: '1 week ago',
    },
    {
      id: 6,
      name: 'Arjun Rao',
      location: 'Hyderabad',
      specialty: 'Lab Diagnostics',
      avatar: '/images/patients/patient-6.jpg',
      rating: 5,
      text: 'Home sample collector was punctual at 7:00 AM sharp. Completely painless blood draw and digital test reports arrived on WhatsApp by 4 PM.',
      time: '2 weeks ago',
    },
  ],
  // Slide 3
  [
    {
      id: 7,
      name: 'Deepa Nair',
      location: 'Chennai',
      specialty: 'Gynecology',
      avatar: '/images/patients/patient-7.jpg',
      rating: 5,
      text: '100% private and respectful consultation for pregnancy doubts. The doctor answered all my questions patiently without rushing.',
      time: '2 weeks ago',
    },
    {
      id: 8,
      name: 'Rohan Gupta',
      location: 'Ahmedabad',
      specialty: 'Mental Health',
      avatar: '/images/patients/patient-8.jpg',
      rating: 5,
      text: 'Speaking to a licensed clinical psychologist online felt so secure and confidential. The sessions helped me overcome work anxiety completely.',
      time: '3 weeks ago',
    },
    {
      id: 9,
      name: 'Meera Sen',
      location: 'Jaipur',
      specialty: 'Endocrinology',
      avatar: '/images/patients/patient-9.jpg',
      rating: 5,
      text: 'Managing diabetes has become stress-free. Regular follow-ups, glucose log checks and dietary charts all accessible in one single app.',
      time: '3 weeks ago',
    },
  ],
  // Slide 4
  [
    {
      id: 10,
      name: 'Suresh Pillai',
      location: 'Kochi',
      specialty: 'Urology',
      avatar: '/images/patients/patient-10.jpg',
      rating: 5,
      text: 'Very professional and respectful experience. Connected with a renowned specialist nearby without traveling 80km to the city hospital.',
      time: '1 month ago',
    },
    {
      id: 11,
      name: 'Pooja Deshmukh',
      location: 'Nagpur',
      specialty: 'ENT & Allergy',
      avatar: '/images/patients/patient-11.jpg',
      rating: 5,
      text: 'Suffered from severe sinus pain and throat infections. The prescribed allergy medication and inhaler routine worked wonders within 48 hours.',
      time: '1 month ago',
    },
    {
      id: 12,
      name: 'Karan Joshi',
      location: 'Chandigarh',
      specialty: 'Gastroenterology',
      avatar: '/images/patients/patient-12.jpg',
      rating: 5,
      text: 'Consulted for acid reflux and stomach cramps. The doctor gave practical lifestyle remedies along with mild medicine. Feeling completely restored!',
      time: '1 month ago',
    },
  ],
]

const AdSection = () => {
  const navigate = useNavigate()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  // Auto-sliding carousel every 4.5 seconds
  useEffect(() => {
    if (isPaused) return
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % allReviews.length)
    }, 4500)
    return () => clearInterval(interval)
  }, [isPaused])

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % allReviews.length)
  }

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + allReviews.length) % allReviews.length)
  }

  return (
    <section className="ad-section" id="advertisement-section">
      <div className="container">
        {/* Section Header */}
        <div className="ad-section__header">
          <div className="ad-section__tag">Patient Trust</div>
          <h2 className="section-title ad-section__title">
            Why Millions Trust <span className="text-gradient">MediCare</span>
          </h2>
          <p className="section-subtitle">
            Connecting patients with India's top verified specialists from the comfort of home
          </p>
        </div>

        {/* Patient Reviews Section with Auto-slide (3 reviews per slide, 4 slides total) */}
        <div
          className="reviews-slider"
          id="testimonials-section"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Header with "See All Reviews" Button */}
          <div className="reviews-slider__header">
            <div>
              <div className="reviews-slider__stars">
                ★★★★★ <span className="reviews-slider__rating-score">4.9/5</span>
                <span className="reviews-slider__rating-text">from 2M+ verified patient reviews</span>
              </div>
              <h3 className="reviews-slider__title">What Our Patients Say</h3>
            </div>

            <div className="reviews-slider__actions">
              {/* See All Reviews Option Button */}
              <button
                id="see-all-reviews-btn"
                className="reviews-slider__see-all-btn"
                onClick={() => navigate('/find-doctors')}
              >
                See All Reviews
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>

              {/* Slider Next / Prev Controls */}
              <div className="reviews-slider__nav-btns">
                <button
                  type="button"
                  id="reviews-prev-slide-btn"
                  className="reviews-slider__arrow"
                  onClick={prevSlide}
                  aria-label="Previous reviews slide"
                >
                  ‹
                </button>
                <button
                  type="button"
                  id="reviews-next-slide-btn"
                  className="reviews-slider__arrow"
                  onClick={nextSlide}
                  aria-label="Next reviews slide"
                >
                  ›
                </button>
              </div>
            </div>
          </div>

          {/* 3 Review Cards at a Time */}
          <div className="reviews-slider__deck">
            <div className="reviews-slider__grid" key={currentSlide}>
              {allReviews[currentSlide].map((review) => (
                <div
                  key={review.id}
                  id={`patient-review-${review.id}`}
                  className="review-card"
                >
                  <div className="review-card__header">
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="review-card__avatar"
                      loading="lazy"
                    />
                    <div className="review-card__info">
                      <div className="review-card__name-row">
                        <h4 className="review-card__name">{review.name}</h4>
                        <span className="review-card__verified" title="Verified Patient">✓ Verified</span>
                      </div>
                      <p className="review-card__sub">{review.location} · {review.specialty}</p>
                    </div>
                  </div>

                  <div className="review-card__stars">★★★★★</div>
                  <p className="review-card__text">"{review.text}"</p>
                  <div className="review-card__footer">
                    <span className="review-card__time">{review.time}</span>
                    <span className="review-card__tag">Online Consult</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Slide Indicator Dots (Total 4 Slides) */}
          <div className="reviews-slider__dots">
            {allReviews.map((_, i) => (
              <button
                key={i}
                id={`reviews-dot-${i + 1}`}
                className={`reviews-slider__dot ${i === currentSlide ? 'reviews-slider__dot--active' : ''}`}
                onClick={() => setCurrentSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
            <span className="reviews-slider__counter">
              Slide {currentSlide + 1} of {allReviews.length}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AdSection
