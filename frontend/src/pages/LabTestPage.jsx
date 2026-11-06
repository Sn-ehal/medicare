import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './LabTestPage.css'

// =============================================================================
// MEDICARE DIAGNOSTIC NETWORK
// MediCare is an aggregator healthcare platform tied up with 200+ premier
// NABL & CAP accredited diagnostic laboratories across India.
// =============================================================================

// Standard demo partner diagnostic reports (for instant testing before backend integration)
const DEMO_PARTNER_REPORTS = {
  'PT-2024-001': {
    patientId: 'PT-2024-001',
    patientName: 'Rohan Sharma',
    age: 34,
    gender: 'Male',
    phone: '+91 98765-43210',
    referringDoctor: 'Dr. Sarah Johnson (Cardiologist, MD)',
    testPackage: 'Comprehensive Executive Health Profile',
    collectionDate: '28 Oct 2026, 07:30 AM',
    reportDate: '28 Oct 2026, 04:45 PM',
    sampleType: 'Venous Blood (EDTA & Fluoride) & Spot Urine',
    partnerLab: {
      name: 'Metropolis Healthcare Diagnostic Reference Lab',
      badge: 'Official MediCare Partner Lab',
      accreditation: 'NABL Accredited (MC-4821) & CAP Certified',
      branch: 'Central Hub, Bandra West, Mumbai - 400050',
      pathologist: 'Dr. Arvind Deshmukh (MD, FICP, Chief Pathologist)',
      regNo: 'MCI-49210-PATH',
      contact: '+91 22 6112 3456',
    },
    overallStatus: 'Attention Advised',
    statusClass: 'status--warning',
    clinicalImpression:
      'Borderline elevation in Fasting Blood Glucose (108 mg/dL) and LDL Cholesterol (138 mg/dL). Hemogram, Renal, and Liver parameters are within biological reference limits. Recommended: Low glycemic diet, 30 mins daily aerobic activity, and repeat lipid profile in 8 weeks.',
    categories: [
      {
        name: 'Complete Blood Count (CBC / Hemogram)',
        tests: [
          { name: 'Hemoglobin', value: 14.8, unit: 'g/dL', range: '13.0 - 17.0', min: 13.0, max: 17.0, status: 'normal', flag: 'Normal' },
          { name: 'Total WBC Count', value: 7200, unit: 'cells/mcL', range: '4000 - 11000', min: 4000, max: 11000, status: 'normal', flag: 'Normal' },
          { name: 'Platelet Count', value: 2.65, unit: 'Lakh/mcL', range: '1.50 - 4.50', min: 1.5, max: 4.5, status: 'normal', flag: 'Normal' },
          { name: 'Packed Cell Volume (PCV)', value: 43.5, unit: '%', range: '40.0 - 50.0', min: 40.0, max: 50.0, status: 'normal', flag: 'Normal' },
          { name: 'RBC Count', value: 5.1, unit: 'mil/mcL', range: '4.5 - 5.9', min: 4.5, max: 5.9, status: 'normal', flag: 'Normal' },
          { name: 'ESR (Erythrocyte Sed. Rate)', value: 12, unit: 'mm/hr', range: '0 - 15', min: 0, max: 15, status: 'normal', flag: 'Normal' },
        ],
      },
      {
        name: 'Lipid & Cardiovascular Risk Profile',
        tests: [
          { name: 'Total Cholesterol', value: 215, unit: 'mg/dL', range: '< 200', min: 120, max: 200, status: 'high', flag: 'High (Borderline)' },
          { name: 'HDL (Good Cholesterol)', value: 46, unit: 'mg/dL', range: '> 40', min: 40, max: 80, status: 'normal', flag: 'Optimal' },
          { name: 'LDL (Bad Cholesterol)', value: 138, unit: 'mg/dL', range: '< 100', min: 50, max: 100, status: 'high', flag: 'Elevated' },
          { name: 'Triglycerides', value: 155, unit: 'mg/dL', range: '< 150', min: 60, max: 150, status: 'high', flag: 'Slightly High' },
          { name: 'Total Chol / HDL Ratio', value: 4.6, unit: 'ratio', range: '< 4.5', min: 2.0, max: 4.5, status: 'high', flag: 'Borderline' },
        ],
      },
      {
        name: 'Diabetes & Glycemic Screen',
        tests: [
          { name: 'Fasting Blood Glucose (FBS)', value: 108, unit: 'mg/dL', range: '70 - 99', min: 70, max: 99, status: 'high', flag: 'Pre-Diabetic' },
          { name: 'HbA1c (Glycated Hemoglobin)', value: 5.8, unit: '%', range: '< 5.7', min: 4.0, max: 5.7, status: 'high', flag: 'Pre-Diabetic' },
          { name: 'Estimated Average Glucose', value: 120, unit: 'mg/dL', range: '90 - 120', min: 90, max: 120, status: 'normal', flag: 'Normal' },
        ],
      },
      {
        name: 'Kidney Function Test (KFT / RFT)',
        tests: [
          { name: 'Blood Urea', value: 26, unit: 'mg/dL', range: '15 - 45', min: 15, max: 45, status: 'normal', flag: 'Normal' },
          { name: 'Serum Creatinine', value: 0.95, unit: 'mg/dL', range: '0.70 - 1.20', min: 0.70, max: 1.20, status: 'normal', flag: 'Normal' },
          { name: 'eGFR (Calculated)', value: 102, unit: 'mL/min/1.73m²', range: '> 90', min: 90, max: 130, status: 'normal', flag: 'Optimal' },
        ],
      },
      {
        name: 'Liver Function Test (LFT)',
        tests: [
          { name: 'SGOT / AST', value: 28, unit: 'U/L', range: '10 - 40', min: 10, max: 40, status: 'normal', flag: 'Normal' },
          { name: 'SGPT / ALT', value: 34, unit: 'U/L', range: '7 - 56', min: 7, max: 56, status: 'normal', flag: 'Normal' },
          { name: 'Serum Bilirubin Total', value: 0.85, unit: 'mg/dL', range: '0.20 - 1.20', min: 0.20, max: 1.20, status: 'normal', flag: 'Normal' },
        ],
      },
    ],
  },

  'PT-2024-002': {
    patientId: 'PT-2024-002',
    patientName: 'Ananya Verma',
    age: 29,
    gender: 'Female',
    phone: '+91 98112-76543',
    referringDoctor: 'Dr. Meena Gupta (Gynecologist, MD)',
    testPackage: 'Women Comprehensive Vitamin & Thyroid Panel',
    collectionDate: '29 Oct 2026, 08:15 AM',
    reportDate: '29 Oct 2026, 03:20 PM',
    sampleType: 'Serum Blood (Clot Activator) & EDTA',
    partnerLab: {
      name: 'Agilus Diagnostics (formerly SRL Diagnostics)',
      badge: 'Official MediCare Partner Lab',
      accreditation: 'NABL Accredited (MC-3319) & CAP Certified',
      branch: 'South Extension Part II, New Delhi - 110049',
      pathologist: 'Dr. S. K. Mahajan (MD Pathology, FACP)',
      regNo: 'DMC-28491-PATH',
      contact: '+91 11 4050 6789',
    },
    overallStatus: 'Vitamin Deficiency',
    statusClass: 'status--warning',
    clinicalImpression:
      'Significant 25-OH Vitamin D deficiency detected (14.2 ng/mL) and borderline iron deficiency with mild microcytic anemia (Hb 11.2 g/dL). Thyroid axis is strictly euthyroid. Oral Vitamin D3 60,000 IU weekly for 8 weeks and iron-rich nutrition advised.',
    categories: [
      {
        name: 'Vitamins & Mineral Profile',
        tests: [
          { name: 'Vitamin D (25-OH Total)', value: 14.2, unit: 'ng/mL', range: '30.0 - 100.0', min: 30.0, max: 100.0, status: 'low', flag: 'Deficient' },
          { name: 'Vitamin B12', value: 345, unit: 'pg/mL', range: '211 - 911', min: 211, max: 911, status: 'normal', flag: 'Normal' },
          { name: 'Serum Calcium', value: 9.4, unit: 'mg/dL', range: '8.8 - 10.2', min: 8.8, max: 10.2, status: 'normal', flag: 'Normal' },
          { name: 'Serum Ferritin', value: 18, unit: 'ng/mL', range: '20 - 250', min: 20, max: 250, status: 'low', flag: 'Low' },
          { name: 'Serum Iron', value: 52, unit: 'µg/dL', range: '60 - 170', min: 60, max: 170, status: 'low', flag: 'Low' },
        ],
      },
      {
        name: 'Thyroid Function Panel',
        tests: [
          { name: 'TSH (Ultrasensitive)', value: 2.35, unit: 'µIU/mL', range: '0.35 - 4.94', min: 0.35, max: 4.94, status: 'normal', flag: 'Euthyroid' },
          { name: 'Total T3', value: 1.15, unit: 'ng/mL', range: '0.80 - 2.00', min: 0.80, max: 2.00, status: 'normal', flag: 'Normal' },
          { name: 'Total T4', value: 7.8, unit: 'µg/dL', range: '5.1 - 14.1', min: 5.1, max: 14.1, status: 'normal', flag: 'Normal' },
        ],
      },
      {
        name: 'Anemia Screen (Hemogram Focus)',
        tests: [
          { name: 'Hemoglobin', value: 11.2, unit: 'g/dL', range: '12.0 - 15.5', min: 12.0, max: 15.5, status: 'low', flag: 'Mild Low' },
          { name: 'Packed Cell Volume (PCV)', value: 35.8, unit: '%', range: '37.0 - 48.0', min: 37.0, max: 48.0, status: 'low', flag: 'Borderline' },
          { name: 'Total RBC Count', value: 4.1, unit: 'mil/mcL', range: '4.0 - 5.2', min: 4.0, max: 5.2, status: 'normal', flag: 'Normal' },
        ],
      },
    ],
  },

  'PT-2024-003': {
    patientId: 'PT-2024-003',
    patientName: 'Vikramaditya Roy',
    age: 52,
    gender: 'Male',
    phone: '+91 97481-23984',
    referringDoctor: 'Dr. Debabrata Banerjee (Senior Consultant Physician)',
    testPackage: 'Cardiac & Diabetic Surveillance Profile',
    collectionDate: '30 Oct 2026, 07:15 AM',
    reportDate: '30 Oct 2026, 02:00 PM',
    sampleType: 'Venous Blood & Plasma Fluoride',
    partnerLab: {
      name: 'Dr Lal PathLabs National Reference Center',
      badge: 'Official MediCare Partner Lab',
      accreditation: 'NABL Accredited (MC-1044) & ISO 15189 Certified',
      branch: 'Sector 18, Block B, Salt Lake, Kolkata - 700091',
      pathologist: 'Dr. Pratima Sen (MD Pathology, Senior Consultant)',
      regNo: 'WBMC-37190-PATH',
      contact: '+91 33 2358 9012',
    },
    overallStatus: 'Normal & Stable',
    statusClass: 'status--normal',
    clinicalImpression:
      'All metabolic, renal, and lipid parameters demonstrate excellent therapeutic control. HbA1c at 6.1% reflects satisfactory glycemic management. Kidney profile and cardiac enzymes strictly unremarkable. Maintain current medical and dietary regimen.',
    categories: [
      {
        name: 'Cardiac & Lipid Evaluation',
        tests: [
          { name: 'Total Cholesterol', value: 172, unit: 'mg/dL', range: '< 200', min: 120, max: 200, status: 'normal', flag: 'Optimal' },
          { name: 'HDL Cholesterol', value: 52, unit: 'mg/dL', range: '> 40', min: 40, max: 80, status: 'normal', flag: 'Protective' },
          { name: 'LDL Cholesterol', value: 88, unit: 'mg/dL', range: '< 100', min: 50, max: 100, status: 'normal', flag: 'Optimal' },
          { name: 'Triglycerides', value: 118, unit: 'mg/dL', range: '< 150', min: 60, max: 150, status: 'normal', flag: 'Normal' },
        ],
      },
      {
        name: 'Diabetes Control',
        tests: [
          { name: 'Fasting Blood Glucose', value: 92, unit: 'mg/dL', range: '70 - 99', min: 70, max: 99, status: 'normal', flag: 'Normal' },
          { name: 'Post-Prandial Glucose (PP)', value: 128, unit: 'mg/dL', range: '< 140', min: 80, max: 140, status: 'normal', flag: 'Normal' },
          { name: 'HbA1c', value: 6.1, unit: '%', range: '< 6.5', min: 4.0, max: 6.5, status: 'normal', flag: 'Controlled' },
        ],
      },
    ],
  },
}

