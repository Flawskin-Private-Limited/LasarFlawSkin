import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import skincareImage1 from "../assets/images/Skincare1.jpg";
import skincareImage2 from "../assets/images/Skincare2.png"; 

const HowItWorks = () => {
  const navigate = useNavigate();
  return (
    <section className="bg-[#f4f6f9] py-12 sm:py-16 lg:py-20 px-4 sm:px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">

        {/* LEFT IMAGES */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center">

          {/* First Image */}
          <img
            src={skincareImage1}
            alt="Skincare Products"
            className="w-full sm:w-72 h-80 object-cover rounded-3xl shadow-2xl"
          />

          {/* Second Image */}
          <img
            src={skincareImage2}
            alt="Clinic Setup"
            className="w-full sm:w-72 h-80 object-cover rounded-3xl shadow-2xl"
          />

        </div>

        {/* RIGHT CONTENT */}
        <div>
          <div className="flex items-center gap-3 text-[#8dcae4] font-semibold tracking-wider mb-5">
            <span className="w-10 h-[2px] bg-[#8dcae4]"></span>
            <span>HOW IT WORKS</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#0b1d35] leading-tight mb-4 sm:mb-6">
            Professional Clinic Grade <br />
            Results, Delivered To Your Door
          </h1>

          <p className="text-gray-600 leading-relaxed mb-5 sm:mb-8 text-xs sm:text-sm md:text-base">
            Our mobile laser units are equipped with advanced
            FDA-approved technology to ensure safe and effective hair
            reduction for all skin types. Certified professionals deliver
            hygienic and comfortable treatments right at your doorstep.
          </p>

          <div className="space-y-3 sm:space-y-4 mb-5 sm:mb-8">
            <div className="flex items-center gap-3 text-[#1f2c44]">
              <FaCheckCircle style={{ color: '#8dcae4' }} />
              <span>Free Initial Video Consultation</span>
            </div>

            <div className="flex items-center gap-3 text-[#1f2c44]">
              <FaCheckCircle style={{ color: '#8dcae4' }} />
              <span>Medical-Grade Laser Technology</span>
            </div>

            <div className="flex items-center gap-3 text-[#1f2c44]">
              <FaCheckCircle style={{ color: '#8dcae4' }} />
              <span>Flexible Scheduling (7 AM - 10 PM)</span>
            </div>
          </div>

          <button 
            onClick={() => navigate('/women-service')}
            className="bg-[#8dcae4] text-white px-5 py-2.5 text-sm rounded-lg shadow-md hover:bg-[#0d2745] transition duration-300"
          >
            View All Services
          </button>
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;