import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cart from "./Cart";
import { getAddresses } from "../firebase/addressService";
import { getCurrentUserId } from "../utils/authSession";
import { toast } from "sonner";

export default function SelectAddress() {
  const location = useLocation();
  const navigate = useNavigate();
  const source = location.state?.source || "cart-checkout";

  const buildFullAddress = (address) => {
    if (!address) return "";
    if (address.fullAddress) return address.fullAddress;

    return [address.house, address.building, address.landmark, address.selectedAddress]
      .filter(Boolean)
      .join(", ");
  };

  const [savedAddresses, setSavedAddresses] = useState(() => {
    const normalizedAddresses = [];

    const storedList = localStorage.getItem("savedAddresses");
    if (storedList) {
      try {
        const parsedList = JSON.parse(storedList);
        if (Array.isArray(parsedList)) {
          parsedList.forEach((item, index) => {
            const fullAddress = buildFullAddress(item);
            if (fullAddress) {
              normalizedAddresses.push({
                id: item.id || `${fullAddress}-${index}`,
                saveAs: item.saveAs || "Saved Address",
                fullAddress,
                selectedAddress: item.selectedAddress || fullAddress,
                house: item.house || "",
                building: item.building || "",
                landmark: item.landmark || "",
              });
            }
          });
        }
      } catch (error) {
        console.error("Unable to parse savedAddresses", error);
      }
    }

    const storedSingle = localStorage.getItem("fullAddress");
    if (storedSingle) {
      try {
        const parsedSingle = JSON.parse(storedSingle);
        const fullAddress = buildFullAddress(parsedSingle);
        if (fullAddress && !normalizedAddresses.some((item) => item.fullAddress === fullAddress)) {
          normalizedAddresses.push({
            id: fullAddress,
            saveAs: parsedSingle.saveAs || "Saved Address",
            fullAddress,
            selectedAddress: parsedSingle.selectedAddress || fullAddress,
            house: parsedSingle.house || "",
            building: parsedSingle.building || "",
            landmark: parsedSingle.landmark || "",
          });
        }
      } catch (error) {
        console.error("Unable to parse fullAddress", error);
      }
    }

    return normalizedAddresses;
  });

  useEffect(() => {
    getAddresses(getCurrentUserId())
      .then((rows) => {
        if (!Array.isArray(rows) || rows.length === 0) return;
        const normalized = rows.map((item, index) => {
          const fullAddress = buildFullAddress(item);
          return {
            ...item,
            id: item.id || `${fullAddress}-${index}`,
            saveAs: item.saveAs || "Saved Address",
            fullAddress,
            selectedAddress: item.selectedAddress || fullAddress,
            house: item.house || "",
            building: item.building || "",
            landmark: item.landmark || "",
          };
        });
        setSavedAddresses(normalized);
        localStorage.setItem("savedAddresses", JSON.stringify(normalized));
      })
      .catch(() => {});
  }, []);

  const handleUseCurrentLocation = () => {
    navigate("/select-location", {
      state: { source },
    });
  };

  const handleSelectSavedAddress = (address) => {
    localStorage.setItem("fullAddress", JSON.stringify(address));
    toast.success("Address selected successfully!");
    setTimeout(() => {
      navigate("/select-slots");
    }, 1300);
  };
  const handleClose = () => {    
    navigate(-1);
  };

  return (
    <>

    {/*Cart page as background when coming from cart checkout*/}
    <Cart />
    
    <div className="fixed inset-0 bg-black/10 backdrop-blur-[5px] flex items-end md:items-center justify-center z-50">

      {/* Bottom Sheet Container */}
      <div
        className="
          relative
          bg-white w-full md:w-[500px]
          h-[75vh] md:h-auto
          rounded-t-3xl md:rounded-2xl
          p-4
          overflow-y-auto
        "
      >
        {/* Close Button */}
    
        <button
          onClick={handleClose} 
          className="absolute top-4 right-4 text-black hover:text-gray-700"
        >
          ✕
        </button>


        {/* Drag Indicator */}
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4"></div>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search location/society/apartment"
          className="w-full border p-3 rounded-xl text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

        {/* Use Current Location */}
        <button
          onClick={handleUseCurrentLocation}
          className="flex items-center gap-2 text-purple-600 font-medium mb-6"
        >
          📍 Use current location
        </button>

        {/* Saved Addresses Section */}
        {savedAddresses.length > 0 && (
          <>
            <p className="text-gray-500 text-xs mb-2 uppercase">
              Saved Addresses
            </p>

            {savedAddresses.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelectSavedAddress(item)}
                className="p-3 border rounded-xl mb-3 cursor-pointer hover:bg-gray-100 transition"
              >
                <p className="font-semibold text-sm">{item.saveAs}</p>
                <p className="text-xs text-gray-600">
                  {item.fullAddress}
                </p>
              </div>
            ))}
          </>
        )}

        {savedAddresses.length === 0 && (
          <p className="text-gray-400 text-sm">
            No saved addresses found.
          </p>
        )}
      </div>
    </div>
    
  </>
  );
}

