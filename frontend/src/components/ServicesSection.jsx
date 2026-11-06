import { useNavigate } from 'react-router-dom'
import './ServicesSection.css'

const services = [
  {
    id: 'service-video-consult',
    image: '/images/service-instant-video.jpg',
    title: 'Instant Video Consultation',
    subtitle: 'Connect within 60 secs',
    link: '/video-consult',
  },
  {
    id: 'service-find-doctors',
    image: '/images/service-find-doctors.jpg',
    title: 'Find Doctors Near You',
    subtitle: 'Confirmed appointments',
    link: '/doctors-near-you',
  },
  {
    id: 'service-lab-tests',
    image: '/images/service-lab-tests.jpg',
    title: 'Lab Tests',
    subtitle: 'Partner labs & report tracking',
    link: '/lab-tests',
  },
  {
    id: 'service-surgeries',
    image: '/images/service-surgeries.jpg',
    title: 'Surgeries',
    subtitle: 'Safe and trusted surgery centers',
    link: '/surgeries',
  },
]

const ServicesSection = () => {
  const navigate = useNavigate()

  return (
    <section className="services" id="services-section">
      <div className="container">
        <div className="services__grid">
          {services.map((service, index) => (
            <div
              key={service.id}
              id={service.id}
              className="service-card"
              style={{ animationDelay: `${index * 0.08}s` }}
              onClick={() => navigate(service.link)}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && navigate(service.link)}
            >
              <div className="service-card__image-wrap">
                <img
                  src={service.image}
                  alt={service.title}
                  className="service-card__image"
                  loading="lazy"
                />
              </div>

              <div className="service-card__content">
                <h3 className="service-card__title">{service.title}</h3>
                <p className="service-card__subtitle">{service.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ServicesSection
