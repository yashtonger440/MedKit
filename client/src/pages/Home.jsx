import React from 'react'
import Navbar from '../components/Navbar'
import Hero from "../components/Hero"
import Services from '../pages/Services'
import EmergencyCare from '../components/EmergencyCare'
import WoundCare from '../components/WoundCare'
import DoctorCall from '../components/DoctorCall'
import Ambulance from '../components/Ambulance'
import Doctors from '../components/Doctors'
import ServicesPreview from './ServicesPreview'
import ParentsCare from '../components/ParentsCare'
import DietitianSection from '../components/DietitianSection'
import BookingSection from '../components/BookingSection'
import JoinMission from '../components/JoinMission'
import Coverage from '../components/Coverage'
import Footer from '../components/Footer'

function Home() {
  return (
    <div className='bg-gray-50'>
      <Navbar />
      <Hero />
      <ServicesPreview />
      <EmergencyCare />
      <WoundCare />
      <DoctorCall />
      <Ambulance />
      <Doctors />
      <ParentsCare />
      <DietitianSection />
      <BookingSection />
      <JoinMission />
      <Coverage />
      <Footer />
    </div>
  )
}

export default Home
