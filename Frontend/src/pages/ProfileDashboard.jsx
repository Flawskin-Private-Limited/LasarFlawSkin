import React, { useState } from "react";
import { LuMessageSquareText } from "react-icons/lu";
import { LuLayoutDashboard, LuMenu, LuX } from "react-icons/lu";
import { BsBrightnessHigh } from "react-icons/bs";
import { MdSupportAgent } from "react-icons/md";
import { CgGirl } from "react-icons/cg";
import { MdLogout } from "react-icons/md";
import { NavLink, useNavigate } from "react-router-dom";
import { MdOutlineLightMode } from "react-icons/md";
import { PhoneArrowDownLeftIcon } from "@heroicons/react/24/outline";
import { getStoredProfile } from "../utils/profileData";
import { clearAuthSession, getCurrentUserId } from "../utils/authSession";
import { auth } from "../firebase/config";
import { signOut } from "firebase/auth";
import {
  CalendarDaysIcon,
  ChevronRightIcon,
  MapPinIcon,
  BellIcon,
  Cog6ToothIcon,
  PhoneIcon,
  HomeIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";

  const ProfileDashboard = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profile, setProfile] = useState(() => getStoredProfile());
  const [bookings, setBookings] = useState([]);
  const [address, setAddress] = useState(null);

  React.useEffect(() => {
    const userId = getCurrentUserId();
    if (!userId || userId === 'guest_user') return;

    let unsubs = [];
    let isMounted = true;

    const setupListeners = async () => {
      try {
        const { onProfileChange } = await import('../firebase/profileService');
        if (!isMounted) return;
        const u1 = onProfileChange(userId, (data) => {
          if (data) {
            setProfile(data);
            localStorage.setItem('profileData', JSON.stringify(data));
          }
        });
        unsubs.push(u1);

        const { onUserBookingsChange } = await import('../firebase/bookingService');
        if (!isMounted) return;
        const u2 = onUserBookingsChange(userId, setBookings);
        unsubs.push(u2);
      } catch (err) {
        console.error("Error setting up listeners:", err);
      }
    };

    setupListeners();

    import('../firebase/addressService').then(({ getDefaultAddress }) => {
      if (!isMounted) return;
      getDefaultAddress(userId).then(setAddress).catch(() => setAddress(null));
    });

    return () => {
      isMounted = false;
      unsubs.forEach(fn => fn && fn());
    };
  }, []);

  const handleLogout = () => {
    clearAuthSession();
    signOut(auth).catch(() => {});
    localStorage.removeItem('profileData');
    navigate('/sign-in');
  };

  return (
    <>
      <div className="lg:hidden min-h-screen bg-[#f3f5f7] px-4 pt-8 pb-8">
        <div className="mx-auto w-full max-w-sm">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <img
                src={profile?.image || "/female.png"}
                className="w-24 h-24 rounded-full object-cover border-4 border-sky-100"
                alt="profile"
              />
              <button
                className="absolute right-0 bottom-0 w-7 h-7 rounded-full bg-sky-400 text-white border-2 border-white flex items-center justify-center"
                aria-label="Edit profile image"
                onClick={() => navigate("/ProfileSettings")}
              >
                <PencilSquareIcon className="w-3.5 h-3.5" />
              </button>
            </div>
            <h1 className="mt-4 text-3xl font-bold text-slate-800 leading-none">
              {profile?.fullName || "Sarah Johnson"}
            </h1>
            <div className="mt-2 flex items-center gap-2 text-xs font-semibold tracking-wide text-slate-400 uppercase">
              <span className="w-4 h-4 rounded-full border border-sky-400 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-2.5 h-2.5 text-sky-400"
                >
                  <path d="M12 2l2.9 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 7.1-1.01L12 2z" />
                </svg>
              </span>
              PREMIUM MEMBER
            </div>
          </div>

          <div className="mt-8 bg-[#ebeff3] rounded-2xl p-2">
            <MobileMenuItem
              icon={<CgGirl className="w-5 h-5 text-sky-500" />}
              label="Edit Profile"
              onClick={() => navigate("/ProfileSettings")}
            />
            <MobileMenuItem
              icon={<CalendarDaysIcon className="w-5 h-5 text-sky-500" />}
              label="My Bookings"
              onClick={() => navigate("/my-booking")}
            />
            <MobileMenuItem
              icon={<MapPinIcon className="w-5 h-5 text-sky-500" />}
              label="Manage Addresses"
              onClick={() => navigate("/save-address")}
            />
            <MobileMenuItem
              icon={<MdSupportAgent className="w-5 h-5 text-sky-500" />}
              label="Help & Support"
              onClick={() => navigate("/contact")}
            />
          </div>

          <SectionHeader
            title="RECENT TREATMENTS"
            actionLabel="See All"
            onAction={() => navigate("/my-booking")}
            className="mt-8"
          />
          <div className="space-y-3">
            {bookings.length === 0 ? (
              <div className="text-xs text-slate-400">No bookings found.</div>
            ) : (
              bookings.slice(0, 2).map((item, index) => (
                <MobileTreatmentCard
                  key={item.id}
                  title={item.serviceName || item.title}
                  date={item.date}
                  time={item.timeSlot || item.time}
                  status={item.status}
                  tone={item.status === 'completed' ? 'neutral' : 'success'}
                  icon={<MdOutlineLightMode className="w-5 h-5 text-sky-500" />}
                  featured={index === 0}
                />
              ))
            )}
          </div>

          <SectionHeader title="PRIMARY LOCATION" className="mt-6" />
          <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
              <HomeIcon className="w-5 h-5 text-sky-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-slate-800">Home Address</h3>
              <p className="text-xs text-slate-500 mt-1">
                {address ? (
                  <>
                    {address.fullAddress || [address.house, address.building, address.landmark, address.selectedAddress].filter(Boolean).join(', ')}
                  </>
                ) : (
                  <span className="text-slate-400">No address found.</span>
                )}
              </p>
            </div>
            <button
              onClick={() => navigate("/save-address")}
              className="text-sky-500"
              aria-label="Edit address"
            >
              <PencilSquareIcon className="w-5 h-5" />
            </button>
          </div>

          <SectionHeader title="QUICK SUPPORT" className="mt-6" />
          <div className="grid grid-cols-3 gap-2">
            <MiniSupportButton
              icon={<LuMessageSquareText className="w-4 h-4 text-green-500" />}
              label="WhatsApp"
              onClick={() => window.open("https://wa.me/1234567890", "_blank")}
            />
            <MiniSupportButton
              icon={<PhoneIcon className="w-4 h-4 text-blue-500" />}
              label="Concierge"
              onClick={() => navigate("/contact")}
            />
            <MiniSupportButton
              icon={<PhoneArrowDownLeftIcon className="w-4 h-4 text-sky-500" />}
              label="Request Call"
              onClick={() => navigate("/request-callback")}
            />
          </div>

          <button
            onClick={handleLogout}
            className="mt-6 w-full h-12 rounded-xl bg-red-50 text-red-500 font-medium flex items-center justify-center gap-2"
          >
            <MdLogout className="w-4 h-4" />
            Logout Account
          </button>

          <div className="mt-8 flex items-center justify-center gap-3">
            <span className="h-px w-16 bg-slate-300" />
            <div className="w-7 h-7 rounded-lg bg-[#8dcae4] flex items-center justify-center shadow-sm">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07"
                  stroke="white"
                  strokeWidth="2.3"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span className="h-px w-16 bg-slate-300" />
          </div>
        </div>
      </div>

      <div className={`hidden lg:flex relative h-screen overflow-hidden bg-blue-50`}>
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 h-full z-50 w-65aa md:w-65 border-r flex flex-col justify-between p-6 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } bg-white border-gray-200`}
      >
        <div>
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-2">
              <button
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 transition-colors bg-sky-400`}
                aria-label="Theme mode"
              >
                <BsBrightnessHigh />
              </button>
              <h1
                className={`font-bold text-lg hidden sm:block text-slate-800`}
              >
                LASERSMOOTH
              </h1>
            </div>
            {/* Close sidebar button mapped only to mobile displays */}
            <button
              className={`lg:hidden hover:text-gray-500 text-gray-500`}
              onClick={() => setIsSidebarOpen(false)}
            >
              <LuX className="w-6 h-6" />
            </button>
          </div>

          <nav className="space-y-3">
            <NavLink
              to="/profile-dashboard"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-3 rounded-full font-medium transition-all ${
                  isActive
                    ? "bg-sky-400 text-white"
                    : "hover:bg-sky-400 hover:text-white text-gray-600"
                }`
              }
            >
              <LuLayoutDashboard className="w-5 h-5" />
              Dashboard Overview
            </NavLink>

            <NavLink
              to="/my-booking"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-full font-medium cursor-pointer transition-all ${
                  isActive
                    ? "bg-sky-400 text-white"
                    : "hover:bg-sky-400 hover:text-white text-gray-600"
                }`
              }
            >
              <CalendarDaysIcon className="w-5 h-5" />
              My Bookings
            </NavLink>

            <NavLink
              to="/save-address"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-full font-medium cursor-pointer transition-all ${
                  isActive
                    ? "bg-sky-400 text-white"
                    : "hover:bg-sky-400 hover:text-white text-gray-600"
                }`
              }
            >
              <MapPinIcon className="w-5 h-5" />
              Manage Addresses
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-full font-medium cursor-pointer transition-all ${
                  isActive
                    ? "bg-sky-400 text-white"
                    : "hover:bg-sky-400 hover:text-white text-gray-600"
                }`
              }
            >
              <MdSupportAgent className="w-5 h-5" />
              Help & Support
            </NavLink>
          </nav>
        </div>

        <div
          onClick={handleLogout}
          className={`flex items-center font-medium gap-2 text-red-500 cursor-pointer p-3 rounded-xl transition-colors mt-auto hover:bg-red-50`}
        >
          <MdLogout className="w-5 h-5 shrink-0" />
          Logout Account
        </div>
      </aside>

      {/* Main Content */}

      <div className="flex-1 flex flex-col h-screen overflow-y-auto">

        {/* Header */}
        
    {/* DESKTOP HEADER */}

