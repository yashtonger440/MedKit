import React from 'react'
import Navbar from '../components/Navbar'
import Hero from "../components/Hero"
import Services from '../pages/Services'
import ServicesPreview from '../components/ServicesPreview'
import EmergencyCare from '../components/EmergencyCare'
import WoundCare from '../components/WoundCare'
import DoctorCall from '../components/DoctorCall'
import Ambulance from '../components/Ambulance'
import Doctors from '../components/Doctors'
import ParentsCare from '../components/ParentsCare'
import DietitianSection from '../components/DietitianSection'
import JoinMission from '../components/JoinMission'
import Coverage from '../components/Coverage'
import Footer from '../components/Footer'
import Reviews from '../components/Reviews'
import FAQ from '../components/FAQ'
import PriceCalculator from '../components/PriceCalculator'

function Home() {
  return (
    <div className='bg-gray-50'>
      <Navbar />
      <Hero />
      <ServicesPreview />
      <WoundCare />
      <ParentsCare />
      <PriceCalculator />
      <DoctorCall />
      <EmergencyCare />
      <DietitianSection />
      <Ambulance />
      <Doctors />
      <JoinMission />
      <Reviews />
      <FAQ />
      <Coverage />
      <Footer />
    </div>
  )
}

export default Home
