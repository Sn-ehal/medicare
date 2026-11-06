import { useState } from 'react'
import './NearbyHospitalsMap.css'

// 2 Primary options for in-app map
const PRIMARY_OPTIONS = [
  {
    id: 'hospital',
    label: 'Nearest Hospitals',
    icon: '🏥',
    searchTerm: 'hospital',
    description: 'All multi-specialty, government, and private hospitals near your location',
  },
  {
    id: 'clinic',
    label: 'Nearest Clinics',
    icon: '🩺',
    searchTerm: 'clinic',
    description: 'All general physician clinics, specialist polyclinics, and OPDs near your location',
  },
]

// Specialized doctor search options (directly opens Google Maps)
const SPECIALISTS = [
  { label: 'Dentist', icon: '🦷', query: 'dentist dental clinic' },
  { label: 'Dermatologist', icon: '🧴', query: 'dermatologist skin specialist' },
  { label: 'Cardiologist', icon: '❤️', query: 'cardiologist heart hospital' },
  { label: 'Pediatrician', icon: '👶', query: 'pediatrician child specialist' },
  { label: 'Eye Specialist', icon: '👁️', query: 'eye specialist ophthalmologist' },
  { label: 'Orthopedic', icon: '🦴', query: 'orthopedic doctor bone specialist' },
  { label: 'Gynecologist', icon: '🌸', query: 'gynecologist maternity clinic' },
  { label: 'ENT Specialist', icon: '👂', query: 'ent specialist ear nose throat' },
  { label: 'Neurologist', icon: '🧠', query: 'neurologist brain specialist' },
]

const POPULAR_CITIES = [
  'Kolkata',
  'Mumbai',
  'Delhi NCR',
  'Bengaluru',
  'Hyderabad',
  'Chennai',
  'Pune',
  'Ahmedabad',
  'Jaipur',
  'Lucknow',
]

