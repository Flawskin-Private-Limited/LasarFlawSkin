import React, { useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight,Sparkles } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { rescheduleBooking } from "../firebase/bookingService";
import { getCurrentUserId } from "../utils/authSession";

const Reschedule = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingId = location.state?.bookingId;

  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [monthOffset, setMonthOffset] = useState(0);

  const baseDate = new Date(); // October
  const currentMonth = new Date(
    baseDate.getFullYear(),
    baseDate.getMonth() + monthOffset,
  );

  const monthName = currentMonth.toLocaleString("default", { month: "long" });
  const year = currentMonth.getFullYear();

  const days = [
    { day: "MON", date: 23 },
    { day: "TUE", date: 24 },
    { day: "WED", date: 25 },
    { day: "THU", date: 26 },
    { day: "FRI", date: 27 },
    { day: "SAT", date: 28 },
    { day: "SUN", date: 29 },
  ];

  const times = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
    "06:00 PM",
    "07:00 PM",
    "08:00 PM",
  ];

  const handleConfirm = async () => {
    if (!selectedDay || !selectedTime) {
      alert("Please select date and time");
      return;
    }

    const newDate = `${monthName} ${selectedDay}`;

    // If we have a real bookingId, update in Firestore
    if (bookingId) {
      try {
        await rescheduleBooking(getCurrentUserId(), bookingId, newDate, selectedTime);
      } catch (err) {
        console.error('Reschedule failed:', err);
      }
    }

    navigate("/my-booking", { state: { date: newDate, time: selectedTime } });
  };

  const prevMonth = () => {
    setMonthOffset(monthOffset - 1);
  };

  const nextMonth = () => {
    setMonthOffset(monthOffset + 1);
  };

  return (
    <>
        {/* Navbar */}
<div className="w-full bg-white ">
  <div className="w-full flex items-center justify-between px-[100px] py-3">

    {/* Logo */}
    <div className="flex items-center gap-2">
      <Sparkles className="text-sky-400" size={20} />
      <h1 className="font-semibold text-xl text-gray-800">
        LaserCare Premium
      </h1>
    </div>

    {/* Navigation */}
    <div className="flex items-center gap-6 text-sm text-gray-600 font-medium">

      <button
        onClick={() => navigate("/my-booking")}
        className="hover:text-gray-900 text-[15px] text-gray-500"
      >
        My Bookings
      </button>

      <button className="hover:text-gray-900 text-[15px] text-gray-500">
        Services
      </button>

      <button className="hover:text-gray-900 text-[15px] text-gray-500">
        Support
      </button>

      <img
        src="female.png"
        alt="profile"
        className="w-8 h-8 rounded-full"
      />

    </div>

  </div>
</div>

    <div className="min-h-screen bg-gray-100 px-4 md:px-10 py-6">
    
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}

        <p className="text-gray-500 text-sm">
          Home &gt;{" "}
          <span className="text-gray-700">Reschedule Appointment</span>
        </p>

        {/* Title */}

        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mt-2">
          Reschedule Your Appointment
        </h1>

        <p className="text-gray-500 mt-1">
          Select a new date and time slot for your premium home visit.
        </p>

        {/* Booking Card */}

        <div className="bg-white rounded-xl shadow-sm border p-6 mt-6">
          <div className="flex items-center gap-2 font-semibold text-gray-700 mb-4">
            <CalendarDays className="text-sky-400" size={18} />
           <h2 className="font-bold text-gray-800 text-lg"> Original Booking Details</h2>
          </div>

          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase">Service Name</p>

              <p className="font-medium text-lg text-gray-800">
                Laser Hair Reduction - Full Body
              </p>
            </div>

            <div>
              <p className="text-xs font-bold text-gray-400 uppercase">Old Date & Time</p>

              <p className="font-medium text-gray-800">
                October 24, 2023 at 10:00 AM
              </p>
            </div>
          </div>
        </div>

        {/* Schedule Card */}

        <div className="bg-white rounded-xl shadow-sm border p-6 mt-6">
          <h2 className="font-bold text-gray-700 text-lg">
            Select New Schedule
          </h2>

          {/* Month Navigation */}

          <div className="flex justify-between items-center mt-4">
            <p className="text-gray-500 text-sm font-medium uppercase">
              {monthName} {year}
            </p>

            <div className="flex gap-2">
              <button
                onClick={prevMonth}
                className="border  rounded p-1 hover:bg-gray-100"
              >
                <ChevronLeft size={16} />
              </button>

              <button
                onClick={nextMonth}
                className="border rounded p-1 hover:bg-gray-100"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Days */}

         <div className="flex gap-3  mt-4 overflow-x-auto pb-2">

  {days.map((item) => (

    <div
      key={item.date}
      onClick={() => setSelectedDay(item.date)}
    className={`min-w-[80px] cursor-pointer border-1 rounded-lg p-3 text-center transition-all duration-200 
${
  selectedDay === item.date
    ? "border-sky-400 text-sky-500 bg-sky-50"
    : "border-gray-200 bg-gray-50 hover:bg-gray-100"
}`}
    >

      <p className="text-xs">
        {item.day}
      </p>

      <p className="font-semibold">
        {item.date}
      </p>

    </div>

  ))}

</div>

          {/* Time Slots */}

          <p className="text-xs font-bold uppercase text-gray-400 mt-6 mb-3">
            Available Time Slots
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {times.map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`border rounded-lg py-3 text-sm transition
                ${
                  selectedTime === time
                    ? "bg-blue-400 text-white border-blue-400"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {time}
              </button>
            ))}
          </div>

          {/* Confirm Button */}

          <div className="flex justify-center mt-8">
            <button
              onClick={handleConfirm}
              className="bg-blue-400 hover:bg-blue-500 text-white px-8 md:px-12 py-3 rounded-lg shadow transition"
            >
              Confirm Reschedule
            </button>
          </div>

          <p className="text-center text-xs text-gray-400 mt-4">
            ⓘ 3-hour policy: Rescheduling within 3 hours of the appointment may
            incur a small fee.
          </p>
        </div>

        {/* Footer */}

        <p className="text-center text-gray-400 text-sm mt-10">
          © 2023 LaserCare Premium. All rights reserved.
        </p>
      </div>
    </div>
  </>
  );
};

export default Reschedule;
