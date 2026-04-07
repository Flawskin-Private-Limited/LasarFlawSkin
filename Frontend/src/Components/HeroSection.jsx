import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

// ── Import your video directly so Vite/CRA resolves it correctly ──
// Option A (Vite / CRA — RECOMMENDED): import the file
import heroBg from "../assets/herovideo1.mp4";
// Option B: if you keep it in /public, comment the line above and use:
// const heroBg = "/assets/herovideo1.mp4";

export default function HeroSection() {
  const headingRef = useRef(null);
  const ctaRef     = useRef(null);
  const videoRef   = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Staggered fade-up on mount
  useEffect(() => {
    const els = [headingRef, ctaRef];
    els.forEach((ref, i) => {
      if (!ref.current) return;
      ref.current.style.opacity   = "0";
      ref.current.style.transform = "translateY(24px)";
      ref.current.style.transition = `opacity 0.7s ease ${i * 0.15 + 0.2}s, transform 0.7s ease ${i * 0.15 + 0.2}s`;
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          if (ref.current) {
            ref.current.style.opacity   = "1";
            ref.current.style.transform = "translateY(0)";
          }
        })
      );
    });
  }, []);

  // Force play on iOS / low-power mode
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {});
  }, []);

  return (
    <section className="relative w-full min-h-[88vh] sm:min-h-screen flex items-center overflow-hidden bg-[#1a1f2e]">

      {/* ── Background video ───────────────────────────────── */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onCanPlay={() => setVideoLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ${
          videoLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <source src={heroBg} type="video/mp4" />
      </video>

      {/*
        ── Overlay ──────────────────────────────────────────
        Matches your screenshot: very light neutral veil so the
        machine/room is clearly visible, with just enough contrast
        for white text. NOT the heavy dark-blue from before.
      */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(15,22,45,0.62) 0%, rgba(15,22,45,0.42) 45%, rgba(10,16,35,0.68) 100%)",
        }}
      />

      {/* Subtle vignette edges */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(5,10,25,0.45) 100%)",
        }}
      />

      {/* ── Grain texture ────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ── Content ──────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8 py-20 sm:py-28">


        {/* Heading */}
        <h1
          ref={headingRef}
          className="text-[2.6rem] sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.08] tracking-tight max-w-2xl"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          Redefining{" "}
          <span className="relative inline-block">
            Skin
            <svg aria-hidden="true" className="absolute -bottom-1 left-0 w-full" height="6" viewBox="0 0 200 6" fill="none" preserveAspectRatio="none">
              <path d="M0 3 Q50 0 100 3 Q150 6 200 3" stroke="rgba(141,202,228,0.85)" strokeWidth="3" fill="none" strokeLinecap="round"/>
            </svg>
          </span>{" "}
          Smoothness
          <br />
          <span style={{ color: '#8dcae4' }}>At Your Convenience</span>
        </h1>

        {/* CTA */}
        <Link
          ref={ctaRef}
          to="/women-service"
          className="mt-7 sm:mt-8 inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#8dcae4] hover:bg-[#7abdd8] text-[#0f162d] font-semibold text-sm sm:text-base tracking-wide transition-colors duration-200"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          View Services
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>

      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 opacity-40">
        <span className="text-[10px] text-white tracking-widest uppercase" style={{ fontFamily: "'Outfit', sans-serif" }}>Scroll</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="animate-bounce text-white">
          <path d="M12 5v14M5 13l7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </section>
  );
}