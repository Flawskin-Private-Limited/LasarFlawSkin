import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Sun, Sunset, Sunrise, Clock } from "lucide-react";  
import Cart from "./Cart";
import { onSlotsChange } from "../firebase/slotService";
import { rescheduleBooking } from "../firebase/bookingService";
import { getCurrentUserId } from "../utils/authSession";
import { toast } from "sonner";

export default function SelectSlots() {
  const navigate = useNavigate();
  const location = useLocation();
  const source = location.state?.source || "cart-checkout";
  const bookingId = location.state?.bookingId;

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [confirmedSlot, setConfirmedSlot] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("bookingDetails"));
      return saved?.time || null;
    } catch (error) {
      return null;
    }
  });

  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [slotsData, setSlotsData] = useState(null);
  const [slotsLoading, setSlotsLoading] = useState(false);

  // Helper to check if a slot is expired (for today's dates)
  const isSlotExpired = (timeStr) => {
    if (!selectedDate) return false;
    
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const target = new Date(selectedDate);
    target.setHours(0, 0, 0, 0);

    // If it's a future date, it's not expired
    if (target.getTime() > today.getTime()) return false;
    
    // If it's a past date, everything is expired
    if (target.getTime() < today.getTime()) return true;

    // It's today, check the time
    try {
      const [time, modifier] = timeStr.split(' ');
      let [hours, minutes] = time.split(':');
      hours = parseInt(hours);
      minutes = parseInt(minutes || 0);

      if (modifier === 'PM' && hours < 12) hours += 12;
      if (modifier === 'AM' && hours === 12) hours = 0;

      const slotTime = new Date();
      slotTime.setHours(hours, minutes, 0, 0);

      // Give 15 mins buffer
      return now.getTime() > (slotTime.getTime() - 15 * 60 * 1000);
    } catch (e) {
      return false;
    }
  };

  const dates = useMemo(() => {
    return [...Array(6)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      return d;
    });
  }, []);

  useEffect(() => {
    if (!selectedDate) return;
    const dateKey = selectedDate.toISOString().split("T")[0];
    
    setSlotsLoading(true);
    const unsub = onSlotsChange(dateKey, (data) => {
      setSlotsData(data);
      setSlotsLoading(false);
    });

    setSelectedSlot(null);
    setConfirmedSlot(null);

    return () => {
      if (unsub) unsub();
    };
  }, [selectedDate]);

  const defaultSlotGroups = {
    Morning: ["9:00 AM", "10:00 AM", "11:00 AM"],
    Afternoon: ["12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM"],
    Evening: ["4:00 PM", "5:00 PM", "6:00 PM", "6:30 PM"],
  };

  const slotGroups = slotsData?.slotGroups || defaultSlotGroups;

  const handleSlotClick = (time) => {
    if (!selectedDate) {
      toast.error("Please select a date first.");
      return;
    }
    if (isSlotExpired(time)) return;
    if (slotsData?.bookedTimes && slotsData.bookedTimes.includes(time)) return;

    setSelectedSlot(time);
    setShowConfirmPopup(true);
  };

  const handleConfirm = () => {
    setConfirmedSlot(selectedSlot);
    setShowConfirmPopup(false);
  };

  const [updating, setUpdating] = useState(false);

  const handleCheckout = async () => {
    if (!confirmedSlot) {
      toast.error("Please confirm your slot.");
      return;
    }

    const bookingDetails = {
      date: selectedDate.toDateString(),
      dateISO: selectedDate.toISOString(),
      time: confirmedSlot,
    };

    if (source === "my-booking" && bookingId) {
      setUpdating(true);
      try {
        await rescheduleBooking(
          getCurrentUserId(), 
          bookingId, 
          bookingDetails.date, 
          confirmedSlot, 
          bookingDetails.dateISO
        );
        toast.success("Booking rescheduled successfully!");
        setTimeout(() => navigate("/my-booking"), 1000);
      } catch (e) {
        toast.error("Failed to reschedule. Try again.");
        console.error(e);
      } finally {
        setUpdating(false);
      }
      return;
    }

    localStorage.setItem("bookingDetails", JSON.stringify(bookingDetails));
    toast.success("Slot selected successfully!");
    setTimeout(() => {
      navigate("/checkout", { state: { bookingDetails } });
    }, 1300);
  };
      
   return (
    <>
    {source !== "my-booking" && <Cart />}
    
    <div className="fixed inset-0 bg-black/10 backdrop-blur-[5px] flex items-end md:items-center justify-center z-50">
      <div className="relative w-full max-w-2xl bg-white rounded-t-[32px] md:rounded-3xl shadow-xl p-6 md:h-[580px] flex flex-col mt-[15vh] sm:mt-0 h-[85vh] sm:h-auto overflow-hidden animate-in slide-in-from-bottom duration-300">
    
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-start mb-1">
            <h2 className="text-2xl font-bold text-gray-900">
              When should care arrive?
            </h2>
            <button onClick={() => navigate(-1)} className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
              ✕
            </button>
          </div>
          <p className="text-gray-500 text-sm flex items-center gap-1.5 mt-1">
            <Clock size={16} /> Takes 20 – 30 minutes
          </p>

          <div className="h-[1px] bg-gray-100 my-4"></div>

          <div className="flex-1 overflow-y-auto pr-1 no-scrollbar">
            <h3 className="font-bold text-[1rem] text-gray-800 mb-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#8dcae4]"></div>
              Select Date
            </h3>

            <div className="flex gap-3 overflow-x-auto pb-6 -mx-2 px-2 no-scrollbar">
              {dates.map((date, index) => {
                const isSelected = selectedDate && selectedDate.toDateString() === date.toDateString();
                const isToday = new Date().toDateString() === date.toDateString();

                return (
                  <div
                    key={index}
                    onClick={() => setSelectedDate(date)}
                    className={`min-w-[85px] p-4 rounded-2xl text-center cursor-pointer transition-all duration-300 border-2
                    ${isSelected ? "bg-[#f0f9ff] border-[#8dcae4] shadow-sm" : "bg-white border-gray-100 hover:border-[#8dcae4]/30"}`}
                  >
                    <div className={`text-[11px] font-bold uppercase tracking-wider mb-1 ${isSelected ? "text-[#8dcae4]" : "text-gray-400"}`}>
                      {isToday ? "Today" : date.toLocaleDateString("en-IN", { weekday: "short" })}
                    </div>
                    <div className={`font-black text-xl ${isSelected ? "text-[#1a2538]" : "text-gray-700"}`}>
                      {date.getDate()}
                    </div>
                    <div className="text-[10px] font-medium text-gray-400">
                      {date.toLocaleDateString("en-IN", { month: "short" })}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <h3 className="font-bold text-[1rem] text-gray-800 mb-4 mt-2 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#8dcae4]"></div>
              Available Time Slots
            </h3>

            {slotsLoading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 border-4 border-sky-100 border-t-sky-400 rounded-full animate-spin"></div>
                <p className="text-sm text-gray-400 font-medium">Fetching slots...</p>
              </div>
            ) : !selectedDate ? (
               <div className="py-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <p className="text-gray-400">Please select a date to view slots</p>
               </div>
            ) : (
              Object.entries(slotGroups).map(([period, times]) => (
                <div key={period} className="mb-6">
                  <div className="flex items-center gap-2 mb-3 px-1 text-[0.85rem] font-bold text-gray-400 uppercase tracking-widest">
                    {period === "Morning" && <Sunrise size={16} />}
                    {period === "Afternoon" && <Sun size={16} />}
                    {period === "Evening" && <Sunset size={16} />}
                    <span>{period}</span>
                  </div>

                  <div className="grid grid-cols-2 xs:grid-cols-3 gap-3">
                    {times.map((time) => {
                      const isBookedSlot = slotsData?.bookedTimes?.includes(time);
                      const isPast = isSlotExpired(time);
                      const isSelected = (confirmedSlot === time) || (selectedSlot === time);

                      return (
                        <button
                          key={time}
                          disabled={isBookedSlot || isPast}
                          onClick={() => handleSlotClick(time)}
                          className={`py-3.5 px-2 rounded-xl border text-sm transition-all duration-300 relative overflow-hidden
                            ${isBookedSlot || isPast
                                ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"
                                : isSelected
                                  ? "bg-[#8dcae4] border-[#8dcae4] text-white font-bold shadow-md"
                                  : "bg-white border-gray-200 hover:border-[#8dcae4] text-gray-700 font-medium"
                            }`}
                        >
                          {time}
                          {isPast && !isBookedSlot && (
                            <div className="absolute top-0 right-0">
                               <div className="bg-gray-200 text-[8px] px-1 text-gray-500 uppercase font-black">Passed</div>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-4 border-t border-gray-50">
            <button
              onClick={handleCheckout}
              disabled={!confirmedSlot || updating}
              className={`w-full py-4 rounded-2xl text-white font-bold tracking-[0.08em] transition-all duration-300 shadow-lg flex items-center justify-center gap-2
              ${confirmedSlot && !updating
                ? "bg-gradient-to-r from-[#8dcae4] to-[#79bada] hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98]"
                : "bg-gray-200 cursor-not-allowed opacity-70 shadow-none grayscale"}`}
            >
              {updating ? "UPDATING..." : source === "my-booking" ? "RESCHEDULE BOOKING" : "CONFIRM & CONTINUE"}
            </button>
          </div>
        </div>
      </div>

      {showConfirmPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-[60] p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full sm:w-[400px] rounded-[32px] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-black text-center mb-2 text-[#1a2538]">
              Confirm Window
            </h3>
            <p className="text-center text-gray-400 text-sm mb-6">Our expert will arrive between</p>
            <div className="bg-[#f0f9ff]/50 border-2 border-dashed border-[#8dcae4]/30 p-6 rounded-[24px] text-center mb-8">
              <div className="text-[#8dcae4] font-black text-4xl mb-2">
                {selectedSlot}
              </div>
              <p className="text-[0.7rem] text-[#1a2538]/50 uppercase tracking-[0.2em] font-bold">
                {selectedDate?.toLocaleDateString("en-IN", { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowConfirmPopup(false)}
                className="flex-1 py-4 rounded-2xl font-bold text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all border border-gray-100"
              >
                Go back
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-4 rounded-2xl bg-[#8dcae4] text-white font-bold shadow-lg shadow-sky-100 hover:bg-[#79bada] active:scale-95 transition-all"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