<header className="hidden lg:flex border-b px-4 sm:px-6 md:px-10 py-3 sm:py-4 md:py-6 justify-between items-center sticky top-0 z-30 bg-white border-gray-200">

  {/* LEFT SIDE */}

  <div className="flex items-center gap-4">

    <div className="relative">

      <img
        src={profile?.image || "/female.png"}
        className="w-14 h-14 rounded-full object-cover border-4 border-blue-100"
        alt="profile"
      />

      <button 
        className="absolute -bottom-1 -right-1 w-6 h-6 bg-sky-400 rounded-full flex items-center justify-center border-2 border-white cursor-pointer hover:bg-sky-500"
        onClick={() => navigate("/ProfileSettings")}
        aria-label="Edit profile image"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-3 h-3 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      </button>

    </div>

    <div>

      <h2 className="text-xl font-semibold text-slate-800">
        {profile?.fullName}
      </h2>

      <div className="flex items-center gap-2 text-sm uppercase text-gray-400">

        <span className="w-5 h-5 flex items-center justify-center border-2 border-sky-400 rounded-full">

          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-3 h-3 text-sky-400"
          >
            <path d="M12 2l2.9 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 7.1-1.01L12 2z"/>
          </svg>

        </span>

        PREMIUM MEMBER

      </div>

    </div>

  </div>



  {/* RIGHT ICONS */}

  <div className="flex items-center gap-4">

    <div className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-600 transition">
      <BellIcon className="w-5 h-5" />
    </div>

    <div
      onClick={() => navigate("/ProfileSettings")}
      className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
    >
      <Cog6ToothIcon className="w-5 h-5" />
    </div>

  </div>

