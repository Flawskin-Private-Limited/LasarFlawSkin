import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cart from "./Cart";
import { addAddress as addFirestoreAddress } from "../firebase/addressService";
import { getCurrentUserId } from "../utils/authSession";
import { toast } from "sonner";

const MAX_ADDRESSES = 5;

export default function AddAddressStep() {
  const location = useLocation();
  const navigate = useNavigate();

  const selectedAddress = location.state?.selectedAddress || "";
  const source = location.state?.source || "cart-checkout";

  const [house, setHouse] = useState("");
  const [building, setBuilding] = useState("");
  const [landmark, setLandmark] = useState("");
  const [saveAs, setSaveAs] = useState("Home");

  const handleSaveAddress = async () => {
    const trimmedHouse = house.trim();
    const trimmedBuilding = building.trim();
    const trimmedLandmark = landmark.trim();

    if (!trimmedHouse || !trimmedBuilding) {
      alert("House/Flat and Building name are required");
      return;
    }

    const payload = {
      id: `addr-${Date.now()}`,
      selectedAddress,
      house: trimmedHouse,
      building: trimmedBuilding,
      landmark: trimmedLandmark,
      saveAs: saveAs || "Home",
      fullAddress: [trimmedHouse, trimmedBuilding, trimmedLandmark, selectedAddress]
        .filter(Boolean)
        .join(", "),
      isDefault: false,
      persistInSavedAddresses: true,
    };

    const existing = JSON.parse(localStorage.getItem("savedAddresses") || "[]");
    const next = Array.isArray(existing) ? existing : [];
    const alreadyExists = next.some((item) => item.fullAddress === payload.fullAddress);
    const canStoreInSaved = source === "saved-address" || next.length < MAX_ADDRESSES;

    if (!canStoreInSaved) {
      payload.persistInSavedAddresses = false;
    }

    localStorage.setItem("fullAddress", JSON.stringify(payload));

    if (!alreadyExists && canStoreInSaved) {
      next.push({ ...payload, isDefault: next.length === 0 });
      localStorage.setItem("savedAddresses", JSON.stringify(next));
    }

    // Also save to Firestore
    try {
      await addFirestoreAddress(getCurrentUserId(), {
        selectedAddress,
        house: trimmedHouse,
        building: trimmedBuilding,
        landmark: trimmedLandmark,
        saveAs: saveAs || "Home",
        fullAddress: payload.fullAddress,
      });
    } catch {
      // Firestore save failed silently — localStorage is primary
    }

    if (source === "saved-address") {
      navigate("/save-address");
      return;
    }
        toast.success("Address saved successfully!");
    setTimeout(() => {    
    navigate("/select-slots");
    }, 1300);
  };

  return (
    <>

    {/*Cart page as background when coming from cart checkout*/}
    <Cart />
    
    <div className="fixed inset-0 bg-black/10 backdrop-blur-[5px] flex items-end md:items-center justify-center z-50">
      <div
        className="
          relative
          bg-white
          w-full md:w-[450px]
          h-[75vh] md:h-auto
          rounded-t-3xl md:rounded-2xl
          px-5 pt-3 pb-6
          overflow-y-auto
          shadow-[0_20px_60px_rgba(0,0,0,0.25)]
        "
      >

        <div className="w-10 h-1.5 bg-gray-300 rounded-full mx-auto mb-3"></div>
        {/* Cross button */}
        <button
        onClick={() => navigate(-1)}
               className="absolute top-4 right-4 text-black hover:text-gray-800 text-xl font-bold"
              >
                 ✕
              </button>

        <h2 className="text-lg font-semibold mb-2 text-gray-800">Enter Address Details</h2>
        

        <div className="bg-gray-100 p-3 rounded-xl text-xs text-gray-700 mb-1 break-words">
          Location: {selectedAddress || "No location selected"}
        </div>

        <button
          onClick={() => navigate("/select-location", { state: { source } })}
          className="text-xs font-medium mb-3"
          style={{ color: "#8dcae4" }}
        >
          Change Location
        </button>

        <div className="mb-3">
          <label className="text-xs text-gray-600 font-medium block mb-1">
            House / Flat / Floor Number *
          </label>

          <input
            type="text"
            placeholder="Enter house / flat number"
            value={house}
            onChange={(e) => setHouse(e.target.value)}
            className="
              w-full
              bg-[#F6F7F8]
              border border-gray-200
              p-3
              text-sm
              rounded-xl
              outline-none
              transition-all
              duration-200
              hover:border-gray-300
              focus:border-[#B8461B]
              focus:ring-2 focus:ring-[#B8461B]/20
              focus:bg-white
            "
          />
        </div>

        <div className="mb-3">
          <label className="text-xs text-gray-600 font-medium block mb-1">Building Name *</label>

          <input
            type="text"
            placeholder="Enter building name"
            value={building}
            onChange={(e) => setBuilding(e.target.value)}
            className="
              w-full
              bg-[#F6F7F8]
              border border-gray-200
              p-3
              text-sm
              rounded-xl
              outline-none
              transition-all
              duration-200
              hover:border-gray-300
              focus:border-[#B8461B]
              focus:ring-2 focus:ring-[#B8461B]/20
              focus:bg-white
            "
          />
        </div>

        <div className="mb-3">
          <label className="text-xs text-gray-600 font-medium block mb-1">Landmark (Optional)</label>

          <input
            type="text"
            placeholder="Enter nearby landmark"
            value={landmark}
            onChange={(e) => setLandmark(e.target.value)}
            className="
              w-full
              bg-[#F6F7F8]
              border border-gray-200
              p-3
              text-sm
              rounded-xl
              outline-none
              transition-all
              duration-200
              hover:border-gray-300
              focus:border-[#B8461B]
              focus:ring-2 focus:ring-[#B8461B]/20
              focus:bg-white
            "
          />
        </div>

        <div className="mb-2">
          <label className="text-xs text-gray-600 font-medium block mb-2">Save As</label>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setSaveAs("Home")}
              className={`
                px-4 py-2 text-sm rounded-full border transition
                ${
                  saveAs === "Home"
                    ? "bg-[#8dcae4] text-white border-[#B8461B]"
                    : "bg-gray-100 text-gray-700 border-gray-200 hover:border-gray-300"
                }
              `}
            >
              Home
            </button>

            <button
              type="button"
              onClick={() => setSaveAs("Other")}
              className={`
                px-4 py-2 text-sm rounded-full border transition
                ${
                  saveAs === "Other"
                    ? "bg-[#8dcae4] text-white border-[#B8461B]"
                    : "bg-gray-100 text-gray-700 border-gray-200 hover:border-gray-300"
                }
              `}
            >
              Other
            </button>
          </div>
        </div>

        <button
          onClick={handleSaveAddress}
          className="
            w-full
            bg-[#AFC7D6]
            hover:bg-[#7bbbd6]
            text-white
            py-3
            text-sm
            rounded-xl
            font-medium
            shadow-md
            transition
            mt-4
          "
        >
          Save & Proceed to Slots
        </button>
      </div>
    </div>
    </>
  );
}
