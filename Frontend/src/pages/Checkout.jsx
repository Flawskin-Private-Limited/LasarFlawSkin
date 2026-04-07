import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CalendarDays, Clock3, ShieldCheck } from "lucide-react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { useCart } from "../context/CartContext";
import { createBooking, createTransaction } from "../firebase/bookingService";
import { validatePromoCode } from "../firebase/promoService";
import { getCurrentUserId } from "../utils/authSession";
import { getStoredProfile } from "../utils/profileData";
import { toast } from "sonner";
import clinicImage from "../assets/images/laser-clinic-image.jpg";

const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const formatMoney = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    cartItems, 
    getCartSubtotal, 
    getCartTotal, 
    getCartCount, 
    clearCart,
    promoDetails,
    applyPromo,
    removePromo,
    getDiscountAmount
  } = useCart();

  const [couponText, setCouponText] = useState(promoDetails?.code || "");
  const [submitting, setSubmitting] = useState(false);
  const [promoMessage, setPromoMessage] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const bookingFromState = location.state?.bookingDetails;
  const bookingFromStorage = localStorage.getItem("bookingDetails");
  let selectedDate = "";
  let selectedTime = "";
  let dateISO = null;

  if (bookingFromState) {
    selectedDate = bookingFromState?.date || (bookingFromState?.dateISO ? new Date(bookingFromState.dateISO).toDateString() : "");
    selectedTime = bookingFromState?.time || "";
    dateISO = bookingFromState?.dateISO;
  } else if (bookingFromStorage) {
    try {
      const parsed = JSON.parse(bookingFromStorage);
      selectedDate = parsed?.date || (parsed?.dateISO ? new Date(parsed.dateISO).toDateString() : "");
      selectedTime = parsed?.time || "";
      dateISO = parsed?.dateISO;
    } catch (error) {
      console.error("Unable to parse bookingDetails", error);
    }
  }

  let addressLabel = "";
  const fullAddress = localStorage.getItem("fullAddress");
  if (fullAddress) {
    try {
      const parsedAddress = JSON.parse(fullAddress);
      addressLabel = parsedAddress?.fullAddress || [
          parsedAddress?.house,
          parsedAddress?.building,
          parsedAddress?.landmark,
          parsedAddress?.selectedAddress,
        ].filter(Boolean).join(", ");
    } catch (error) {
      console.error("Unable to parse fullAddress", error);
    }
  }

  const subtotal = getCartSubtotal();
  const estimatedTaxes = subtotal * 0.08;
  const discount = getDiscountAmount();
  const total = subtotal + estimatedTaxes - discount;

  const handleApplyCoupon = async () => {
    if (!couponText.trim()) return;
    setPromoLoading(true);
    setPromoMessage("");
    
    try {
      const result = await validatePromoCode(couponText.trim());
      if (result.valid) {
        if (result.minOrder && subtotal < result.minOrder) {
          setPromoMessage(`Minimum order of ₹${result.minOrder} required`);
          removePromo();
        } else {
          applyPromo(result);
          setPromoMessage(result.message);
        }
      } else {
        setPromoMessage(result.message);
        removePromo();
      }
    } catch {
      setPromoMessage('Failed to validate promo code');
    } finally {
      setPromoLoading(false);
    }
  };

  const handleProceedToPayment = async () => {
    if (cartItems.length === 0) return;
    
    if (!selectedTime || !selectedDate) {
      toast.error("Please select a date and time slot first.");
      return;
    }
    
    if (!addressLabel) {
      toast.error("Please select a delivery address first.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

      if (!res) {
        toast.error("Razorpay SDK failed to load. Check your connection.");
        setSubmitting(false);
        return;
      }

      const profile = getStoredProfile();

      const options = {
        key: "rzp_test_MdAxrwD7xrlpKp",
        amount: Math.round(total * 100),
        currency: "INR",
        name: "Flaw Skin Laser Clinic",
        description: "Booking Payment",
        handler: async function (response) {
          try {
            const transactionId = await createTransaction({
              paymentId: response.razorpay_payment_id,
              userId: getCurrentUserId(),
              total,
              subtotal,
              tax: estimatedTaxes,
              discount,
              coupon: promoDetails?.code || null,
            });

            await createBooking({
              userId: getCurrentUserId(),
              services: cartItems.map((item) => ({
                id: item.id,
                name: item.name || item.description,
                price: item.price,
                quantity: item.quantity,
                category: item.category,
              })),
              date: selectedDate,
              dateISO: dateISO,
              time: selectedTime,
              timeSlot: selectedTime,
              address: addressLabel,
              subtotal,
              tax: estimatedTaxes,
              discount,
              total,
              coupon: promoDetails?.code || null,
              paymentId: response.razorpay_payment_id,
              transactionId: transactionId,
            });
            
            localStorage.removeItem("bookingDetails");
            clearCart();
            removePromo();
            toast.success("Booking created successfully!");
            navigate("/my-booking");
          } catch (error) {
            console.error("Booking error after payment", error);
            toast.error("Payment successful but booking failed. Contact support.");
          } finally {
            setSubmitting(false);
          }
        },
        prefill: {
          name: profile?.fullName || "User",
          email: profile?.email || "",
          contact: profile?.phone || "",
        },
        theme: {
          color: "#8dcae4",
        },
        modal: {
          ondismiss: function () {
            setSubmitting(false);
          },
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error("Payment setup error", error);
      toast.error("Failed to initiate payment.");
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#f1f3f5] pt-[20px] text-[#172232]">
        <main className="mx-auto max-w-[1180px] px-4 pb-14 sm:px-6">
          <p className="text-[0.8rem] text-[#7f8898]">Home / Cart / Checkout</p>
          <h1 className="mt-2 text-[2.2rem] font-bold text-[#1a2538]">Checkout</h1>

          <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
            <section className="space-y-6">
              <article className="rounded-2xl border border-[#e1e6ee] bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-[1.2rem] font-bold text-[#1d2940]">Your Services</h2>

                {cartItems.length === 0 ? (
                  <div className="py-10 text-center text-gray-400 border-2 border-dashed border-gray-100 rounded-2xl">
                    <p>No services in cart.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 rounded-xl border border-[#e8edf3] bg-[#fbfcfe] p-4"
                      >
                        <img
                          src={item.image || clinicImage}
                          alt={item.name}
                          className="h-20 w-24 rounded-lg object-cover shadow-sm"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-[0.65rem] font-bold uppercase tracking-wider text-[#8dbfda]">
                            {item.category || "Laser Treatment"}
                          </p>
                          <h3 className="text-[1rem] font-bold text-[#1b2740] truncate">
                            {item.description || item.name}
                          </h3>
                          <p className="text-[0.75rem] text-gray-400 mt-1">
                            Qty: {item.quantity} × {formatMoney(item.price)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[1.05rem] font-bold text-[#233047]">
                            {formatMoney(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </article>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <article className="rounded-2xl border border-[#e1e6ee] bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-[1.1rem] font-bold text-[#1d2940]">Home Visit</h2>
                    <button
                      onClick={() => navigate("/select-slots")}
                      className="text-[0.8rem] font-bold text-[#8dbfda] hover:underline"
                    >
                      EDIT
                    </button>
                  </div>
                  <div className="space-y-3 p-4 rounded-xl bg-[#f0f9ff] border border-[#8dcae4]/20">
                    <div className="flex items-center gap-3">
                      <div className="bg-white p-2 rounded-lg shadow-sm text-[#8dbfda]"><CalendarDays size={18} /></div>
                      <span className="text-[0.95rem] font-semibold text-[#2a3c59]">{selectedDate || "Not selected"}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-white p-2 rounded-lg shadow-sm text-[#8dbfda]"><Clock3 size={18} /></div>
                      <span className="text-[0.95rem] font-semibold text-[#2a3c59]">{selectedTime || "Not selected"}</span>
                    </div>
                  </div>
                </article>

                <article className="rounded-2xl border border-[#e1e6ee] bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-[1.1rem] font-bold text-[#1d2940]">Address</h2>
                    <button
                      onClick={() => navigate("/select-address")}
                      className="text-[0.8rem] font-bold text-[#8dbfda] hover:underline"
                    >
                      EDIT
                    </button>
                  </div>
                  <div className="p-4 rounded-xl bg-[#f0f9ff] border border-[#8dcae4]/20 min-h-[100px]">
                    <p className="text-[0.9rem] leading-relaxed text-[#2a3c59] font-medium">
                      {addressLabel || "Please select a delivery address"}
                    </p>
                  </div>
                </article>
              </div>
            </section>

            <aside className="sticky top-6 h-fit space-y-6">
              <div className="rounded-2xl border border-[#e1e6ee] bg-white p-6 shadow-sm">
                <h2 className="text-[1.2rem] font-bold text-[#1d2940] mb-5">Order Summary</h2>

                <div className="space-y-4 text-[0.95rem] text-[#5e6d84] border-b border-gray-100 pb-5">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold text-[#1f2a3f]">{formatMoney(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Est. Taxes (8%)</span>
                    <span className="font-bold text-[#1f2a3f]">{formatMoney(estimatedTaxes)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Consultation</span>
                    <span className="font-bold text-green-500 uppercase text-[0.8rem]">Free</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600 font-bold bg-green-50 p-2 rounded-lg">
                      <span>Discount</span>
                      <span>-{formatMoney(discount)}</span>
                    </div>
                  )}
                </div>

                <div className="py-5">
                  <label className="text-[0.7rem] font-bold uppercase tracking-wider text-gray-400 mb-2 block">PROMO CODE</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponText}
                      onChange={(e) => setCouponText(e.target.value)}
                      placeholder="Enter code"
                      className="h-10 flex-1 rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-[#8dbfda]"
                      disabled={!!promoDetails}
                    />
                    {!promoDetails ? (
                      <button 
                        onClick={handleApplyCoupon} 
                        disabled={promoLoading}
                        className="rounded-xl bg-gray-50 px-4 text-xs font-bold text-[#1a2538] border border-gray-200 hover:bg-gray-100 transition"
                      >
                        {promoLoading ? "..." : "Apply"}
                      </button>
                    ) : (
                      <button 
                        onClick={() => { removePromo(); setCouponText(""); }}
                        className="rounded-xl bg-red-50 px-4 text-xs font-bold text-red-500 border border-red-100 hover:bg-red-100 transition"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  {promoMessage && (
                    <p className={`mt-2 text-xs ${promoDetails ? 'text-green-600' : 'text-red-500'} font-medium`}>
                      {promoMessage}
                    </p>
                  )}
                </div>

                <div className="pt-2">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[1.1rem] font-bold text-[#1a2538]">Total Payable</span>
                    <strong className="text-[2rem] tracking-tight text-[#8dbfda]">{formatMoney(total)}</strong>
                  </div>
                  
                  <button
                    onClick={handleProceedToPayment}
                    disabled={cartItems.length === 0 || submitting}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-[#8dcae4] to-[#79bada] text-white font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none"
                  >
                    {submitting ? "PROCESING..." : "PAY & BOOK NOW"}
                  </button>
                  
                  <div className="mt-4 flex items-center justify-center gap-2 text-[0.75rem] text-gray-400">
                    <ShieldCheck size={16} className="text-[#8dbfda]" />
                    <span>Secure 256-bit SSL encrypted payment</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