</header>

      {/* Content Area */}
        <div className="hidden lg:flex flex-col lg:flex-row gap-6 md:gap-10 p-4 md:p-10">
          {/* Left Side */}
          <div className="flex-1 w-full lg:max-w-none">
            {/* Recent Treatments */}
            <div className="flex justify-between items-center mb-4 md:mb-6">
              <h4
                className={`text-sm font-medium tracking-widest text-gray-400`}
              >
                RECENT TREATMENTS
              </h4>
              <span
                onClick={() => navigate("/my-booking")}
                className={`text-sm cursor-pointer hover:underline font-medium text-sky-500`}
              >
                View History
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 mb-8 md:mb-10 w-full">
              {bookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center w-full bg-white rounded-2xl p-8 border border-dashed border-gray-200">
                  <svg className="w-20 h-20 text-gray-200 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-500 font-medium">No recent bookings found</p>
                  <button onClick={() => navigate('/women-service')} className="mt-4 px-6 py-2 bg-sky-50 text-sky-500 hover:bg-sky-100 hover:text-sky-600 font-semibold rounded-full transition">Book New Service</button>
                </div>
              ) : (
                bookings.slice(0, 2).map((item, index) => (
                  <div key={item.id} className={`flex-1 w-full p-4 md:p-6 rounded-2xl shadow-sm relative transition-colors ${index === 0 ? 'bg-gradient-to-r from-sky-50 to-white border border-sky-100' : 'bg-white border border-slate-100'}`}>
                    <div className="flex gap-3 md:gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shrink-0 bg-white shadow-sm border border-sky-50">
                        {index % 2 === 0 ? <MdOutlineLightMode className="w-5 h-5 md:w-6 md:h-6 text-sky-500" /> : <CgGirl className="w-5 h-5 md:w-7 md:h-7 text-sky-400" />}
                      </div>
                      <div className="pr-16">
                        <h3 className="font-semibold text-sm md:text-base text-slate-800">{item.serviceName || item.title || 'Service'}</h3>
                        <p className="text-xs mt-1 text-gray-400">{item.date} • {item.timeSlot || item.time}</p>
                      </div>
                    </div>
                    <span className={`absolute top-4 right-4 md:top-6 md:right-6 text-[10px] md:text-xs font-semibold px-2 py-1 md:px-3 md:py-1 rounded-full ${item.status === 'completed' ? 'bg-slate-100 text-slate-600' : 'bg-emerald-100 text-emerald-700'}`}>
                      {(item.status || "CONFIRMED").toUpperCase()}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Primary Location */}
            <h4
              className={`text-sm font-medium tracking-widest mb-4 md:mb-6 text-gray-400`}
            >
              PRIMARY LOCATION
            </h4>

            <div
              className={`p-5 md:p-8 rounded-2xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors bg-white`}
            >
              <div className="flex gap-3 md:gap-4">
                <div
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shrink-0 bg-gray-100`}
                >
                  <HomeIcon className={`w-5 h-5 md:w-6 md:h-6 text-sky-500`} />
                </div>

                <div>
                  <h3
                    className={`font-semibold mb-1 md:mb-2 text-sm md:text-base text-slate-800`}
                  >
                    Home Address
                  </h3>
                  <p className={`text-xs md:text-sm text-gray-500`}>
                    {address ? (
                      <>
                        {address.fullAddress || [address.house, address.building, address.landmark, address.selectedAddress].filter(Boolean).join(', ')}
                      </>
                    ) : (
                      <span className="italic text-gray-400">No address saved yet. We will ask you when you checkout.</span>
                    )}
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate("/save-address")}
                className={`flex w-full sm:w-auto items-center justify-center gap-2 px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-colors bg-sky-50 hover:bg-sky-100 text-sky-500`}
              >
                <PencilSquareIcon className="w-4 h-4" />
                Edit Address
              </button>
            </div>
          </div>

          {/* Right Side */}
          <div className="w-full lg:w-80">
            <h4
              className={`text-sm font-medium tracking-widest mb-4 md:mb-6 text-gray-400`}
            >
              QUICK SUPPORT
            </h4>

            <div className="space-y-5">
              <SupportCard
                icon={
                  <LuMessageSquareText
                    className={`w-6 h-6 stroke-2 text-green-500`}
                  />
                }
                title="WhatsApp Support"
                desc="Chat with our team instantly"
                onClick={() =>
                  window.open("https://wa.me/1234567890", "_blank")
                }
              />

              <SupportCard
                icon={
                  <PhoneIcon className={`w-6 h-6 stroke-2 text-blue-500`} />
                }
                title="Concierge Desk"
                desc="Priority assistance for members"
                onClick={() => navigate("/contact")}
              />

              <SupportCard
              icon={
  <PhoneArrowDownLeftIcon
    className="w-6 h-6 stroke-2 text-sky-500"
  />
}
                title="Request a Call"
                desc="We'll call you back at your time"
                onClick={() => navigate("/request-callback")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

/* Support Card Component */
function SupportCard({ icon, title, desc, onClick }) {
  return (
    <div
      className={`p-6 rounded-2xl shadow-sm flex gap-4 items-center transition-all ${
        onClick ? "cursor-pointer hover:shadow-md active:scale-95" : ""
      } bg-white`}
      onClick={onClick}
    >
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 bg-gray-100`}
      >
        {icon}
      </div>
      <div>
        <h3 className={`font-semibold text-slate-800`}>{title}</h3>
        <p className={`text-sm text-gray-500`}>{desc}</p>
      </div>
    </div>
  );
}

