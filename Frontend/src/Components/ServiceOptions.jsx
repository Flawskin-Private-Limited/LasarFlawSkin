import React from 'react';
import { Link } from 'react-router-dom';
import { HiBadgeCheck, HiShieldCheck, HiSparkles, HiHome } from 'react-icons/hi';
import maleIcon from '../assets/man.png';

const ServiceOptions = () => {
  const features = [
    {
      icon: <HiBadgeCheck />,
      label: 'Expertise',
      desc: 'Certified technicians with 10+ years experience.',
    },
    {
      icon: <HiShieldCheck />,
      label: 'Safety First',
      desc: 'FDA-approved tech & hygiene protocols.',
    },
    {
      icon: <HiSparkles />,
      label: 'Comfort',
      desc: 'Pain-free integrated cooling technology.',
    },
    {
      icon: <HiHome />,
      label: 'Convenience',
      desc: 'We bring clinic results to your home.',
    },
  ];

  const marqueeFeatures = [...features, ...features];

  return (
    <section className="w-full bg-gradient-to-b from-gray-50 to-white py-12 sm:py-16 lg:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
            Choose Your Treatment Path
          </h2>
          <p className="text-gray-500 text-sm sm:text-base lg:text-lg">
            Tailored laser solutions designed for different skin types and treatment
            areas.
          </p>
        </div>

        <div className="mb-10 sm:mb-16 lg:mb-20">
          <div className="split-animate split-float relative h-[420px] sm:h-[460px] lg:h-[360px] rounded-[2rem] overflow-hidden shadow-2xl transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_45px_-20px_rgba(15,23,42,0.45)]">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-200" />
            <div
              className="absolute inset-0 bg-gradient-to-br from-emerald-900/70 via-cyan-900/70 to-slate-900/75"
              style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}
            />

            <div className="split-mobile-left absolute top-8 left-4 sm:top-10 sm:left-8 lg:top-12 lg:left-12 w-[34%] sm:w-[42%] lg:w-[44%]">
              <div>
                <h3 className="inline-flex items-center gap-2 text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-2">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 268 511.71"
                    className="h-8 w-8 sm:h-9 sm:w-9 lg:h-11 lg:w-11 text-pink-600"
                    fill="currentColor"
                  >
                    <path d="M82.08 168.2L30.15 383.23h51.93v104.68c0 13.09 10.71 23.8 23.81 23.8 13.09 0 23.81-10.71 23.81-23.8V383.23h9.38v104.68c0 13.09 10.71 23.8 23.81 23.8 13.09 0 23.8-10.71 23.8-23.8V383.23h49l-49-209.44v-11.66h7.7l.54-.14 36.74 130.7c2.76 9.84 12.98 15.58 22.82 12.82s15.58-12.98 12.82-22.82l-37.23-132.43c-.22-.78-.48-1.54-.79-2.26-4.72-19.64-6.82-31.38-18.69-40.32-22.07-16.62-128.71-16.61-150.78.02C47 117.37 42.34 132.14 36.75 153l.37.09L.69 282.69c-2.76 9.84 2.98 20.06 12.82 22.82 9.84 2.76 20.06-2.98 22.82-12.82l36.75-130.73.68.17h8.32v6.07zM134.07 0c23.78 0 43.06 19.28 43.06 43.06s-19.28 43.05-43.06 43.05c-23.77 0-43.05-19.27-43.05-43.05C91.02 19.28 110.3 0 134.07 0z" />
                  </svg>
                  <span>Women</span>
                </h3>
                <p className="text-slate-700 text-base sm:text-lg lg:text-2xl leading-snug mb-4 lg:mb-6">
                  Silky smooth skin for all areas.
                </p>
                <Link
                  to="/women-service"
                  className="split-btn inline-block bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-sm sm:text-lg lg:text-2xl px-4 sm:px-6 lg:px-10 py-2 rounded-full transition-colors duration-200 animate-bounce"
                  style={{ animationDuration: '2s' }}
                >
                  Explore
                </Link>
              </div>
            </div>

            <div className="split-mobile-right absolute right-5 bottom-8 sm:right-8 sm:bottom-10 lg:right-12 lg:bottom-12 w-[44%] text-right">
              <div>
                <h3 className="inline-flex items-center justify-end gap-2 text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 w-full">
                  <img
                    src={maleIcon}
                    alt="Men"
                    className="h-8 w-8 sm:h-9 sm:w-9 lg:h-11 lg:w-11 object-contain"
                  />
                  <span>Men</span>
                </h3>
                <p className="text-white/90 text-base sm:text-lg lg:text-2xl leading-snug mb-5 lg:mb-6">
                  Precision grooming &amp; removal.
                </p>
                <Link
                  to="/men-service"
                  className="split-btn inline-block bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-sm sm:text-lg lg:text-2xl px-4 sm:px-6 lg:px-10 py-2 rounded-full transition-colors duration-200 animate-bounce"
                  style={{ animationDuration: '2s' }}
                >
                  Explore
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 sm:mt-12 w-full bg-gray-50 border-y border-gray-200 py-6 sm:py-8 md:py-12">
        <div className="w-full px-6 md:px-10 lg:px-12">
          <div className="features-scroll overflow-x-auto lg:overflow-visible pb-2">
            <div className="features-track flex gap-6 min-w-max lg:min-w-0 lg:w-full lg:flex-nowrap">
              {marqueeFeatures.map((f, index) => (
                <div
                  key={`${f.label}-${index}`}
                  className="group feature-card w-72 lg:w-1/4 flex-shrink-0 rounded-[1.75rem] border border-slate-200 bg-[#f8fafc] px-6 py-7 text-center shadow-[0_10px_30px_-18px_rgba(15,23,42,0.28)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-24px_rgba(15,23,42,0.35)]"
                >
                  <div
                    className="feature-icon mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e7f1f8] text-3xl transition-transform duration-300 group-hover:scale-110"
                    style={{ color: '#8dcae4' }}
                  >
                    {f.icon}
                  </div>
                  <h4 className="mb-2 text-lg font-semibold tracking-tight text-slate-900">{f.label}</h4>
                  <p className="text-sm leading-6 text-slate-500">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes splitFadeUp {
            from {
              opacity: 0;
              transform: translateY(18px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .split-animate {
            animation: splitFadeUp 600ms ease-out both;
          }

          .split-animate-delay {
            animation-delay: 120ms;
          }

          @keyframes splitFloat {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-2px); }
          }

          .split-float {
            animation: splitFadeUp 600ms ease-out both, splitFloat 5s ease-in-out 800ms infinite;
          }

          .split-btn {
            transition: transform 220ms ease, box-shadow 220ms ease, background-color 220ms ease;
          }

          .split-btn:hover {
            transform: translateY(-1px) scale(1.03);
            box-shadow: 0 10px 20px -10px rgba(14, 165, 233, 0.9);
          }

          .feature-card:hover .feature-icon {
            transform: scale(1.12) rotate(-6deg);
          }

          @keyframes splitSlideLeft {
            from {
              opacity: 0;
              transform: translateX(-18px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes splitSlideRight {
            from {
              opacity: 0;
              transform: translateX(18px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes marquee {
            0% {
              transform: translate3d(0, 0, 0);
            }
            100% {
              transform: translate3d(-50%, 0, 0);
            }
          }

          @media (max-width: 767px) {
            .split-mobile-left {
              animation: splitSlideLeft 520ms ease-out both;
            }

            .split-mobile-right {
              animation: splitSlideRight 520ms ease-out 80ms both;
            }
          }

          @media (max-width: 1023px) {
            .features-track {
              animation: marquee 22s linear infinite;
              width: fit-content;
              will-change: transform;
            }

            .features-scroll {
              overflow-x: auto;
              -webkit-overflow-scrolling: touch;
              scroll-behavior: smooth;
              scrollbar-width: none;
              -ms-overflow-style: none;
            }

            .features-scroll::-webkit-scrollbar {
              display: none;
            }
          }

          @media (min-width: 1024px) {
            .features-track {
              display: flex;
              animation: none;
              width: 100%;
            }

            .features-track > :nth-child(n+5) {
              display: none;
            }

            .features-scroll {
              overflow-x: visible;
            }

            .features-scroll::-webkit-scrollbar {
              display: none;
            }

            .features-scroll {
              scrollbar-width: none;
            }
          }

          @media (max-width: 480px) {
            .split-mobile-left {
              left: 0.9rem;
              width: 33%;
            }

            .split-mobile-right {
              right: 1rem;
              width: 45%;
            }
          }
        `}
      </style>
    </section>
  );
};

export default ServiceOptions;