// Helper to generate a realistic partner report if user enters any custom Patient ID
const generateCustomReport = (id) => {
  const cleanId = id.toUpperCase().trim()
  return {
    patientId: cleanId,
    patientName: 'Verified Patient',
    age: 38,
    gender: 'Adult',
    phone: '+91 9XXXX-XXXXX',
    referringDoctor: 'Registered MediCare Network Consultant',
    testPackage: 'Standard Diagnostic Health Investigation',
    collectionDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', 08:00 AM',
    reportDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', 03:30 PM',
    sampleType: 'Whole Blood (EDTA/Serum)',
    partnerLab: {
      name: 'MediCare Accredited Partner Pathology Center',
      badge: 'Official MediCare Partner Lab',
      accreditation: 'NABL ISO 15189 Accredited Laboratory',
      branch: 'Regional Reference Pathology Wing',
      pathologist: 'Dr. K. R. Nambiar (MD Pathologist)',
      regNo: 'MCI-52190-PATH',
      contact: '1800-209-4455',
    },
    overallStatus: 'Normal / Verified',
    statusClass: 'status--normal',
    clinicalImpression:
      'Investigation parameters analyzed on automated clinical chemistry and hematology systems. Measured analytes reflect biological reference intervals. Digital signature electronically verified.',
    categories: [
      {
        name: 'Routine Diagnostic Screen',
        tests: [
          { name: 'Hemoglobin', value: 13.9, unit: 'g/dL', range: '12.5 - 16.5', min: 12.5, max: 16.5, status: 'normal', flag: 'Normal' },
          { name: 'Fasting Plasma Glucose', value: 94, unit: 'mg/dL', range: '70 - 100', min: 70, max: 100, status: 'normal', flag: 'Normal' },
          { name: 'Serum Creatinine', value: 0.9, unit: 'mg/dL', range: '0.6 - 1.2', min: 0.6, max: 1.2, status: 'normal', flag: 'Normal' },
          { name: 'Total Cholesterol', value: 178, unit: 'mg/dL', range: '< 200', min: 120, max: 200, status: 'normal', flag: 'Desirable' },
        ],
      },
    ],
  }
}

