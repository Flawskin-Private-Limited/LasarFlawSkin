
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, RotateCcw, Settings, 
  Sun, User, Trash, CheckCircle2, 
  XCircle, Clock, MapPin, MapPinPlus,
  HelpCircle, ChevronRight, Home,
  MessageSquare, Phone, PhoneCall,
  LogOut, Camera, Star, Menu
} from 'lucide-react';
import { getStoredProfile } from "../utils/profileData";
import { deleteBooking, getUserBookings, onUserBookingsChange, cancelBooking } from "../firebase/bookingService";
import { getCurrentUserId } from "../utils/authSession";

function toBookingUi(booking) {
  const rawStatus = String(booking.status || 'upcoming').toLowerCase();
  const isCancelled = rawStatus === 'cancelled';
  const isCompleted = rawStatus === 'completed';

  return {
    id: booking.id,
    title:
      booking.serviceName ||
      booking.services?.[0]?.name ||
      booking.title ||
      'Laser Treatment',
    date: booking.date || 'Date not selected',
    time: booking.timeSlot || booking.time || '',
    status: isCancelled ? 'Cancelled' : isCompleted ? 'Done' : 'Confirmed',
    type: isCancelled ? 'XCircle' : isCompleted ? 'CheckCircle2' : 'Sun',
    tab: isCancelled ? 'Cancelled' : isCompleted ? 'Completed' : 'Upcoming',
    isReschedulable: !isCancelled && !isCompleted,
  };
}

