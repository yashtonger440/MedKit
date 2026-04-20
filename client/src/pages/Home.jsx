import React from 'react'
import Navbar from '../components/Navbar'
import Hero from "../components/Hero"
import Services from '../pages/Services'
import EmergencyCare from '../components/EmergencyCare'
import WoundCare from '../components/WoundCare'
import DoctorCall from '../components/DoctorCall'
import Ambulance from '../components/Ambulance'
import Doctors from '../components/Doctors'

function Home() {
  return (
    <div className='bg-gray-50'>
      <Navbar />
      <Hero />
      <Services />
      <EmergencyCare />
      <WoundCare />
      <DoctorCall />
      <Ambulance />
      <Doctors />
    </div>
  )
}

export default Home
