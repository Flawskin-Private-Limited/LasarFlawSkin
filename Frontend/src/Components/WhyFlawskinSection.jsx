export default function WhyFlawskinSection() {
  const features = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" aria-hidden="true">
          <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "US‑FDA Approved",
      desc: "Medical‑grade laser devices for maximum safety.",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" aria-hidden="true">
          <path d="M12 14l9-5-9-5-9 5 9 5zm0 0v7m-9-12v7l9 5 9-5v-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Certified Experts",
      desc: "Trained professionals with years of experience.",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" aria-hidden="true">
          <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Painless Sessions",
      desc: "Cooling tech for pain‑free treatments.",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" aria-hidden="true">
          <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "At‑Home Service",
      desc: "Clinic results at your doorstep.",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" aria-hidden="true">
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Visible Results",
      desc: "Noticeable reduction from session one.",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" aria-hidden="true">
          <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: "Flexible Timing",
      desc: "Book anytime from 7 AM to 10 PM.",
    },
  ];

  return (
    <section
      className="w-full bg-gradient-to-b from-gray-50 to-white py-14 sm:py-20 lg:py-24 px-4 sm:px-6"
      style={{ fontFamily: "'Outfit', sans-serif" }}
    >
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="w-8 h-[2px] bg-[#8dcae4]" />
            <span className="text-[#8dcae4] text-xs font-semibold tracking-[0.2em] uppercase">
              Why Flawskin
            </span>
            <span className="w-8 h-[2px] bg-[#8dcae4]" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            What Makes Us{" "}
            <span className="text-[#8dcae4]">Different</span>
          </h2>
          <p className="mt-3 text-gray-500 text-sm sm:text-lg max-w-2xl mx-auto">
            Advanced laser technology paired with personalised care — here's why thousands trust Flawskin.
          </p>
        </div>

        {/* Feature grid — 2 cols on mobile, 3 on lg */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className="group bg-white border border-gray-100 rounded-2xl p-3 sm:p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#8dcae4]/30 hover:-translate-y-1"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#8dcae4]/10 text-[#8dcae4] flex items-center justify-center mb-2 sm:mb-3 transition-colors duration-300 group-hover:bg-[#8dcae4]/20">
                {f.icon}
              </div>
              <h3 className="text-gray-900 text-xs sm:text-base font-semibold mb-0.5 sm:mb-1 leading-snug">{f.title}</h3>
              <p className="text-gray-500 text-[10px] sm:text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
