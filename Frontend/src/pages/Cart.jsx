import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiBell,
  FiGlobe,
  FiMapPin,
  FiMinus,
  FiPhone,
  FiPlus,
  FiPlusCircle,
  FiShare2,
  FiTrash2,
} from "react-icons/fi";
import { FaCcAmex, FaCcMastercard, FaCcVisa } from "react-icons/fa";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { useCart } from "../context/CartContext";
import { validatePromoCode, getActivePromos } from "../firebase/promoService";
import clinicImage from "../assets/images/laser-clinic-image.jpg";


const Cart = () => {
  const navigate = useNavigate();
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    getCartSubtotal,
    getCartTotal, 
    getCartCount,
    promoDetails,
    applyPromo,
    removePromo,
    getDiscountAmount
  } = useCart();

  const [promoCode, setPromoCode] = useState(promoDetails?.code || "");
  const [promoError, setPromoError] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [showOffers, setShowOffers] = useState(false);
  const [availablePromos, setAvailablePromos] = useState([]);

  const handleViewOffers = async () => {
    setShowOffers(true);
    setPromoLoading(true);
    try {
      const active = await getActivePromos();
      setAvailablePromos(active);
    } catch (e) {
      console.error("Error fetching promos", e);
    } finally {
      setPromoLoading(false);
    }
  };

  const applySpecificPromo = (code) => {
    setPromoCode(code);
    setShowOffers(false);
    handleApplyPromoWithCode(code);
  };

  const handleApplyPromoWithCode = async (c) => {
    const codeToUse = c || promoCode;
    if (!codeToUse.trim()) return;
    
    setPromoError("");
    setPromoLoading(true);
    const subtotal = getCartSubtotal();

    try {
      const result = await validatePromoCode(codeToUse.trim());
      if (result.valid) {
        if (result.minOrder && subtotal < result.minOrder) {
          setPromoError(`Minimum order ₹${result.minOrder} required`);
          removePromo();
        } else {
          applyPromo(result);
          setPromoError("");
        }
      } else {
        setPromoError(result.message);
        removePromo();
      }
    } catch {
      setPromoError("Unable to validate promo code. Try again.");
    } finally {
      setPromoLoading(false);
    }
  };

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const hasCartItem = cartItems.length > 0;
  const subtotal = getCartSubtotal();
  const disc = getDiscountAmount();
  const taxRate = 0.08;
  const estimatedTax = subtotal * taxRate;
  const total = getCartTotal() + estimatedTax;

  const handleApplyPromo = () => {
    handleApplyPromoWithCode();
  };

  const handleRemovePromo = () => {
    removePromo();
    setPromoCode("");
    setPromoError("");
  };

  const handleAddMoreServices = () => {
    navigate("/women-service");
  };

  const handleProceedToCheckout = () => {
    navigate("/select-address", {
      state: { source: "cart-checkout" },
    });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#f6f7f8] font-['Avenir_Next','Segoe_UI',sans-serif] text-[#1a2233]">
        <main className="mx-auto max-w-[1280px] px-4 sm:px-6 pb-12 pt-5">
        <p className="mb-4 text-[0.84rem] text-[#8995a8]">
          Home &gt; <span className="font-bold text-[#36435a]">Cart</span>
        </p>

        <div className="mb-4 flex items-center justify-between">
          <h1 className="m-0 text-[2rem] sm:text-[2.2rem] md:text-[2.7rem] font-bold leading-none tracking-[-0.02em] text-[#1b2538]">
            My Cart
          </h1>
          {hasCartItem && (
            <span className="text-[0.9rem] font-medium text-[#8c96a7]">
              {getCartCount()} Item{getCartCount() > 1 ? 's' : ''} Selected
            </span>
          )}
        </div>

        <div className={`grid grid-cols-1 gap-7 ${hasCartItem ? "lg:grid-cols-[minmax(0,1fr)_360px]" : ""}`}>
          <section className={`${hasCartItem ? "space-y-4" : "mx-auto flex min-h-[520px] w-full max-w-[760px] flex-col"}`}>
            {hasCartItem ? (
              cartItems.map((item) => (
              <article key={item.id} className="grid grid-cols-1 items-start gap-4 rounded-[14px] border border-[#e4e8ee] bg-white p-4 md:grid-cols-[152px_minmax(0,1fr)_auto]">
                {/* Mobile: Image small and beside content */}
                <div className="flex gap-3 md:hidden">
                  <img
                    src={item.image || clinicImage}
                    alt={item.name}
                    className="h-[78px] w-[78px] rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.66rem] font-bold uppercase tracking-[0.08em] text-[#8cbfd8]">
                      {item.category || "Service"}
                    </p>
                    <h2 className="line-clamp-2 text-[1rem] font-bold text-[#1b2740]">
                      {item.name || item.description}
                    </h2>
                  </div>
                </div>

                {/* Desktop: Image */}
                <img
                  src={item.image || clinicImage}
                  alt={item.name}
                  className="hidden h-[132px] w-[152px] rounded-lg object-cover md:block"
                />

                {/* Content */}
                <div className="min-w-0">
                  <div className="hidden md:block">
                    <p className="text-[0.66rem] font-bold uppercase tracking-[0.08em] text-[#8cbfd8]">
                      {item.category || "Service"}
                    </p>
                    <h2 className="mb-2 text-[1.4rem] font-bold text-[#1b2740]">
                        {item.name || item.description}
                    </h2>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.82rem] text-[#6d7a91]">
                    {Array.isArray(item.includes) ? item.includes.map((inc, i) => (
                      <span key={i} className="flex items-center gap-1">
                        <span className="h-1 w-1 rounded-full bg-[#8cbfd8]"></span>
                        {inc}
                      </span>
                    )) : (
                      <span className="flex items-center gap-1">
                        <span className="h-1 w-1 rounded-full bg-[#8cbfd8]"></span>
                        {item.includes || "1 session"}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex items-center gap-5">
                    <div className="flex h-[38px] items-center gap-2 rounded-lg border border-[#e2e8f1] bg-[#fbfcfe] px-2">
                       <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-md text-[#4d5e7a] hover:bg-white hover:shadow-sm"
                        aria-label="Decrease quantity"
                      >
                         <FiMinus />
                      </button>
                      <span className="min-w-[20px] text-center text-[0.95rem] font-bold text-[#2a3c5a]">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-md text-[#4d5e7a] hover:bg-white hover:shadow-sm"
                        aria-label="Increase quantity"
                      >
                         <FiPlus />
                      </button>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="flex items-center gap-1.5 text-[0.8rem] font-bold text-red-400 hover:text-red-500"
                    >
                      <FiTrash2 /> REMOVE
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div className="mt-3 border-t border-[#f0f3f6] pt-3 text-right md:mt-0 md:border-t-0 md:pt-0">
                  <span className="block text-[0.7rem] font-bold tracking-wider text-[#a4afc1]">PRICE</span>
                  <strong className="text-[1.35rem] font-black tracking-tight text-[#223048]">
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                      minimumFractionDigits: 0,
                    }).format(item.price)}
                  </strong>
                </div>
              </article>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center rounded-[20px] border border-dashed border-[#d8dee8] bg-white py-14 text-center">
                <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#f4f7fa] text-[2.5rem] text-[#8dbfda]">
                   <FiPlusCircle />
                </div>
                <h3 className="mb-2 text-[1.5rem] font-bold text-[#242f44]">Your cart is empty</h3>
                <p className="mb-8 max-w-[320px] text-[0.92rem] text-[#6e7b91]">
                  Looks like you haven't added any services yet. Start exploring our premium laser treatments.
                </p>
                <button
                  type="button"
                  onClick={handleAddMoreServices}
                  className="h-[48px] rounded-xl bg-[#8dbfda] px-8 text-[0.88rem] font-bold tracking-[0.05em] text-white shadow-lg transition-transform hover:scale-[1.02]"
                >
                  START SHOPPING
                </button>
              </div>
            )}

            {hasCartItem && (
               <div className="flex justify-start pt-2">
                <button
                  type="button"
                  onClick={handleAddMoreServices}
                  className="flex items-center gap-2 text-[0.88rem] font-bold text-[#8dbfda] hover:underline"
                >
                  <FiPlusCircle /> Add more services
                </button>
              </div>
            )}
          </section>

          {hasCartItem && (
          <aside className="sticky top-5 rounded-[20px] border border-[#e4e8ee] bg-white p-5 shadow-[0_10px_35px_rgba(0,0,0,0.03)] h-fit">
            <h2 className="mb-4 text-[1.2rem] font-bold text-[#1f2c42]">Order Summary</h2>
            
            <div className="space-y-3.5 border-b border-[#f0f3f6] pb-5 text-[0.92rem] text-[#5e6d84]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-[#1a2538]">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax (8%)</span>
                <span className="font-bold text-[#1a2538]">₹{estimatedTax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Arrival Fee</span>
                <span className="font-bold text-green-500 uppercase tracking-wider text-[0.75rem]">Free</span>
              </div>
              {disc > 0 && (
                <div className="flex justify-between text-green-600 font-semibold">
                  <span>Discount</span>
                   <span>-₹{disc.toLocaleString()}</span>
                </div>
              )}
            </div>

            <div className="my-4">
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="promo" className="block text-[0.73rem] font-bold tracking-[0.07em] text-[#8f9aae]">
                  PROMO CODE
                </label>
                {!promoDetails && (
                  <button
                    onClick={handleViewOffers}
                    className="text-[0.73rem] font-bold text-[#83c4e6] hover:underline"
                  >
                    VIEW OFFERS
                  </button>
                )}
              </div>
              
              <div className="flex flex-col gap-2">
                <div className="flex w-full gap-2">
                  <input
                    type="text"
                    id="promo"
                    placeholder="Enter code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className={`h-[34px] flex-1 min-w-0 rounded-lg border ${
                      promoError ? 'border-red-500' : 'border-[#dce3ec]'
                    } bg-[#fbfcfe] px-3 text-[#3a4659] outline-none text-sm`}
                    disabled={!!promoDetails}
                  />
                  {!promoDetails ? (
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      disabled={promoLoading}
                      className="h-[34px] whitespace-nowrap rounded-lg border border-[#dce3ec] bg-[#f5f8fc] px-3 sm:px-4 font-semibold text-[#4e5d75] hover:bg-[#e8ecf2] text-sm disabled:opacity-50"
                    >
                      {promoLoading ? "..." : "Apply"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleRemovePromo}
                      className="h-[34px] whitespace-nowrap rounded-lg border border-red-200 bg-red-50 px-3 sm:px-4 font-semibold text-red-600 hover:bg-red-100 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
                
                {promoError && (
                  <p className="text-[0.75rem] text-red-500">{promoError}</p>
                )}
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-[#edf0f5] pt-4">
              <span className="text-[1.2rem] sm:text-[1.35rem] md:text-[1.8rem] font-bold text-[#233047]">Total</span>
              <div className="text-right">
                {promoDetails && (
                  <div className="text-[0.7rem] sm:text-[0.8rem] text-[#8f9aae] line-through">
                    ₹{(subtotal + estimatedTax).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                )}
                <strong className="text-[1.4rem] sm:text-[1.7rem] md:text-[2.15rem] tracking-[-0.02em] text-[#222f45]">
                  ₹{total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </strong>
              </div>
            </div>
            <p className="mb-4 mt-1 text-right text-[0.72rem] text-[#afb8c6]">
              Installment options available at checkout
            </p>

            <button
              type="button"
              onClick={handleProceedToCheckout}
              disabled={!hasCartItem}
              className="h-[44px] sm:h-[50px] w-full rounded-[8px] sm:rounded-[10px] bg-gradient-to-b from-[#95cde9] to-[#79bada] text-[0.8rem] sm:text-[0.85rem] font-bold tracking-[0.12em] text-white shadow-[0_8px_20px_rgba(129,188,219,0.28)] transition-all hover:shadow-[0_8px_25px_rgba(129,188,219,0.4)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              PROCEED TO CHECKOUT
            </button>

            <div className="mt-3 flex justify-center gap-3 text-[1.2rem] sm:text-[1.28rem] text-[#b0b9c7]">
              <FaCcVisa />
              <FaCcMastercard />
              <FaCcAmex />
            </div>
          </aside>
          )}
        </div>
      </main>

      {/* OFFERS MODAL */}
      {showOffers && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-t-[20px] sm:rounded-[20px] bg-white p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#1f2c42]">Available Offers</h3>
              <button 
                onClick={() => setShowOffers(false)} 
                className="rounded-full bg-gray-100 p-2 text-gray-500 transition hover:bg-gray-200"
              >
                <FiPlus className="rotate-45" /> 
              </button>
            </div>
            
            <div className="max-h-[60vh] overflow-y-auto pr-1 space-y-4">
              {promoLoading ? (
                <div className="py-10 text-center text-gray-400">Loading offers...</div>
              ) : availablePromos.length === 0 ? (
                <div className="py-10 text-center text-gray-400">No offers available at this time.</div>
              ) : (
                availablePromos.map((p) => (
                  <div key={p.id} className="rounded-xl border border-dashed border-[#8dcae4] bg-[#f0f9ff] p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="inline-block rounded bg-white px-2 py-1 text-sm font-bold tracking-wider text-[#1a2538] border border-[#8dcae4]">
                          {p.id}
                        </div>
                        <p className="mt-2 text-sm font-semibold text-[#1f2c42]">{p.message || 'Special Discount'}</p>
                        {p.minOrder > 0 && (
                          <p className="text-xs text-gray-500 mt-1">Min. order ₹{p.minOrder}</p>
                        )}
                      </div>
                      <button 
                        onClick={() => applySpecificPromo(p.id)}
                        className="rounded-lg bg-[#8dcae4] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#79AFC6]"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
      </div>
      <Footer />
    </>
  );
}

export default Cart;
