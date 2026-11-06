import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import VideoHeroSection from '../components/VideoHeroSection'
import ServicesSection from '../components/ServicesSection'
import SpecialtiesSection from '../components/SpecialtiesSection'
import InClinicSection from '../components/InClinicSection'
import AdSection from '../components/AdSection'
import ArticlesSection from '../components/ArticlesSection'
import Footer from '../components/Footer'
import './HomePage.css'

const HomePage = () => {
  useEffect(() => {
    document.title = 'MediCare – Find Doctors, Online Consultation & Lab Tests'
  }, [])

  return (
    <div className="home-page">
      {/* 1. Navigation Bar */}
      <Navbar />

      {/* 2. Running Intro Video Showcase (Matches Reference Image) */}
      <VideoHeroSection />

      {/* 3. Modern Service Cards (Instant Video, Doctors Near You, Lab Tests, Surgeries) */}
      <ServicesSection />

      {/* 5. Consult Top Doctors / Specialties + View All Specialities */}
      <SpecialtiesSection />

      {/* 6. In-Clinic Consultation Carousel (Matches Reference Images 1 & 2) */}
      <InClinicSection />

      {/* 7. Top Articles from Experts */}
      <ArticlesSection />

      {/* 8. Patient Reviews & Testimonials (Why Millions Trust MediCare) */}
      <AdSection />

      {/* 8. Footer */}
      <Footer />
    </div>
  )
}

export default HomePage