const NearbyHospitalsMap = () => {
  const [areaInput, setAreaInput] = useState('Kolkata')
  const [pincodeInput, setPincodeInput] = useState('')
  const [searchedArea, setSearchedArea] = useState('Kolkata')
  const [searchedPincode, setSearchedPincode] = useState('')
  const [selectedOptionId, setSelectedOptionId] = useState('hospital')
  const [customSearchInput, setCustomSearchInput] = useState('')
  const [activeSpecialistQuery, setActiveSpecialistQuery] = useState('')
  const [mapLoaded, setMapLoaded] = useState(false)

  // Handle Location Search Form Submit
  const handleLocationSearch = (e) => {
    if (e) e.preventDefault()
    const cleanArea = areaInput.trim()
    const cleanPin = pincodeInput.trim()

    if (!cleanArea && !cleanPin) return

    setSearchedArea(cleanArea || 'Kolkata')
    setSearchedPincode(cleanPin)
    setActiveSpecialistQuery('')
    setMapLoaded(false)
  }

  // Quick City Selection
  const handleCitySelect = (city) => {
    setAreaInput(city)
    setPincodeInput('')
    setSearchedArea(city)
    setSearchedPincode('')
    setActiveSpecialistQuery('')
    setCustomSearchInput('')
    setMapLoaded(false)
  }

  const selectedPrimary = PRIMARY_OPTIONS.find(o => o.id === selectedOptionId) || PRIMARY_OPTIONS[0]
  const effectiveTerm = activeSpecialistQuery || selectedPrimary.searchTerm

  const locationString = [searchedArea, searchedPincode].filter(Boolean).join(' ') || 'Kolkata'
  const queryWithCity = `${effectiveTerm} in ${locationString}`
  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(queryWithCity)}&z=14&output=embed`
  const directMapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(queryWithCity)}`

  // Switch between the 2 main in-app options: Hospitals or Clinics
  const handlePrimaryOptionSelect = (optionId) => {
    setSelectedOptionId(optionId)
    setActiveSpecialistQuery('')
    setCustomSearchInput('')
    setMapLoaded(false)
  }

  // Handle Specialized Search (Directly opens Google Maps in a new tab)
  const handleDirectGoogleMapsSearch = (specialistSearchTerm) => {
    const term = specialistSearchTerm.trim()
    if (!term) return

    const targetUrl = `https://www.google.com/maps/search/${encodeURIComponent(`${term} in ${locationString}`)}`
    window.open(targetUrl, '_blank')
    setActiveSpecialistQuery(term)
    setMapLoaded(false)
  }

  const handleCustomSearchSubmit = (e) => {
    e.preventDefault()
    if (!customSearchInput.trim()) return
    handleDirectGoogleMapsSearch(customSearchInput)
  }

  return (
    <section className="nearby-map-finder" id="nearby-map-section">
      {/* Header */}
      <div className="nearby-map-finder__header">
        <div className="nearby-map-finder__pill">
          <span className="nearby-map-finder__pulse" />
          📍 Live Hospital & Clinic Locator
        </div>

        <h2 className="nearby-map-finder__title">
          Find Nearest <span className="nearby-map-finder__highlight">Hospitals & Clinics</span>
        </h2>
        <p className="nearby-map-finder__subtitle">
          Enter your area name and pincode below to explore nearest hospitals and clinics on live Google Maps, or search specific specialists.
        </p>

        {/* Area Name & Pincode Search Bar */}
        <form className="nearby-map-finder__location-form" onSubmit={handleLocationSearch}>
          <div className="nearby-map-finder__location-inputs">
            <div className="nearby-map-finder__field nearby-map-finder__field--area">
              <label htmlFor="nearby-area-input" className="nearby-map-finder__field-label">
                📍 Area / Locality / City
              </label>
              <input
                id="nearby-area-input"
                type="text"
                className="nearby-map-finder__text-input"
                placeholder="e.g. Salt Lake, Bandra West, Indiranagar, Kolkata"
                value={areaInput}
                onChange={(e) => setAreaInput(e.target.value)}
              />
            </div>

            <div className="nearby-map-finder__field nearby-map-finder__field--pincode">
              <label htmlFor="nearby-pincode-input" className="nearby-map-finder__field-label">
                📮 6-Digit Pincode
              </label>
              <input
                id="nearby-pincode-input"
                type="text"
                className="nearby-map-finder__text-input"
                placeholder="e.g. 700091"
                maxLength={6}
                value={pincodeInput}
                onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, ''))}
              />
            </div>

            <button
              type="submit"
              id="nearby-search-location-btn"
              className="nearby-map-finder__set-btn"
              title="Search medical facilities in this area or pincode"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <span>Search Area</span>
            </button>
          </div>
        </form>

        {/* Quick City Selector */}
        <div className="nearby-map-finder__quick-cities">
          <span className="nearby-map-finder__quick-label">Popular Cities:</span>
          <div className="nearby-map-finder__city-pills">
            {POPULAR_CITIES.map((city) => (
              <button
                key={city}
                type="button"
                id={`city-pill-${city.toLowerCase().replace(/\s+/g, '-')}`}
                className={`nearby-map-finder__city-pill ${searchedArea.toLowerCase() === city.toLowerCase() && !searchedPincode ? 'nearby-map-finder__city-pill--active' : ''}`}
                onClick={() => handleCitySelect(city)}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Location Status & Control Bar */}
        <div className="nearby-map-finder__control-bar">
          <div className="nearby-map-finder__loc-status">
            <div className="nearby-map-finder__loc-icon nearby-map-finder__loc-icon--active">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div className="nearby-map-finder__loc-text-group">
              <span className="nearby-map-finder__loc-label">Active Search Location</span>
              <span className="nearby-map-finder__loc-val">
                📍 {searchedArea || 'Kolkata'}{searchedPincode ? ` (Pincode: ${searchedPincode})` : ''}
              </span>
            </div>
          </div>

          <div className="nearby-map-finder__action-buttons">
            <a
              id="open-in-google-maps-btn"
              href={directMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="nearby-map-finder__external-btn"
              title="Open full Google Maps app with turn-by-turn navigation"
            >
              <span>Open in Google Maps App</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 1: THE 2 PRIMARY IN-APP OPTIONS (HOSPITALS OR CLINICS)
          ========================================================================= */}
      <div className="nearby-map-finder__two-options-section">
        <div className="nearby-map-finder__section-header">
          <span className="nearby-map-finder__section-step">Step 1</span>
          <span className="nearby-map-finder__section-title">Select Medical Facility Type</span>
        </div>

        <div className="nearby-map-finder__two-options" role="tablist">
          {PRIMARY_OPTIONS.map(opt => {
            const isSelected = selectedOptionId === opt.id && !activeSpecialistQuery
            return (
              <button
                key={opt.id}
                id={`btn-primary-${opt.id}`}
                type="button"
                role="tab"
                aria-selected={isSelected}
                className={`nearby-map-finder__main-option-btn ${isSelected ? 'nearby-map-finder__main-option-btn--active' : ''}`}
                onClick={() => handlePrimaryOptionSelect(opt.id)}
              >
                <span className="nearby-map-finder__main-option-icon">{opt.icon}</span>
                <div className="nearby-map-finder__main-option-text">
                  <span className="nearby-map-finder__main-option-title">{opt.label}</span>
                  <span className="nearby-map-finder__main-option-sub">{opt.description}</span>
                </div>
                {isSelected && (
                  <span className="nearby-map-finder__active-check">✓ Active on Map</span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* =========================================================================
          SECTION 2: SPECIALIZED SEARCH (DIRECT GOOGLE MAPS)
          ========================================================================= */}
      <div className="nearby-map-finder__specialist-box">
        <div className="nearby-map-finder__specialist-header">
          <div className="nearby-map-finder__specialist-title-wrap">
            <span className="nearby-map-finder__specialist-badge">⚡ Specialized Search</span>
            <h3 className="nearby-map-finder__specialist-title">
              Looking for a Specific Specialist? (Direct on Google Maps)
            </h3>
            <p className="nearby-map-finder__specialist-desc">
              Click any specialist below or type a specialty (e.g. <em>Dermatologist, Dentist</em>) to directly open Google Maps with all matching doctors around you.
            </p>
          </div>
        </div>

        {/* Quick Specialist Chips */}
        <div className="nearby-map-finder__specialist-chips">
          {SPECIALISTS.map(spec => {
            const isSpecActive = activeSpecialistQuery === spec.query
            return (
              <button
                key={spec.label}
                id={`spec-chip-${spec.label.toLowerCase().replace(/\s+/g, '-')}`}
                type="button"
                className={`nearby-map-finder__spec-chip ${isSpecActive ? 'nearby-map-finder__spec-chip--active' : ''}`}
                onClick={() => handleDirectGoogleMapsSearch(spec.query)}
                title={`Search ${spec.label} directly on Google Maps`}
              >
                <span className="nearby-map-finder__spec-icon">{spec.icon}</span>
                <span className="nearby-map-finder__spec-label">{spec.label}</span>
                <span className="nearby-map-finder__spec-arrow">↗</span>
              </button>
            )
          })}
        </div>

        {/* Custom Specialist Search Bar (Direct Google Maps) */}
        <form className="nearby-map-finder__specialist-search-form" onSubmit={handleCustomSearchSubmit}>
          <div className="nearby-map-finder__input-wrap">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              id="specialist-custom-input"
              type="text"
              placeholder="Search dermatologist, dentist, eye clinic, or any specialist..."
              value={customSearchInput}
              onChange={(e) => setCustomSearchInput(e.target.value)}
            />
            {customSearchInput && (
              <button
                type="button"
                className="nearby-map-finder__clear-search"
                onClick={() => setCustomSearchInput('')}
                title="Clear"
              >
                ✕
              </button>
            )}
          </div>
          <button
            type="submit"
            className="nearby-map-finder__specialist-submit-btn"
            id="specialist-search-submit"
          >
            <span>Search on Google Maps</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </button>
        </form>
      </div>

      {/* Live Map Meta Bar */}
      <div className="nearby-map-finder__meta-bar">
        <div className="nearby-map-finder__meta-left">
          <span className="nearby-map-finder__meta-live-dot" />
          <span className="nearby-map-finder__meta-tag">Showing on Google Map:</span>
          <span className="nearby-map-finder__meta-query">
            {activeSpecialistQuery
              ? `Specialist: "${activeSpecialistQuery}"`
              : selectedPrimary.label}
          </span>
          <span className="nearby-map-finder__meta-desc">
            • in {locationString}
          </span>
        </div>

        <div className="nearby-map-finder__meta-right">
          <a
            href={directMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="nearby-map-finder__direct-gmaps-link"
          >
            <span>Open in Full Google Maps App ↗</span>
          </a>
        </div>
      </div>

      {/* Embedded Google Map Frame */}
      <div className="nearby-map-finder__map-container" id="google-maps-frame-wrapper">
        {!mapLoaded && (
          <div className="nearby-map-finder__map-loader">
            <div className="nearby-map-finder__radar-spin" />
            <p>Loading {activeSpecialistQuery || selectedPrimary.label} on Google Maps...</p>
          </div>
        )}
        <iframe
          key={embedUrl}
          id="google-maps-iframe"
          title={`Google Maps ${activeSpecialistQuery || selectedPrimary.label}`}
          src={embedUrl}
          className="nearby-map-finder__iframe"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={() => setMapLoaded(true)}
        />
      </div>

      {/* Emergency Quick Assist Cards */}
      <div className="nearby-map-finder__quick-cards">
        <div className="nearby-quick-card nearby-quick-card--emergency">
          <div className="nearby-quick-card__icon">🚨</div>
          <div className="nearby-quick-card__body">
            <h4>Immediate Medical Emergency?</h4>
            <p>Call national emergency services for urgent ambulance dispatch.</p>
          </div>
          <a href="tel:108" className="nearby-quick-card__btn nearby-quick-card__btn--red">
            Dial 108 / 112
          </a>
        </div>

        <div className="nearby-quick-card nearby-quick-card--directions">
          <div className="nearby-quick-card__icon">🧭</div>
          <div className="nearby-quick-card__body">
            <h4>Turn-by-Turn GPS Directions</h4>
            <p>Get real-time traffic route to nearest healthcare center on Google Maps.</p>
          </div>
          <a
            href={directMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="nearby-quick-card__btn nearby-quick-card__btn--blue"
          >
            Start Route ↗
          </a>
        </div>
      </div>
    </section>
  )
}

export default NearbyHospitalsMap
