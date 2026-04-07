import React, { useEffect } from 'react'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'

const MenService = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#f4f7fb] to-[#e8f0f8] flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full text-center">
          {/* SVG Illustration */}
          <div className="mb-8">
            <svg
              className="w-64 h-64 mx-auto"
              viewBox="0 0 400 400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Background Circle */}
              <circle cx="200" cy="200" r="180" fill="#E0F2FE" opacity="0.3"/>
              
              {/* Main Person Icon */}
              <circle cx="200" cy="140" r="45" fill="#8DCAE4" opacity="0.8"/>
              <path
                d="M140 240 Q140 190 200 190 Q260 190 260 240 L260 300 Q260 310 250 310 L150 310 Q140 310 140 300 Z"
                fill="#8DCAE4"
                opacity="0.8"
              />
              
              {/* Tool Icons */}
              <g opacity="0.6">
                {/* Wrench */}
                <path
                  d="M100 120 L110 130 L100 140 L90 130 Z M110 130 L140 160"
                  stroke="#6B9BB0"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <circle cx="145" cy="165" r="8" fill="#6B9BB0"/>
                
                {/* Hammer */}
                <rect x="280" y="150" width="30" height="10" rx="2" fill="#6B9BB0"/>
                <rect x="292" y="160" width="6" height="60" rx="2" fill="#6B9BB0"/>
              </g>
              
              {/* Clock Icon */}
              <circle cx="320" cy="240" r="35" stroke="#8DCAE4" strokeWidth="4" fill="white"/>
              <path
                d="M320 215 L320 240 L335 240"
                stroke="#8DCAE4"
                strokeWidth="3"
                strokeLinecap="round"
              />
              
              {/* Calendar Icon */}
              <rect x="50" y="220" width="50" height="50" rx="5" fill="white" stroke="#8DCAE4" strokeWidth="3"/>
              <line x1="60" y1="220" x2="60" y2="210" stroke="#8DCAE4" strokeWidth="3" strokeLinecap="round"/>
              <line x1="90" y1="220" x2="90" y2="210" stroke="#8DCAE4" strokeWidth="3" strokeLinecap="round"/>
              <line x1="55" y1="235" x2="95" y2="235" stroke="#8DCAE4" strokeWidth="2"/>
            </svg>
          </div>

          {/* Text Content */}
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Coming Soon
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 mb-6">
            Men's Services Are Under Development
          </p>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-[#8DCAE4]/20">
            <p className="text-lg text-slate-700 mb-4">
              We're currently working on bringing you specialized laser treatment services for men.
            </p>
            <p className="text-base text-slate-600">
              Our team is preparing comprehensive packages tailored specifically for men's grooming and skin care needs. Check back soon!
            </p>
          </div>

          {/* Call to Action */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.history.back()}
              className="px-8 py-3 bg-gradient-to-r from-[#8DCAE4] to-[#6BB5D8] text-white font-semibold rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
            >
              Go Back
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="px-8 py-3 bg-white text-[#6BB5D8] font-semibold rounded-lg border-2 border-[#8DCAE4] hover:bg-[#8DCAE4] hover:text-white transition-all duration-300"
            >
              Browse Women's Services
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default MenService
