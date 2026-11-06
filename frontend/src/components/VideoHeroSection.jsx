import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './VideoHeroSection.css'

// 100% Real Live-Action Medical Footage (Zero Animation, Ultra-Modern Facilities)
const scenes = [
  {
    id: 1,
    tag: 'WORLD-CLASS MODERN HOSPITAL',
    highlight: 'Modern Hospital Care',
    title: 'Multi-Specialty Facilities & Compassionate Care',
    sub: 'Experience state-of-the-art multi-specialty hospital infrastructure, welcoming patient admissions, advanced clinical care, and dedicated medical professionals.',
    videoSrc: '/videos/modern_hospital_reception.mp4',
    bgImage: '/images/doctor-hero-bg.jpg',
  },
  {
    id: 2,
    tag: 'STATE-OF-THE-ART HOSPITAL CAMPUS',
    highlight: 'Hospital Campus',
    title: 'Modern Medical Tower & Premier Facilities',
    sub: 'World-class hospital facilities designed for patient comfort, rapid emergency access, and comprehensive healing environments.',
    videoSrc: '/videos/modern_hospital_building.webm',
    bgImage: '/images/doctor-hero-bg.jpg',
  },
  {
    id: 3,
    tag: 'ADVANCED SURGICAL EXCELLENCE',
    highlight: 'Surgeries & OT',
    title: 'State-of-the-Art Sterile Operating Theaters',
    sub: 'Performed by senior surgical specialists in sterile, international-standard hospital suites with cutting-edge medical technology and zero-infection protocols.',
    videoSrc: '/videos/surgery_operation.webm',
    bgImage: '/images/doctor-hero-bg.jpg',
  },
  {
    id: 4,
    tag: 'AUTOMATED LAB & CLINIC DIAGNOSTICS',
    highlight: 'Hospital Lab Tests',
    title: 'Automated Clinical Pathology & Diagnostics',
    sub: 'High-precision automated pathology, molecular testing, and clinical diagnostics with rapid digital report turnaround and dedicated specialist follow-up.',
    videoSrc: '/videos/lab_diagnostics.webm',
    bgImage: '/images/doctor-hero-bg.jpg',
  },
  {
    id: 5,
    tag: 'DOCTOR-PATIENT CONSULTATION',
    highlight: 'Doctor Consultation',
    title: 'Consult Leading Medical Specialists',
    sub: 'Personalized medical evaluations and compassionate doctor consultations with premier physicians, pediatricians, cardiologists, and surgeons.',
    videoSrc: '/videos/modern_consultation_tablet.mp4',
    bgImage: '/images/doctor-consultation-bg.jpg',
  },
]

const ROTATION_INTERVAL = 8500 // 8.5 seconds per clip