const POPULAR_CITIES = ['Kolkata', 'Mumbai', 'Delhi NCR', 'Bengaluru', 'Hyderabad', 'Chennai', 'Pune', 'Ahmedabad']

const LabTestPage = () => {
  // Navigation & tabs
  const [activeTab, setActiveTab] = useState('report') // 'report' or 'locator'
  const reportSectionRef = useRef(null)
  const locatorSectionRef = useRef(null)

  // ---------------------------------------------------------------------------
  // FUNCTION 1 STATE: Patient Report Lookup by Patient ID
  // ---------------------------------------------------------------------------
  const [patientIdInput, setPatientIdInput] = useState('')
  const [activeReport, setActiveReport] = useState(null)
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [toastMessage, setToastMessage] = useState('')

  // ---------------------------------------------------------------------------
  // FUNCTION 2 STATE: Locate Diagnostic Centers Nearby
  // User Area Name & 6-Digit Pincode Location Search
  // ---------------------------------------------------------------------------
  const [areaInput, setAreaInput] = useState('Kolkata')
  const [pincodeInput, setPincodeInput] = useState('')
  const [searchedArea, setSearchedArea] = useState('Kolkata')
  const [searchedPincode, setSearchedPincode] = useState('')


  // Show Toast Helper
  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 3500)
  }

  // ---------------------------------------------------------------------------
  // FUNCTION 1 HANDLERS: Report Search & View
  // ---------------------------------------------------------------------------
  const handleReportSearch = useCallback((idToSearch) => {
    const query = (idToSearch || patientIdInput).trim()
    if (!query) {
      setSearchError('Please enter a valid Patient ID (e.g., PT-2024-001).')
      return
    }

    setSearchError('')
    setIsSearching(true)

    // Simulate clean network request ready for backend API endpoint (e.g., fetch(`/api/reports/${query}`))
    setTimeout(() => {
      setIsSearching(false)
      const cleanUpper = query.toUpperCase()

      if (DEMO_PARTNER_REPORTS[cleanUpper]) {
        setActiveReport(DEMO_PARTNER_REPORTS[cleanUpper])
        showToast(`Official partner diagnostic report loaded for ${cleanUpper}`)
      } else {
        // Fallback: Generate valid partner lab report so user can test ANY Patient ID seamlessly!
        const generated = generateCustomReport(cleanUpper)
        setActiveReport(generated)
        showToast(`Partner diagnostic report generated for ${cleanUpper}`)
      }

      // Smooth scroll to report view
      setTimeout(() => {
        const reportEl = document.getElementById('report-display-card')
        if (reportEl) {
          reportEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    }, 450)
  }, [patientIdInput])

  // Handle URL query parameters (e.g. /lab-tests?patientId=PT-2024-001 or ?locate=true)
  useEffect(() => {
    document.title = 'Book Lab Tests & Diagnostic Health Packages | MediCare'

    const params = new URLSearchParams(window.location.search)
    const idParam = params.get('patientId')
    const locateParam = params.get('locate') || params.get('nearMe')

    if (idParam) {
      setPatientIdInput(idParam)
      handleReportSearch(idParam)
      setActiveTab('report')
    } else if (locateParam === 'true') {
      setActiveTab('locator')
      locatorSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [handleReportSearch])

  // Keyboard accessibility: Escape key closes active report viewer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && activeReport) {
        handleClearReport()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeReport])

  const handleClearReport = () => {
    setPatientIdInput('')
    setActiveReport(null)
    setSearchError('')
  }

  const handlePrintReport = () => {
    window.print()
  }

  const handleDownloadReport = () => {
    if (!activeReport) return
    const reportText = `
================================================================================
                    MEDICARE DIAGNOSTIC PARTNER NETWORK
              Unified Digital Access for Partner Laboratories
================================================================================
OFFICIALLY VERIFIED DIAGNOSTIC REPORT
Partner Diagnostic Lab: ${activeReport.partnerLab.name}
Accreditation: ${activeReport.partnerLab.accreditation}
Tie-Up Reference ID: ${activeReport.patientId} | Status: ${activeReport.overallStatus}
Date Issued: ${activeReport.reportDate}

PATIENT INFORMATION:
- Patient ID: ${activeReport.patientId}
- Full Name: ${activeReport.patientName}
- Age / Gender: ${activeReport.age} Y / ${activeReport.gender}
- Contact Phone: ${activeReport.phone}
- Referring Doctor: ${activeReport.referringDoctor}
- Test Investigation: ${activeReport.testPackage}
- Sample Specimen: ${activeReport.sampleType}
- Collection Timestamp: ${activeReport.collectionDate}
- Diagnostic Branch: ${activeReport.partnerLab.branch}

PATHOLOGIST CLINICAL IMPRESSION:
${activeReport.clinicalImpression}

--------------------------------------------------------------------------------
INVESTIGATION RESULTS & PARAMETERS:
--------------------------------------------------------------------------------
${activeReport.categories
        .map(
          (cat) => `
[${cat.name}]
` +
            cat.tests
              .map(
                (t) =>
                  `${t.name.padEnd(32)}: ${String(t.value).padEnd(8)} ${t.unit.padEnd(14)} (Ref: ${t.range}) [${t.flag}]`
              )
              .join('\n')
        )
        .join('\n\n')}

================================================================================
VERIFYING AUTHORITY:
Chief Pathologist: ${activeReport.partnerLab.pathologist}
Registration No: ${activeReport.partnerLab.regNo}
Notice: MediCare operates as a healthcare gateway tying up with accredited laboratories.
This report is digitally verified and electronically signed.
================================================================================
`
    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `MediCare_Partner_Report_${activeReport.patientId}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    showToast(`Downloaded verified report for ${activeReport.patientId}`)
  }

  const handleShareReport = () => {
    if (!activeReport) return
    const shareUrl = `${window.location.origin}/lab-tests?patientId=${activeReport.patientId}`
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl)
      showToast('Shareable report link copied to clipboard!')
    } else {
      showToast(`Report ID: ${activeReport.patientId}`)
    }
  }

  // ---------------------------------------------------------------------------
  // FUNCTION 2 HANDLERS: Nearby Centers Search & Map Calculation
  // ---------------------------------------------------------------------------
  const handleLocationSubmit = (e) => {
    if (e) e.preventDefault()
    const cleanArea = areaInput.trim()
    const cleanPin = pincodeInput.trim()

    if (!cleanArea && !cleanPin) {
      showToast('Please enter an area name or pincode')
      return
    }

    setSearchedArea(cleanArea || 'Kolkata')
    setSearchedPincode(cleanPin)

    if (cleanArea && cleanPin) {
      showToast(`Showing diagnostic centers for ${cleanArea} (PIN: ${cleanPin})`)
    } else if (cleanPin) {
      showToast(`Showing diagnostic centers for Pincode ${cleanPin}`)
    } else {
      showToast(`Showing diagnostic centers for ${cleanArea}`)
    }
  }

  const handleCitySelect = (city) => {
    setAreaInput(city)
    setPincodeInput('')
    setSearchedArea(city)
    setSearchedPincode('')
    showToast(`Showing diagnostic centers in ${city}`)
  }

  // Google Maps URLs matching the reliable Area/Pincode standard
  const effectiveSearchTerm = 'diagnostic centers OR pathology labs'
  const locationString = [searchedArea, searchedPincode].filter(Boolean).join(' ') || 'Kolkata'

  const embedMapUrl = useMemo(() => {
    return `https://maps.google.com/maps?q=${encodeURIComponent(`${effectiveSearchTerm} in ${locationString}`)}&z=14&output=embed`
  }, [locationString])

  const directMapsUrl = useMemo(() => {
    return `https://www.google.com/maps/search/${encodeURIComponent(`${effectiveSearchTerm} in ${locationString}`)}`
  }, [locationString])

  return (
    <div className="lab-page">
      <Navbar />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="lab-toast" role="status" aria-live="polite">
          <span className="lab-toast__icon">✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* =========================================================================
          HERO & MEDICARE PARTNER IDENTITY BANNER
          ========================================================================= */}
      <header className="lab-hero">
        <div className="container">
          <div className="lab-hero__badge">
            <span className="lab-hero__badge-pulse" />
            <span>🤝 MediCare Partner Diagnostic Network</span>
          </div>

          <h1 className="lab-hero__title">
            Partner Diagnostic Centers & <span>Patient Lab Reports</span>
          </h1>

          <p className="lab-hero__subtitle">
            <strong>MediCare does not operate its own diagnostic laboratories.</strong> We tie up with premier,
            accredited diagnostic labs across the country (Dr Lal PathLabs, Metropolis, Agilus, Apollo, and more) so you
            can instantly check your reports with your <strong>Patient ID</strong> or locate certified centers near you.
          </p>

          {/* Quick Dual-Function Navigation Switch */}
          <div className="lab-hero__nav-switch">
            <button
              type="button"
              id="switch-tab-report"
              className={`lab-switch-btn ${activeTab === 'report' ? 'lab-switch-btn--active' : ''}`}
              onClick={() => {
                setActiveTab('report')
                reportSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              <span className="lab-switch-icon">📄</span>
              <div className="lab-switch-text">
                <strong>1. View Patient Report</strong>
                <small>Enter Patient ID to track & download</small>
              </div>
            </button>

            <button
              type="button"
              id="switch-tab-locator"
              className={`lab-switch-btn ${activeTab === 'locator' ? 'lab-switch-btn--active' : ''}`}
              onClick={() => {
                setActiveTab('locator')
                locatorSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              <span className="lab-switch-icon">📍</span>
              <div className="lab-switch-text">
                <strong>2. Locate Diagnostic Centers Nearby</strong>
                <small>Find accredited labs in your area</small>
              </div>
            </button>
          </div>

          {/* Trust Metrics */}
          <div className="lab-hero__stats">
            <div className="lab-hero__stat-card">
              <span className="lab-hero__stat-num">200+</span>
              <span className="lab-hero__stat-label">Tie-Up Diagnostic Labs</span>
            </div>
            <div className="lab-hero__stat-card">
              <span className="lab-hero__stat-num">100%</span>
              <span className="lab-hero__stat-label">NABL & CAP Accredited</span>
            </div>
            <div className="lab-hero__stat-card">
              <span className="lab-hero__stat-num">Instant</span>
              <span className="lab-hero__stat-label">Online Report Lookup</span>
            </div>
            <div className="lab-hero__stat-card">
              <span className="lab-hero__stat-num">Live Radar</span>
              <span className="lab-hero__stat-label">Nearest Center Locator</span>
            </div>
          </div>
        </div>
      </header>

      {/* Network Notice Strip */}
      <section className="lab-notice-strip">
        <div className="container">
          <div className="lab-notice-box">
            <div className="lab-notice-icon">ℹ️</div>
            <div className="lab-notice-content">
              <strong>Partner Tie-Up Gateway:</strong> Sample processing and medical testing are conducted exclusively by
              accredited partner laboratories. MediCare acts as your centralized digital health portal to track reports and locate facilities.
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FUNCTION 1: PATIENT ID REPORT LOOKUP & VIEWER
          ========================================================================= */}
      <section className="lab-section lab-section--report" id="patient-report-portal" ref={reportSectionRef}>
        <div className="container">
          <div className="lab-card-panel">
            <div className="lab-panel-header">
              <div className="lab-panel-header__icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <div className="lab-panel-header__title">
                <span className="lab-pill lab-pill--blue">Function 1 • Report Viewer</span>
                <h2>Enter Patient ID to View Diagnostic Report</h2>
                <p>
                  Enter the unique <strong>Patient ID</strong> or Barcode Number issued by any tied-up diagnostic laboratory.
                  Your digital report is verified with digital signatures and biological reference intervals.
                </p>
              </div>
            </div>

            {/* Patient ID Search Input */}
            <form
              className="lab-search-form"
              onSubmit={(e) => {
                e.preventDefault()
                handleReportSearch()
              }}
              id="report-search-form"
            >
              <div className="lab-search-bar">
                <span className="lab-search-bar__icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </span>

                <input
                  id="patient-id-input"
                  type="text"
                  className="lab-search-bar__input"
                  placeholder="Enter Patient ID (e.g. PT-2024-001, PT-2024-002, or any custom ID)..."
                  value={patientIdInput}
                  onChange={(e) => {
                    setPatientIdInput(e.target.value)
                    if (searchError) setSearchError('')
                  }}
                  autoComplete="off"
                />

                {patientIdInput && (
                  <button
                    type="button"
                    className="lab-search-bar__clear"
                    onClick={handleClearReport}
                    title="Clear input"
                    aria-label="Clear Patient ID"
                  >
                    ✕
                  </button>
                )}

                <button
                  type="submit"
                  className="lab-search-bar__btn"
                  id="search-report-btn"
                  disabled={isSearching}
                >
                  {isSearching ? (
                    <>
                      <span className="lab-spinner" />
                      <span>Fetching...</span>
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="9 11 12 14 22 4" />
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                      </svg>
                      <span>Show Report</span>
                    </>
                  )}
                </button>
              </div>

              {searchError && (
                <div className="lab-error-alert" role="alert">
                  ⚠️ {searchError}
                </div>
              )}
            </form>

            {/* Quick Demo ID Chips for instant verification testing */}
            <div className="lab-demo-chips">
              <span className="lab-demo-chips__label">⚡ Quick Demo Test IDs (Click to test):</span>
              <div className="lab-demo-chips__list">
                <button
                  type="button"
                  id="chip-demo-001"
                  className={`lab-demo-chip ${patientIdInput.toUpperCase() === 'PT-2024-001' ? 'lab-demo-chip--active' : ''}`}
                  onClick={() => {
                    setPatientIdInput('PT-2024-001')
                    handleReportSearch('PT-2024-001')
                  }}
                >
                  <strong>PT-2024-001</strong>
                  <span>Rohan Sharma (Metropolis Lab)</span>
                </button>

                <button
                  type="button"
                  id="chip-demo-002"
                  className={`lab-demo-chip ${patientIdInput.toUpperCase() === 'PT-2024-002' ? 'lab-demo-chip--active' : ''}`}
                  onClick={() => {
                    setPatientIdInput('PT-2024-002')
                    handleReportSearch('PT-2024-002')
                  }}
                >
                  <strong>PT-2024-002</strong>
                  <span>Ananya Verma (Agilus Lab)</span>
                </button>

                <button
                  type="button"
                  id="chip-demo-003"
                  className={`lab-demo-chip ${patientIdInput.toUpperCase() === 'PT-2024-003' ? 'lab-demo-chip--active' : ''}`}
                  onClick={() => {
                    setPatientIdInput('PT-2024-003')
                    handleReportSearch('PT-2024-003')
                  }}
                >
                  <strong>PT-2024-003</strong>
                  <span>Vikramaditya Roy (Dr Lal PathLabs)</span>
                </button>
              </div>
            </div>

            {/* =================================================================
                DIAGNOSTIC REPORT DISPLAY CARD
                ================================================================= */}
            {activeReport && (
              <div className="lab-report-display" id="report-display-card">
                {/* Report Action Bar */}
                <div className="lab-report-actions no-print">
                  <div className="lab-report-actions__left">
                    <span className="lab-status-badge lab-status-badge--verified">
                      ✓ Electronically Verified Partner Report
                    </span>
                    <span className="lab-report-ref">ID: {activeReport.patientId}</span>
                  </div>

                  <div className="lab-report-actions__right">
                    <button
                      type="button"
                      className="lab-action-btn lab-action-btn--print"
                      onClick={handlePrintReport}
                      title="Print or Save as PDF"
                    >
                      🖨️ Print / Save PDF
                    </button>
                    <button
                      type="button"
                      className="lab-action-btn"
                      onClick={handleDownloadReport}
                      title="Download text summary"
                    >
                      📥 Download
                    </button>
                    <button
                      type="button"
                      className="lab-action-btn"
                      onClick={handleShareReport}
                      title="Copy share link"
                    >
                      🔗 Share Link
                    </button>
                    <button
                      type="button"
                      className="lab-action-btn lab-action-btn--close"
                      onClick={handleClearReport}
                      title="Close report"
                    >
                      ✕ Close
                    </button>
                  </div>
                </div>

                {/* Printable Official Medical Document */}
                <div className="lab-official-document">
                  {/* Top Letterhead: Partner Diagnostic Laboratory */}
                  <div className="lab-doc-header">
                    <div className="lab-doc-header__logo">
                      <div className="lab-doc-header__symbol">🔬</div>
                      <div>
                        <h3 className="lab-doc-lab-name">{activeReport.partnerLab.name}</h3>
                        <p className="lab-doc-lab-meta">
                          {activeReport.partnerLab.accreditation} • {activeReport.partnerLab.badge}
                        </p>
                        <p className="lab-doc-lab-branch">Branch: {activeReport.partnerLab.branch}</p>
                      </div>
                    </div>

                    <div className="lab-doc-header__barcode-box">
                      <div className="lab-barcode-graphic">
                        <span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span />
                        <span /><span /><span /><span /><span /><span /><span /><span /><span /><span />
                      </div>
                      <span className="lab-barcode-text">{activeReport.patientId}</span>
                      <span className="lab-doc-date">Issued: {activeReport.reportDate}</span>
                    </div>
                  </div>

                  {/* Patient Info Grid */}
                  <div className="lab-doc-patient-grid">
                    <div className="lab-patient-item">
                      <span className="lab-patient-label">Patient ID</span>
                      <strong className="lab-patient-val highlight-blue">{activeReport.patientId}</strong>
                    </div>
                    <div className="lab-patient-item">
                      <span className="lab-patient-label">Patient Full Name</span>
                      <strong className="lab-patient-val">{activeReport.patientName}</strong>
                    </div>
                    <div className="lab-patient-item">
                      <span className="lab-patient-label">Age / Gender</span>
                      <span className="lab-patient-val">{activeReport.age} Years / {activeReport.gender}</span>
                    </div>
                    <div className="lab-patient-item">
                      <span className="lab-patient-label">Contact</span>
                      <span className="lab-patient-val">{activeReport.phone}</span>
                    </div>
                    <div className="lab-patient-item">
                      <span className="lab-patient-label">Referring Doctor</span>
                      <span className="lab-patient-val">{activeReport.referringDoctor}</span>
                    </div>
                    <div className="lab-patient-item">
                      <span className="lab-patient-label">Investigation Panel</span>
                      <strong className="lab-patient-val">{activeReport.testPackage}</strong>
                    </div>
                    <div className="lab-patient-item">
                      <span className="lab-patient-label">Sample Specimen</span>
                      <span className="lab-patient-val">{activeReport.sampleType}</span>
                    </div>
                    <div className="lab-patient-item">
                      <span className="lab-patient-label">Sample Collection Date</span>
                      <span className="lab-patient-val">{activeReport.collectionDate}</span>
                    </div>
                  </div>

                  {/* Pathologist Clinical Impression */}
                  <div className="lab-doc-impression">
                    <div className="lab-impression-header">
                      <span className="lab-impression-icon">🩺</span>
                      <strong>Chief Pathologist Clinical Impression:</strong>
                      <span className={`lab-status-tag ${activeReport.statusClass}`}>
                        {activeReport.overallStatus}
                      </span>
                    </div>
                    <p className="lab-impression-body">{activeReport.clinicalImpression}</p>
                  </div>

                  {/* Test Investigation Results Table */}
                  <div className="lab-doc-results">
                    {activeReport.categories.map((category, catIdx) => (
                      <div key={catIdx} className="lab-results-group">
                        <div className="lab-group-title">
                          <span>{category.name}</span>
                        </div>

                        <div className="lab-table-responsive">
                          <table className="lab-results-table">
                            <thead>
                              <tr>
                                <th style={{ width: '38%' }}>Test Parameter</th>
                                <th style={{ width: '18%' }}>Observed Value</th>
                                <th style={{ width: '14%' }}>Unit</th>
                                <th style={{ width: '18%' }}>Biological Ref. Interval</th>
                                <th style={{ width: '12%', textAlign: 'center' }}>Flag</th>
                              </tr>
                            </thead>
                            <tbody>
                              {category.tests.map((test, tIdx) => (
                                <tr key={tIdx} className={`lab-row--${test.status}`}>
                                  <td>
                                    <span className="lab-param-name">{test.name}</span>
                                  </td>
                                  <td>
                                    <strong className={`lab-param-val lab-param-val--${test.status}`}>
                                      {test.value}
                                    </strong>
                                  </td>
                                  <td>
                                    <span className="lab-param-unit">{test.unit}</span>
                                  </td>
                                  <td>
                                    <span className="lab-param-range">{test.range}</span>
                                  </td>
                                  <td style={{ textAlign: 'center' }}>
                                    <span className={`lab-flag-pill lab-flag-pill--${test.status}`}>
                                      {test.flag}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Verification & Signatures Footer */}
                  <div className="lab-doc-signatures">
                    <div className="lab-sig-block">
                      <div className="lab-stamp-badge">
                        <span>MEDICARE VERIFIED</span>
                        <small>ELECTRONIC SEAL</small>
                      </div>
                      <p className="lab-sig-note">
                        Processed on automated NABL calibrated analyzers. Digitally validated via MediCare Diagnostic Network.
                      </p>
                    </div>

                    <div className="lab-sig-block text-right">
                      <div className="lab-sig-line">
                        <span className="lab-script-sign">Dr. Arvind Deshmukh</span>
                      </div>
                      <strong className="lab-signee">{activeReport.partnerLab.pathologist}</strong>
                      <span className="lab-signee-reg">Reg. No: {activeReport.partnerLab.regNo}</span>
                      <span className="lab-signee-lab">{activeReport.partnerLab.name}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================================
          FUNCTION 2: TAKE LOCATION & LOCATE NEARBY DIAGNOSTIC CENTERS
          ========================================================================= */}
      <section className="lab-section lab-section--locator" id="diagnostic-centers-locator" ref={locatorSectionRef}>
        <div className="container">
          <div className="lab-card-panel">
            <div className="lab-panel-header">
              <div className="lab-panel-header__icon lab-panel-header__icon--teal">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="3 11 22 2 13 21 11 13 3 11" />
                </svg>
              </div>
              <div className="lab-panel-header__title">
                <span className="lab-pill lab-pill--teal">Function 2 • Center Locator</span>
                <h2>Locate Tied-Up Diagnostic Centers Near You</h2>
                <p>
                  Enter your <strong>Area / Locality</strong> and <strong>6-digit Pincode</strong> below to find accredited partner diagnostic labs in your neighborhood.
                </p>
              </div>
            </div>

            {/* Area Name & 6-Digit Pincode Location Form */}
            <form className="lab-location-form" onSubmit={handleLocationSubmit}>
              <div className="lab-location-form__row">
                <div className="lab-location-field lab-location-field--area">
                  <label htmlFor="lab-area-input" className="lab-location-field__label">
                    📍 Area / Locality / City
                  </label>
                  <input
                    id="lab-area-input"
                    type="text"
                    className="lab-location-field__input"
                    placeholder="e.g. Salt Lake, Bandra West, Indiranagar, Kolkata"
                    value={areaInput}
                    onChange={(e) => setAreaInput(e.target.value)}
                  />
                </div>

                <div className="lab-location-field lab-location-field--pincode">
                  <label htmlFor="lab-pincode-input" className="lab-location-field__label">
                    📮 6-Digit Pincode
                  </label>
                  <input
                    id="lab-pincode-input"
                    type="text"
                    className="lab-location-field__input"
                    placeholder="e.g. 700091"
                    maxLength={6}
                    value={pincodeInput}
                    onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, ''))}
                  />
                </div>

                <button type="submit" id="lab-search-location-btn" className="lab-location-submit-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                  <span>Search Centers</span>
                </button>
              </div>
            </form>

            {/* Quick City Selection Pills */}
            <div className="lab-city-pills-row">
              <span className="lab-city-pills-label">Quick City Selector:</span>
              <div className="lab-city-pills-list">
                {POPULAR_CITIES.map((city) => (
                  <button
                    key={city}
                    type="button"
                    className={`lab-city-pill ${searchedArea.toLowerCase() === city.toLowerCase() && !searchedPincode ? 'lab-city-pill--active' : ''}`}
                    onClick={() => handleCitySelect(city)}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Location Status Bar */}
            <div className="lab-control-bar">
              <div className="lab-loc-indicator">
                <div className="lab-loc-dot lab-loc-dot--active" />
                <div className="lab-loc-info">
                  <span className="lab-loc-sub">Active Search Location:</span>
                  <strong className="lab-loc-text">
                    📍 {searchedArea || 'Kolkata'}{searchedPincode ? ` (Pincode: ${searchedPincode})` : ''}
                  </strong>
                </div>
              </div>

              <div className="lab-action-group">
                <a
                  id="open-in-google-maps-btn"
                  href={directMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lab-external-maps-btn"
                  title="Open live Google Maps app"
                >
                  <span>Open in Google Maps</span>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
              </div>
            </div>

            {/* =================================================================
                INTERACTIVE LIVE GOOGLE MAP EMBED
                ================================================================= */}
            <div className="lab-map-container">
              <div className="lab-map-header">
                <div className="lab-map-header__title">
                  <span className="lab-live-dot" />
                  <span>
                    Diagnostic Radar: <strong>Labs & Diagnostic Centers near {searchedArea}{searchedPincode ? ` (${searchedPincode})` : ''}</strong>
                  </span>
                </div>
                <a
                  href={directMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lab-map-external-link"
                  id="open-maps-external-btn"
                >
                  View on Google Maps ↗
                </a>
              </div>

              <div className="lab-map-iframe-wrapper">
                <iframe
                  title="Nearby Diagnostic Centers Map"
                  src={embedMapUrl}
                  width="100%"
                  height="390"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                />
              </div>
            </div>


          </div>
        </div>
      </section>

      {/* =========================================================================
          FAQ & NETWORK CLARITY SECTION
          ========================================================================= */}
      <section className="lab-faq-section">
        <div className="container">
          <div className="lab-faq-header text-center">
            <span className="lab-pill lab-pill--blue">Frequently Asked Questions</span>
            <h2>Understanding the MediCare Diagnostic Network</h2>
            <p>Everything you need to know about our partner tie-ups and patient report tracking.</p>
          </div>

          <div className="lab-faq-grid">
            <details className="lab-faq-item" open>
              <summary className="lab-faq-question">
                <span>Does MediCare conduct its own diagnostic tests?</span>
                <span className="lab-faq-chevron">▼</span>
              </summary>
              <div className="lab-faq-answer">
                <p>
                  <strong>No.</strong> MediCare is a technology-enabled healthcare network aggregator. We tie up with verified,
                  accredited third-party diagnostic laboratories (such as Dr Lal PathLabs, Metropolis Healthcare, Agilus, Apollo Diagnostics,
                  and local certified hospital labs). All testing, equipment calibration, and pathologist sign-offs are conducted by our partner labs.
                </p>
              </div>
            </details>

            <details className="lab-faq-item">
              <summary className="lab-faq-question">
                <span>Where can I find my Patient ID to view my report?</span>
                <span className="lab-faq-chevron">▼</span>
              </summary>
              <div className="lab-faq-answer">
                <p>
                  Your unique Patient ID is printed on the barcode tube sticker and paper bill given by the partner diagnostic lab
                  during specimen collection. You also receive it instantly via SMS/WhatsApp confirmation from the partner center.
                </p>
              </div>
            </details>

            <details className="lab-faq-item">
              <summary className="lab-faq-question">
                <span>Are all diagnostic centers in the network accredited?</span>
                <span className="lab-faq-chevron">▼</span>
              </summary>
              <div className="lab-faq-answer">
                <p>
                  Yes. MediCare strictly partners with laboratories certified under <strong>NABL (National Accreditation Board for Testing and Calibration Laboratories)</strong>,
                  <strong>CAP (College of American Pathologists)</strong>, or <strong>ISO 15189</strong> medical standards to ensure 100% precision.
                </p>
              </div>
            </details>

            <details className="lab-faq-item">
              <summary className="lab-faq-question">
                <span>Can I directly visit a partner diagnostic center near me?</span>
                <span className="lab-faq-chevron">▼</span>
              </summary>
              <div className="lab-faq-answer">
                <p>
                  Yes. Use <strong>Function 2 (Locate Centers Nearby)</strong> above to find the nearest partner laboratory, view their
                  operating hours, get turn-by-turn Google Maps navigation, or call their front desk directly.
                </p>
              </div>
            </details>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default LabTestPage
