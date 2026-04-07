import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getStoredProfile, saveProfile, uploadAndSetProfileImage } from "../utils/profileData";
import { getCurrentUserId } from "../utils/authSession";
import { toast } from "sonner";

const ProfileSettings = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState(() => getStoredProfile());

  const [previewOpen, setPreviewOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "gender") {
      const genderImage = value === "Male" ? "/men.png" : "/female.png";
      const isDefaultAvatar =
        profile.image === "/male.png" ||
        profile.image === "/men.png" ||
        profile.image === "/female.png";

      setProfile({
        ...profile,
        gender: value,
        image: isDefaultAvatar ? genderImage : profile.image,
      });
      return;
    }

    setProfile({
      ...profile,
      [name]: value,
    });
  };

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveProfile(profile);
      toast.success("Profile updated successfully!");
      setTimeout(() => {
        navigate("/profile-dashboard");
      }, 1000);
    } catch (error) {
      toast.error("Failed to update profile.");
      setIsSaving(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Show local preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);

      // Upload to Firebase Storage in the background
      try {
        const url = await uploadAndSetProfileImage(getCurrentUserId(), file);
        setProfile((prev) => ({ ...prev, image: url }));
      } catch {
        // Upload failed — keep the local preview
      }
    }
  };
 

  return (
    <>

      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 md:p-6">

      {/* Main Card */}
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center p-4 md:p-6 border-b relative">
          <button
            onClick={() => navigate("/profile-dashboard")}
            className="absolute left-4 sm:left-6 text-gray-500 hover:text-gray-700 text-xl"
          >
            ←
          </button>
          <h2 className="mx-auto text-base md:text-lg font-semibold">
            Profile Settings
          </h2>
        </div>

        <div className="flex flex-col md:flex-row">

          {/* LEFT SECTION */}
          <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r p-6 md:p-8 text-center">

            <div className="relative inline-block">

              {/* Profile Image */}
              <img
                src={profile.image}
                alt="Profile"
                onClick={() => setPreviewOpen(true)}
                className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover cursor-pointer shadow-md mx-auto"
              />
              
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="absolute right-2 bottom-2 bg-[#8dcae4] text-white p-2 rounded-full border-2 border-white shadow-md hover:bg-sky-400 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
              </button>

              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

            <h3 className="mt-6 text-lg font-semibold">
              Edit Profile
            </h3>

            <p className="text-gray-500 text-sm mt-2">
              Keep your personal details updated
            </p>
          </div>

          {/* RIGHT SECTION */}
          <div className="w-full md:w-2/3 p-6 md:p-8">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={profile.fullName}
                  onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-2 bg-gray-50 focus:ring-2 focus:ring-[#8dcae4] focus:outline-none"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-2 bg-gray-50 focus:ring-2 focus:ring-[#8dcae4] focus:outline-none"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-2 bg-gray-50 focus:ring-2 focus:ring-[#8dcae4] focus:outline-none"
                />
              </div>

              {/* Gender Dropdown */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Gender
                </label>

                <select
                  name="gender"
                  value={profile.gender}
                  onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-2 bg-gray-50 focus:ring-2 focus:ring-[#8dcae4] focus:outline-none appearance-none"
                >
                  <option>Female</option>
                  <option>Male</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            {/* Personal Note */}
            <div className="mt-6">
              <label className="block text-sm font-medium mb-2">
                Personal Note
              </label>

              <textarea
                name="note"
                value={profile.note}
                onChange={handleChange}
                rows="4"
                placeholder="Brief notes for your consultant..."
                className="w-full border rounded-xl px-4 py-3 bg-gray-50 focus:ring-2 focus:ring-[#8dcae4] focus:outline-none"
              />
            </div>

            {/* Footer Buttons */}
            <div className="flex flex-col sm:flex-row justify-end items-center gap-4 sm:gap-6 mt-8">

              <button
                onClick={() => navigate("/profile-dashboard")}
                className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
                disabled={isSaving}
              >
                Discard changes
              </button>

              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2 rounded-xl text-white font-medium shadow-md w-full sm:w-auto flex items-center justify-center gap-2 disabled:opacity-70 transition"
                style={{ backgroundColor: "#8dcae4" }}
              >
                {isSaving && <span className="w-4 h-4 border-2 border-white border-t-[#8dcae4] rounded-full animate-spin"></span>}
                {isSaving ? "Saving..." : "Save Changes"}
              </button>

            </div>

          </div>
        </div>
      </div>

      {/* IMAGE PREVIEW MODAL */}
      {previewOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4"
          onClick={() => setPreviewOpen(false)}
        >
          <img
            src={profile.image}
            alt="Preview"
            className="max-w-full md:max-w-lg rounded-xl"
          />
        </div>
      )}
    </div>
    </>
  );

};

export default ProfileSettings;
