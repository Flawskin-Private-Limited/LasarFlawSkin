import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStoredProfile } from "../utils/profileData";
import { submitCallbackRequest } from "../firebase/feedbackService";
import { getCurrentUserId } from "../utils/authSession";
import { toast } from "sonner";

const RequestCallback = () => {
  const navigate = useNavigate();
  const [profile] = useState(() => getStoredProfile());

  const [formData, setFormData] = useState({
    phone: profile.phone || "",
    timeWindow: "Morning (9 AM - 12 PM)",
    reason: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await submitCallbackRequest({
        userId: getCurrentUserId(),
        phone: formData.phone,
        timeWindow: formData.timeWindow,
        reason: formData.reason,
        userName: profile.fullName || '',
      });
      toast.success("We will contact you shortly!");
      setTimeout(() => {
        navigate("/profile-dashboard");
      }, 1300);
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const timeOptions = [
    "Morning (9 AM - 12 PM)",
    "Afternoon (12 PM - 4 PM)",
    "Evening (4 PM - 8 PM)"
  ];

  return (
    <>

       
    <div className="min-h-screen bg-black/40 flex items-center justify-center px-4 py-6">

      {/* Modal Card */}
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl relative">

        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-semibold">
            Request a Callback
          </h2>
          <button
            onClick={() => navigate("/profile-dashboard")}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6">

          {/* Specialist Info */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <img
                src={profile.image || "/female.png"}
                alt={profile.fullName || "Profile"}
                className="w-14 h-14 rounded-full object-cover"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
            </div>

            <div>
              <h3 className="font-semibold text-lg">
                {profile.fullName || "Talk to a Specialist"}
              </h3>
              <p className="text-gray-500 text-sm">
                Our laser hair reduction experts are ready to assist you.
                Average response time: 30 minutes.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>

            {/* Phone */}
            <div className="mb-5">
              <label className="block text-sm font-medium mb-2">
                Preferred Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8dcae4]"
              />
            </div>

            {/* Time Window */}
            <div className="mb-5">
              <label className="block text-sm font-medium mb-3">
                Preferred Time Window
              </label>

              <div className="flex flex-wrap gap-3">
                {timeOptions.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, timeWindow: time })
                    }
                    className={`px-4 py-2 rounded-full border text-sm transition
                      ${
                        formData.timeWindow === time
                          ? "bg-[#8dcae4] text-white border-[#8dcae4]"
                          : "bg-gray-100 text-gray-600"
                      }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Reason */}
            <div className="mb-8">
              <label className="block text-sm font-medium mb-2">
                Reason for Call
              </label>
              <select
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8dcae4]"
              >
                <option value="">Select an option</option>
                <option value="Booking Issue">Booking Issue</option>
                <option value="Payment Issue">Payment Issue</option>
                <option value="General Inquiry">General Inquiry</option>
              </select>
            </div>

            {/* Footer Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-4">

              <button
                type="button"
                onClick={() => navigate("/profile-dashboard")}
                className="px-6 py-2 rounded-lg border text-gray-600 hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
            
                className="px-6 py-2 rounded-lg text-white bg-[#8dcae4] hover:opacity-90 transition"
              >
                Submit Request
              </button>

            </div>

          </form>
        </div>
      </div>
    </div>
    </>
  );
};

export default RequestCallback;