function MobileMenuItem({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full h-14 px-3 rounded-xl flex items-center gap-3 text-left hover:bg-white/60 transition"
    >
      <span className="w-5 h-5 shrink-0">{icon}</span>
      <span className="text-[15px] font-medium text-slate-700">{label}</span>
      <ChevronRightIcon className="w-4 h-4 ml-auto text-slate-400" />
    </button>
  );
}

function SectionHeader({ title, actionLabel, onAction, className = "" }) {
  return (
    <div className={`mb-3 flex items-center justify-between ${className}`}>
      <h4 className="text-xs font-semibold tracking-[0.2em] text-slate-400">{title}</h4>
      {actionLabel ? (
        <button onClick={onAction} className="text-xs font-semibold text-sky-500">
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

function MiniSupportButton({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="h-20 bg-[#ebeff3] rounded-xl flex flex-col items-center justify-center gap-1 text-slate-700"
    >
      {icon}
      <span className="text-[11px] font-medium">{label}</span>
    </button>
  );
}

function MobileTreatmentCard({
  title,
  date,
  time,
  status,
  tone,
  icon,
  featured = false,
}) {
  const statusStyles =
    tone === "success"
      ? "bg-emerald-100 text-emerald-700"
      : "bg-slate-200 text-slate-600";

  return (
    <div
      className={`rounded-2xl border p-4 ${
        featured
          ? "bg-gradient-to-r from-sky-50 to-white border-sky-100 shadow-sm"
          : "bg-white border-slate-100"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-full bg-white border border-sky-100 flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-slate-800 truncate">{title}</h3>
          <p className="text-xs text-slate-500 mt-1">
            {date} • {time}
          </p>
        </div>
        <span className={`ml-auto text-[10px] font-semibold px-2.5 py-1 rounded-full ${statusStyles}`}>
          {status}
        </span>
      </div>
    </div>
  );
}

export default ProfileDashboard;
