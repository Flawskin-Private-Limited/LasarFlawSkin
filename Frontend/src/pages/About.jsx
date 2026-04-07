import React, { useRef, useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import laserTreatment from "../assets/images/laser-treatment.png";

import {
  ShieldCheck,
  Zap,
  Heart,
  Users,
  CheckCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const About = () => {

  const scrollRef = useRef(null);
  const coreRef = useRef(null);

  const [animateCard, setAnimateCard] = useState(false);

  const scrollLeftBtn = () => {
    scrollRef.current.scrollBy({ left: -340, behavior: "smooth" });
    triggerAnimation();
  };

  const scrollRightBtn = () => {
    scrollRef.current.scrollBy({ left: 340, behavior: "smooth" });
    triggerAnimation();
  };

  const triggerAnimation = () => {
    setAnimateCard(true);
    setTimeout(() => setAnimateCard(false), 400);
  };


/* CORE VALUES AUTO SCROLL */

useEffect(() => {

  const el = coreRef.current;
  if (!el) return;

  let animationFrame;

  const autoScroll = () => {

    if (window.innerWidth >= 768) return;

    if (el.scrollLeft >= el.scrollWidth - el.clientWidth) {
      el.scrollLeft = 0;
    } else {
      el.scrollLeft += 0.5;
    }

    animationFrame = requestAnimationFrame(autoScroll);
  };

  autoScroll();

  return () => cancelAnimationFrame(animationFrame);

}, []);



return (
<>
<Navbar/>

<div className="bg-[#F6F7F8] font-[Manrope] overflow-x-hidden">

{/* HERO */}

<section className="relative h-[85vh] flex items-center justify-center text-center">

<img
src={laserTreatment}
className="absolute w-full h-full object-cover"
alt="Laser-treatment"
/>

<div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80"></div>

<div className="relative text-white max-w-2xl px-6">

<h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg bg-gradient-to-r from-[#8DCAE4] to-white bg-clip-text text-transparent">
Who We Are
</h1>

<p className="text-lg md:text-xl text-white/90">
Redefining confidence through advanced clinical precision and
personalized care. Discover the future of smooth skin.
</p>

</div>

</section>



{/* MISSION */}

<section className="bg-white py-14 md:py-24 px-6">

<div className="max-w-3xl mx-auto text-center">

<p className="uppercase tracking-[3px] text-[#8DCAE4] text-sm font-bold">
OUR MISSION
</p>

<h2 className="text-3xl md:text-4xl font-medium text-[#1E293B] mt-4">
We combine medical-grade technology with a clinical touch to
provide the best hair reduction experience in the industry.
</h2>

<p className="text-[#64748B] leading-8 mt-8">
Founded in 2015, LaserSmooth began with a simple vision: to make
safe dermatological treatments accessible and comfortable
for everyone.We believe that professional aesthetic care should be transparent, effective, and tailored to the individual.
</p>

<div className="bg-[#8DCAE4]/10 border-l-4 border-[#8DCAE4] rounded-xl p-8 mt-10 text-lg text-[#1E293B] hover:shadow-lg transition">
“We believe that smoothness isn't just about skin; it’s about the
confidence that comes with feeling your best every single day.”
</div>

<p className="text-[#64748B] leading-8 mt-8">
Today we operate at the intersection of medical science and luxury wellness, ensuring every patient receives gold-standard care from the moment they step into our clinic.
</p>

</div>

</section>



{/* EXPERTS */}

<section className="py-14 md:py-24 px-6">

<div className="max-w-6xl mx-auto">

<h2 className="text-3xl font-bold text-center text-[#0F172A]">
Meet Our Experts
</h2>

<p className="text-gray-500 mt-2 text-center">
Certified specialists with over 20 years of clinical experience.
</p>


<div className="relative mt-8 md:mt-12">

<button
onClick={scrollLeftBtn}
className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white shadow-lg rounded-full p-3 active:scale-90 transition"
>
<ChevronLeft size={22}/>
</button>

<button
onClick={scrollRightBtn}
className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white shadow-lg rounded-full p-3 active:scale-90 transition"
>
<ChevronRight size={22}/>
</button>


<div
ref={scrollRef}
className="flex gap-8 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 no-scrollbar"
>

<ExpertCard animate={animateCard} img="https://images.unsplash.com/photo-1559839734-2b71ea197ec2" name="Dr. Sarah Chen" role="LEAD CLINICIAN" text="Advanced laser systems and dermatological safety protocols."/>

<ExpertCard animate={animateCard} img="https://images.unsplash.com/photo-1607746882042-944635dfe10e" name="Marcus Thorne" role="LASER TECHNICIAN" text="Clinical precision and patient comfort specialist."/>

<ExpertCard animate={animateCard} img="https://images.unsplash.com/photo-1594824476967-48c8b964273f" name="Elena Rodriguez" role="SKIN SPECIALIST" text="Personalized tracking and long-term skin health."/>

<ExpertCard animate={animateCard} img="https://images.unsplash.com/photo-1622253692010-333f2da6031d" name="Dr. Daniel Reed" role="DERMATOLOGIST" text="Skin health and advanced dermatology treatments."/>

<ExpertCard animate={animateCard} img="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d" name="Sophia Lee" role="LASER CONSULTANT" text="Patient consultation and treatment planning."/>

</div>

</div>

</div>

</section>



{/* CORE VALUES */}

<section className="bg-white py-14 md:py-24 px-6">

<div className="max-w-5xl mx-auto text-center">

<h2 className="text-3xl font-bold text-[#0F172A]">
Our Core Values
</h2>

<div
ref={coreRef}
className="flex md:grid md:grid-cols-2 gap-6 mt-10 md:mt-14 overflow-x-auto md:overflow-visible no-scrollbar"
>

<ValueCard icon={<ShieldCheck/>} title="Safety First" text="Highest medical safety standards and protocols for a risk-free environment."/>

<ValueCard icon={<Zap/>} title="Advanced Tech" text="Latest FDA-approved medical grade laser systems optimized for efficiency."/>

<ValueCard icon={<Heart/>} title="Patient Comfort" text="A serene supportive atmosphere throughout every session of your journey."/>

<ValueCard icon={<Users/>} title="Inclusivity" text="Proven treatments for all skin types and textures, leaving no one behind."/>

</div>

</div>

</section>



{/* CTA SECTION */}

<section className="py-16 px-5 md:py-24 md:px-6">

{/* DESKTOP */}

<div className="hidden md:grid max-w-6xl mx-auto bg-gradient-to-br from-[#0F172A] to-[#071024] rounded-[60px] text-white p-16 grid-cols-2 gap-12 shadow-2xl">

<div>

<h2 className="text-4xl font-bold leading-snug">
The Gold Standard of Laser Care
</h2>

<p className="text-gray-400 mt-4">
Our clinical approach ensures every treatment is backed by science
and executed with artisanal care.
</p>

<ul className="mt-8 space-y-4 text-sm">

<Feature text="FDA-Approved Cooling Technology"/>
<Feature text="Medical-Grade Sanitation Protocols"/>
<Feature text="Complimentary Patch Testing"/>
<Feature text="Certified Laser Safety Officers"/>

</ul>

</div>


<div className="bg-white/5 border border-white/10 backdrop-blur-lg rounded-2xl p-10 text-center">

<h3 className="text-2xl font-bold">
Start Your Journey
</h3>

<p className="text-gray-400 mt-4">
Book a private consultation with one of our specialists today.
</p>

<button className="bg-[#8DCAE4] text-[#0F172A] font-bold w-full py-4 rounded-xl mt-6 hover:bg-[#74bddb] transition">
Book a Consultation
</button>

<p className="mt-6 text-[#8DCAE4] text-xs tracking-[0.35em] uppercase flex justify-center gap-4">
<span>SAFE</span>
<span>•</span>
<span>CLINICAL</span>
<span>•</span>
<span>RESULTS</span>
</p>

</div>

</div>



{/* MOBILE PREMIUM DESIGN */}

<div className="md:hidden max-w-md mx-auto space-y-6">

<div className="bg-gradient-to-br from-[#0F172A] to-[#071024] rounded-[32px] text-white p-8 shadow-xl">

<h2 className="text-2xl font-bold leading-snug">
The Gold Standard of Laser Care
</h2>

<p className="text-gray-400 mt-4 text-sm">
Our clinical approach ensures every treatment is backed by science
and executed with artisanal care.
</p>

<ul className="mt-6 space-y-3 text-sm">

<Feature text="FDA-Approved Cooling Technology"/>
<Feature text="Medical-Grade Sanitation Protocols"/>
<Feature text="Complimentary Patch Testing"/>
<Feature text="Certified Laser Safety Officers"/>

</ul>

</div>


<div className="bg-white shadow-xl rounded-[28px] p-8 text-center border">

<h3 className="text-xl font-bold text-[#0F172A]">
Start Your Journey
</h3>

<p className="text-gray-500 mt-3 text-sm">
Book a private consultation with one of our specialists today.
</p>

<button className="bg-[#8DCAE4] text-[#0F172A] font-bold w-full py-4 rounded-xl mt-6 hover:bg-[#74bddb] transition">
Book a Consultation
</button>

<p className="mt-6 text-[#8DCAE4] text-[11px] tracking-[0.35em] uppercase flex justify-center gap-3">

<span>SAFE</span>
<span>•</span>
<span>CLINICAL</span>
<span>•</span>
<span>RESULTS</span>

</p>

</div>

</div>

</section>

</div>

<Footer/>

</>
);
};



const ExpertCard = ({ img, name, role, text, animate }) => (

<div className={`group min-w-[280px] md:min-w-[320px] snap-center bg-white rounded-xl border shadow-sm hover:shadow-xl transition overflow-hidden ${animate ? "scale-105" : ""}`}>

<img src={img} className="h-80 w-full object-cover group-hover:scale-110 transition duration-700" alt=""/>

<div className="p-6">

<h3 className="font-bold text-lg group-hover:text-[#8DCAE4] transition">
{name}
</h3>

<p className="text-[#8DCAE4] uppercase text-xs tracking-widest mt-1">
{role}
</p>

<p className="text-gray-500 text-sm mt-3">
{text}
</p>

</div>

</div>

);



const ValueCard = ({ icon, title, text }) => (

<div className="min-w-[260px] bg-[#F8FAFC] border rounded-xl p-8 hover:shadow-lg transition">

<div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center bg-[#8DCAE4]/20 rounded-lg text-[#8DCAE4]">
{icon}
</div>

<h3 className="font-semibold">
{title}
</h3>

<p className="text-gray-500 text-sm mt-2">
{text}
</p>

</div>

);



const Feature = ({ text }) => (
<li className="flex items-center gap-3">
<CheckCircle className="text-[#8DCAE4]" size={18}/>
{text}
</li>
);export default About;