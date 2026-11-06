import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import FindDoctorPage from './pages/FindDoctorPage'
import VideoConsultPage from './pages/VideoConsultPage'
import LabTestPage from './pages/LabTestPage'
import SurgeryPage from './pages/SurgeryPage'
import ArticlesPage from './pages/ArticlesPage'
import FloatingFindDoctorBtn from './components/FloatingFindDoctorBtn'
import ErrorBoundary from './components/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/find-doctors" element={<FindDoctorPage />} />
        {/* Support URL variations with spaces, percent-encoding, or singular format */}
        <Route path="/find doctors" element={<FindDoctorPage />} />
        <Route path="/find%20doctors" element={<FindDoctorPage />} />
        <Route path="/find-doctor" element={<FindDoctorPage />} />
        <Route path="/doctors-near-you" element={<FindDoctorPage />} />
        <Route path="/doctor-near-you" element={<FindDoctorPage />} />
        <Route path="/doctors-near-me" element={<FindDoctorPage />} />
        <Route path="/doctor-near-me" element={<FindDoctorPage />} />
        {/* Dedicated Video Consult Page with 1 Doctor per Specialty & Telehealth Records */}
        <Route path="/video-consult" element={<VideoConsultPage />} />
        <Route path="/video-consultation" element={<VideoConsultPage />} />
        <Route path="/video consult" element={<VideoConsultPage />} />
        <Route path="/videoconsult" element={<VideoConsultPage />} />
        {/* Lab Tests Page & Patient Report Portal */}
        <Route path="/lab-tests" element={<LabTestPage />} />
        <Route path="/lab-test" element={<LabTestPage />} />
        <Route path="/labtests" element={<LabTestPage />} />
        {/* Surgery Care & Hospital Tie-Ups */}
        <Route path="/surgeries" element={<SurgeryPage />} />
        <Route path="/surgery" element={<SurgeryPage />} />
        <Route path="/surgical-care" element={<SurgeryPage />} />
        {/* Health Library & Expert Medical Articles */}
        <Route path="/articles" element={<ArticlesPage />} />
        <Route path="/health-articles" element={<ArticlesPage />} />
        <Route path="/read-articles" element={<ArticlesPage />} />
        {/* Fallback to FindDoctorPage for unmatched URLs */}
        <Route path="*" element={<FindDoctorPage />} />
      </Routes>
      <FloatingFindDoctorBtn />
    </ErrorBoundary>
  )
}

export default App
