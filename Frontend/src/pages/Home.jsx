import React, { useEffect } from 'react'
import Navbar from '../Components/Navbar'
import ServiceOptions from '../Components/ServiceOptions'
import ViewallService from '../Components/Viewallservice'
import HeroSection from '../Components/HeroSection'
import Footer from '../Components/Footer'
import WhyFlawskinSection from '../Components/WhyFlawskinSection'
import FAQSection from '../Components/F&q'


const Home = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
    <Navbar />
    <HeroSection />
    <ServiceOptions />
    <ViewallService />
    <WhyFlawskinSection />
    <FAQSection />
    <Footer />
    </>
  )
}

export default Home