const MyBooking = () => {
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [menuActive, setMenuActive] = useState("All Bookings");
  const [showSidebar, setShowSidebar] = useState(false);
  const [userProfile] = useState(() => {
    const profile = getStoredProfile();
    return {
      name: profile.fullName || "Sarah Johnson",
      gender: (profile.gender || "Female").toLowerCase(),
      image: profile.image || "/female.png",
      type: "Premium Member",
    };
  });

  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const userId = getCurrentUserId();
    if (!userId || userId === 'guest_user') return;

    const unsub = onUserBookingsChange(userId, (rows) => {
      setBookings(rows.map(toBookingUi));
    });

    return () => {
      if (unsub) unsub();
    };
  }, []);

  const handleCancelOrDelete = async (booking) => {
    try {
      if (typeof booking.id === 'string' && booking.id.length > 10) {
        if (booking.tab === "Upcoming") {
          // Cancel instead of deleting
          await cancelBooking(getCurrentUserId(), booking.id);
          
          // Update local state properly
          setBookings(prev => prev.map(b => 
            b.id === booking.id 
              ? { ...b, status: 'Cancelled', tab: 'Cancelled', type: 'XCircle', isReschedulable: false } 
              : b
          ));
        } else {
          // If already cancelled or done, we can delete the history record
          await deleteBooking(getCurrentUserId(), booking.id);
          setBookings(prev => prev.filter(b => b.id !== booking.id));
        }
      }
    } catch (e) {
      console.error("Action failed:", e);
    }
  };

  const currentBookings = bookings.filter((b) => b.tab === activeTab);

  const renderIcon = (type) => {
    switch (type) {
      case "Sun":
        return (
          <div className="h-11 w-11 sm:h-14 sm:w-14 rounded-full bg-sky-50 flex items-center justify-center text-sky-400 shrink-0">
            <Sun className="h-7 w-7" />
          </div>
        );
      case "User":
        return (
          <div className="h-11 w-11 sm:h-14 sm:w-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
            <User className="h-7 w-7" />
          </div>
        );
      case "CheckCircle2":
        return (
          <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        );
      case "XCircle":
        return (
          <div className="h-10 w-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
            <XCircle className="h-5 w-5" />
          </div>
        );
      default:
        return null;
    }
  };

  const renderBookingCard = (booking, isSmall = false) => {
    if (isSmall) {
      return (
        <div
          key={booking.id}
         className={`bg-white p-4 sm:p-5 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${booking.tab === "Cancelled" ? "opacity-80 border-dashed transition-opacity" : ""}`}
        >
          <div className="flex items-center gap-4">
            {renderIcon(booking.type)}
            <div>
              <h4 className="text-[15px] font-semibold text-slate-800 mb-0.5">
                {booking.title}
              </h4>
              <div className="text-[13px] text-slate-400">
                {booking.date} • {booking.time}
              </div>
            </div>
          </div>
          <span
            className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider
            ${booking.status === "Confirmed" ? "bg-sky-50 text-sky-500" : ""}
            ${booking.status === "Starting Soon" ? "bg-amber-50 text-amber-500" : ""}
            ${booking.status === "Done" ? "bg-emerald-50 text-emerald-500" : ""}
            ${booking.status === "Cancelled" ? "bg-rose-50 text-rose-500" : ""}
          `}
          >
            {booking.status}
          </span>
        </div>
      );
    }

    return (
      <div
        key={booking.id}
        className={`bg-white p-5 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${booking.tab === "Cancelled" ? "opacity-80 border-dashed transition-opacity" : ""}`}
      >
        <div className="flex items-center gap-5">
          {renderIcon(booking.type)}
          <div>
            <h4 className="text-[15px] sm:text-[17px]font-semibold text-slate-800 mb-1.5">
              {booking.title}
            </h4>
            <div className="flex flex-wrap items-center gap-3 md:gap-4 text-[13px] text-slate-500">
              <div
                className={`flex items-center gap-1.5 ${booking.status === "Starting Soon" ? "text-amber-500" : ""}`}
              >
                <Calendar
                  className={`h-4 w-4 ${booking.status === "Starting Soon" ? "text-amber-500" : ""}`}
                />
                {booking.date}
              </div>
              {booking.time && (
                <div
                  className={`flex items-center gap-1.5 ${booking.status === "Starting Soon" ? "text-amber-500" : ""}`}
                >
                  <Clock
                    className={`h-4 w-4 ${booking.status === "Starting Soon" ? "text-amber-500" : ""}`}
                  />
                  {booking.time}
                </div>
              )}
              <span
                className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider
                    ${booking.status === "Confirmed" ? "bg-sky-50 text-sky-500" : ""}
                    ${booking.status === "Starting Soon" ? "bg-amber-50 text-amber-500" : ""}
                    ${booking.status === "Done" ? "bg-emerald-50 text-emerald-500" : ""}
                    ${booking.status === "Cancelled" ? "bg-rose-50 text-rose-500" : ""}
                  `}
              >
                {booking.status}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-0">
          {booking.isReschedulable && (
            <button
              onClick={() =>
                navigate("/select-slots", {
                  state: { source: "my-booking", bookingId: booking.id },
                })
              }
              className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-2.5 text-[13px] sm:text-sm font-medium rounded-full transition-colors bg-sky-400 hover:bg-sky-500 text-white"
            >
              Reschedule
            </button>
          )}
          <button
            onClick={() => handleCancelOrDelete(booking)}
            className="p-2 sm:p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-colors bg-slate-50 sm:bg-transparent shrink-0"
            title={booking.tab === 'Upcoming' ? 'Cancel Booking' : 'Delete History'}
          >
            <Trash className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white lg:bg-slate-50/30 p-4 sm:p-8 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto">
        {/* Header - Visible on Desktop, Hidden on Mobile */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            {/* Mobile Toggle Button */}
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="lg:hidden p-2 rounded-lg border border-slate-200"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-3xl font-bold text-slate-900 mb-1.5">
              My Bookings
            </h1>
            <p className="text-slate-500 text-sm">
              Manage and track your laser hair reduction treatments.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Profile Badge */}
            <div className="flex items-center gap-3 bg-white p-2 pr-5 rounded-full border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
              <div className="h-10 w-10 rounded-full overflow-hidden bg-slate-200">
                <img
                  src={userProfile.image || (userProfile.gender === "male" ? "/men.png" : "/female.png")}
                  alt={userProfile.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <div className="font-semibold text-sm text-slate-800">
                  {userProfile.name}
                </div>
                <div className="text-[10px] font-bold text-sky-500 flex items-center gap-1 uppercase tracking-wider">
                  <div className="h-1.5 w-1.5 rounded-full bg-sky-400"></div>{" "}
                  {userProfile.type}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- MAIN CONTENT DESKTOP VIEW --- */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className={`${showSidebar ? "block" : "hidden"} lg:block w-full lg:w-64 shrink-0`}>
            <div className="bg-white rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100 py-4 flex flex-col relative overflow-hidden">
              <button
              onClick={() => {
  setMenuActive("All Bookings");
  setShowSidebar(false);
}}
                className={`flex items-center gap-3 px-6 py-3.5 text-sm font-medium transition-colors w-full relative ${
                  menuActive === "All Bookings"
                    ? "text-sky-500 bg-sky-50/50"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                {menuActive === "All Bookings" && (
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-sky-400 rounded-l-full" />
                )}
                <Calendar className="h-5 w-5" />
                All Bookings
              </button>

              <button
              onClick={() => {
  setMenuActive("Treatment History");
  setShowSidebar(false);
}}
                className={`flex items-center gap-3 px-6 py-3.5 text-sm font-medium transition-colors w-full relative ${
                  menuActive === "Treatment History"
                    ? "text-sky-500 bg-sky-50/50"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                {menuActive === "Treatment History" && (
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-sky-400 rounded-l-full" />
                )}
                <RotateCcw className="h-5 w-5" />
                Treatment History
              </button>

              <button
               onClick={() => {
  setMenuActive("Preferences");
  setShowSidebar(false);
}}
                className={`flex items-center gap-3 px-6 py-3.5 text-sm font-medium transition-colors w-full relative ${
                  menuActive === "Preferences"
                    ? "text-sky-500 bg-sky-50/50"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                {menuActive === "Preferences" && (
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-sky-400 rounded-l-full" />
                )}
                <Settings className="h-5 w-5" />
                Preferences
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            {/* Tabs */}
            <div className="flex items-center gap-4 sm:gap-8 border-b border-slate-200 mb-8 pl-1 overflow-x-auto whitespace-nowrap no-scrollbar pb-1">
              {["Upcoming", "Completed", "Cancelled"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 text-sm font-medium transition-colors relative ${
                    activeTab === tab
                      ? "text-sky-500"
                      : "text-slate-400 hover:text-slate-700"
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-sky-400 rounded-t-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Tab content wrapper */}
           <div className="space-y-3 sm:space-y-4">
              {currentBookings.length === 0 ? (
                <div className="bg-white rounded-[24px] shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100 p-12 flex flex-col items-center justify-center text-center min-h-[500px]">
                  <svg className="w-32 h-32 text-slate-200 mb-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">
                    No {activeTab} Bookings
                  </h2>
                  <p className="text-slate-500 mb-8 max-w-[340px]">
                    You don't have any {activeTab.toLowerCase()} appointments
                    right now.
                  </p>
                  <button
                    onClick={() => navigate("/women-service")}
                    className="px-6 py-3 bg-sky-400 hover:bg-sky-500 text-white font-medium rounded-full transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Calendar className="w-5 h-5" />
                    Schedule Now
                  </button>
                </div>
              ) : (
               <div className="space-y-3 sm:space-y-4">
                  {currentBookings.map((b) => renderBookingCard(b, false))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer - Desktop Only */}
        <div className="hidden lg:flex mt-16 pt-8 border-t border-slate-200 flex-col md:flex-row items-center justify-between gap-6 text-[13px] text-slate-400">
          <div className="flex items-center gap-2 font-bold text-slate-800 text-lg">
            <div className="h-7 w-7 rounded-sm bg-sky-400 text-white flex items-center justify-center shadow-sm">
              <Sun className="h-4 w-4" />
            </div>
            LaserSmooth
          </div>
          <div>© 2023 Premium Laser Aesthetics. All rights reserved.</div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-800 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-slate-800 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MyBooking;