const VideoHeroSection = () => {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0)

  // Dual-slot buffer for buttery-smooth 1.5s crossfade between videos
  const [slotAVideo, setSlotAVideo] = useState(scenes[0].videoSrc)
  const [slotBVideo, setSlotBVideo] = useState(scenes[1].videoSrc)
  const [activeSlot, setActiveSlot] = useState('A') // 'A' or 'B'

  const videoRefA = useRef(null)
  const videoRefB = useRef(null)
  const navigate = useNavigate()

  const scene = scenes[currentSceneIndex]

  // Initialize both video elements muted on mount
  useEffect(() => {
    if (videoRefA.current) {
      videoRefA.current.muted = true
      videoRefA.current.play().catch(() => {})
    }
    if (videoRefB.current) {
      videoRefB.current.muted = true
    }
  }, [])

  // Auto-rotate with seamless crossfade transition
  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (currentSceneIndex + 1) % scenes.length
      const nextVideoSrc = scenes[nextIndex].videoSrc
      const afterNextIndex = (nextIndex + 1) % scenes.length
      const afterNextVideoSrc = scenes[afterNextIndex].videoSrc

      if (activeSlot === 'A') {
        // Prepare slot B and fade it in
        if (videoRefB.current) {
          videoRefB.current.src = nextVideoSrc
          videoRefB.current.muted = true
          videoRefB.current.play().then(() => {
            setActiveSlot('B')
            setCurrentSceneIndex(nextIndex)
            // Preload the next video in slot A after fade completes
            setTimeout(() => {
              setSlotAVideo(afterNextVideoSrc)
            }, 1600)
          }).catch(() => {
            setActiveSlot('B')
            setCurrentSceneIndex(nextIndex)
          })
        }
      } else {
        // Prepare slot A and fade it in
        if (videoRefA.current) {
          videoRefA.current.src = nextVideoSrc
          videoRefA.current.muted = true
          videoRefA.current.play().then(() => {
            setActiveSlot('A')
            setCurrentSceneIndex(nextIndex)
            // Preload the next video in slot B after fade completes
            setTimeout(() => {
              setSlotBVideo(afterNextVideoSrc)
            }, 1600)
          }).catch(() => {
            setActiveSlot('A')
            setCurrentSceneIndex(nextIndex)
          })
        }
      }
    }, ROTATION_INTERVAL)

    return () => clearInterval(timer)
  }, [activeSlot, currentSceneIndex])

  return (
    <section className="video-hero" id="video-hero-intro">
      {/* Cinematic Media Wrapper with Dual-Buffer Seamless Crossfade */}
      <div className="video-hero__media-wrapper">
        {/* Video Buffer A */}
        <video
          ref={videoRefA}
          className={`video-hero__video ${activeSlot === 'A' ? 'video-hero__video--active' : 'video-hero__video--inactive'}`}
          src={slotAVideo}
          autoPlay
          loop
          muted
          playsInline
          poster="/images/doctor-hero-bg.jpg"
        />

        {/* Video Buffer B */}
        <video
          ref={videoRefB}
          className={`video-hero__video ${activeSlot === 'B' ? 'video-hero__video--active' : 'video-hero__video--inactive'}`}
          src={slotBVideo}
          autoPlay
          loop
          muted
          playsInline
          poster="/images/doctor-consultation-bg.jpg"
        />

        {/* Cinematic Backdrop Image Fallback */}
        <div
          className="video-hero__bg-fallback"
          style={{ backgroundImage: `url(${scene.bgImage})` }}
        />

        {/* Cinematic Vignette & Gradient Overlays for High Contrast Readability */}
        <div className="video-hero__overlay video-hero__overlay--vignette" />
        <div className="video-hero__overlay video-hero__overlay--gradient" />
      </div>

      {/* Main Overlay Content */}
      <div className="container video-hero__container">
        <div className="video-hero__content">
          {/* Mission Tagline Badge */}
          <div className="video-hero__tag-badge" key={`tag-${scene.id}`}>
            <span className="video-hero__sparkle">✨</span>
            <span>{scene.tag}</span>
          </div>

          {/* Premium Headline */}
          <h1 className="video-hero__headline" key={`head-${scene.id}`}>
            <span className="video-hero__highlight">{scene.highlight}</span>
            <br />
            {scene.title}
          </h1>

          {/* Descriptive Subtext */}
          <p className="video-hero__subtext" key={`sub-${scene.id}`}>
            {scene.sub}
          </p>

          {/* Modern Border Glow Action Button (Navigates directly to Find Doctor page) */}
          <div className="video-hero__action-wrap">
            <button
              type="button"
              className="video-hero__border-glow-btn"
              id="hero-search-doctors-btn"
              onClick={() => navigate('/find-doctors')}
              aria-label="Search Doctors"
            >
              <span className="video-hero__btn-icon-bubble">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </span>
              <span className="video-hero__btn-text">Search Doctors</span>
              <span className="video-hero__btn-arrow-wrap">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </span>
            </button>
          </div>

          {/* Popular Specialty Quick Pills */}
          <div className="video-hero__quick-tags">
            <span className="video-hero__quick-label">⚡ Popular:</span>
            {[
              { name: 'Cardiologist', icon: '❤️' },
              { name: 'Pediatrician', icon: '👶' },
              { name: 'Neurologist', icon: '🧠' },
              { name: 'Orthopedic', icon: '🦴' },
            ].map((item) => (
              <button
                key={item.name}
                type="button"
                className="video-hero__quick-tag"
                onClick={() => navigate(`/find-doctors?search=${encodeURIComponent(item.name)}`)}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default VideoHeroSection
