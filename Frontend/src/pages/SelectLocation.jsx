import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useLocation, useNavigate } from "react-router-dom";
import Cart from "./Cart";

const SelectLocation = ({ onNext }) => {
  const mapRef = useRef(null);
  const mapObject = useRef(null);
  const markerRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const source = location.state?.source || "cart-checkout";

  const [address, setAddress] = useState("");
  const [selected, setSelected] = useState(false);
  
  const [isInsideBoundary, setIsInsideBoundary] = useState(true);
  const [loadingMap, setLoadingMap] = useState(true);

  // ✅ Proper Closed Polygon for Bengaluru
  const bengaluruBoundary = [
    [13.1737, 77.4197],
    [13.1737, 77.7860],
    [12.9000, 77.9000],
    [12.7340, 77.8400],
    [12.7340, 77.4197],
    [13.1737, 77.4197], // closed polygon
  ];

  useEffect(() => {
    if (!mapRef.current || mapObject.current) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        const boundaryPolygon = L.polygon(bengaluruBoundary);
        const boundaryBounds = boundaryPolygon.getBounds();

        const map = L.map(mapRef.current, {
          maxBounds: boundaryBounds,
          maxBoundsViscosity: 1.0,
        }).setView([latitude, longitude], 12);

        mapObject.current = map;
        setLoadingMap(false);

        L.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            attribution: "&copy; OpenStreetMap contributors",
          }
        ).addTo(map);

        // Keep polygon for boundary checks, but do not render the shape on map

        // Add marker
        const marker = L.marker([latitude, longitude]).addTo(map);
        markerRef.current = marker;

        checkInside(latitude, longitude, boundaryPolygon);
        reverseGeocode(latitude, longitude);

        map.on("click", function (e) {
          checkInside(e.latlng.lat, e.latlng.lng, boundaryPolygon);

          if (!boundaryPolygon.getBounds().contains(e.latlng)) {
            setIsInsideBoundary(false);
            setSelected(false);
            return;
          }

          marker.setLatLng(e.latlng);
          reverseGeocode(e.latlng.lat, e.latlng.lng);
          setSelected(true);
        });
      },
      () => {
        alert("Please allow location permission");
      }
    );

    function checkInside(lat, lng, polygon) {
      const isInside = polygon.getBounds().contains([lat, lng]);
      setIsInsideBoundary(isInside);
    }

    function reverseGeocode(lat, lng) {
      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (!data.address) return;

          const addr = data.address;

          const building = addr.house_number || "";
          const street = addr.road || "";
          const locality = addr.suburb || addr.village || "";
          const district = addr.county || "";
          const state = addr.state || "";
          const pincode = addr.postcode || "";

          const fullAddress = `${building}, ${street}, ${locality}, ${district}, ${state} - ${pincode}`
            .replace(/,+/g, ",")
            .replace(/^,|,$/g, "");

          setAddress(fullAddress);
        });
    }

    return () => {
      if (mapObject.current) {
        mapObject.current.remove();
        mapObject.current = null;
      }
    };
  }, []);
                const handleClose = () => {    
                navigate(-1);
            };

    return (
      <>
      {/*Cart page as background when coming from cart checkout*/}
      <Cart />
      
      <div className="fixed inset-0 bg-black/10 backdrop-blur-[5px] flex items-end md:items-center justify-center z-50">
        <div className="relative bg-white w-full md:max-w-xl rounded-t-3xl md:rounded-3xl p-4 md:p-6 shadow-2xl max-h-[95vh] overflow-auto">
          {/* Close Button */}
    
        <button
          onClick={handleClose} 
          className="absolute top-4 right-4 text-black hover:text-gray-700"
        >
          ✕
        </button>

        <h2 className="text-xl md:text-2xl font-semibold text-center mb-4">
          Select Location
        </h2>

        {/* Responsive Map */}
        <div className="relative">
          {loadingMap && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-xl bg-white">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#8dcae4] border-t-transparent" />
              <p className="text-sm font-medium text-black">Please wait...</p>
            </div>
          )}
          <div
            ref={mapRef}
            className="w-full h-64 md:h-80 rounded-xl overflow-hidden shadow-md"
          />
        </div>

        {selected && (
          <>
            <div className="mt-4 flex justify-between items-start bg-gray-100 p-3 rounded-xl">
              <p className="text-xs md:text-sm font-medium truncate">
                {address}
              </p>

              <button
                onClick={() => setSelected(false)}
                className="text-[#8dcae4] text-xs md:text-sm font-semibold ml-2"
              >
                Change
              </button>
            </div>

            <button
              onClick={() =>
                navigate("/add-address", { state: { selectedAddress: address, source } })
              }
              disabled={!isInsideBoundary}
              className={`mt-4 w-full py-3 rounded-xl font-semibold text-white transition-all
                ${
                  isInsideBoundary
                    ? "bg-[#8dcae4] hover:scale-105"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
            >
              Add Address Details
            </button>
          </>
        )}

        {!isInsideBoundary && (
          <p className="text-red-500 text-sm mt-3 text-center">
            Service available only within Bengaluru
          </p>
        )}
      </div>
    </div>
    </>
  );
};

export default SelectLocation;
