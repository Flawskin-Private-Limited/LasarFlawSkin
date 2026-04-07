import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { isAuthenticated, clearAuthSession } from "../utils/authSession";
import { getStoredProfile } from "../utils/profileData";
import { auth } from "../firebase/config";
import { signOut } from "firebase/auth";

const NAV_LINKS = [
  { label: "Services", href: "/women-service" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Booking", href: "/my-booking" },
  { label: "Feedback", href: "/feedback" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen]       = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled]       = useState(false);
  const navigate = useNavigate();
  const { getCartCount } = useCart();

  // Real auth state — checks localStorage for token
  const [loggedIn, setLoggedIn] = useState(() => isAuthenticated());
  const [profile, setProfile]   = useState(() => getStoredProfile());

  // Re-check auth state on route changes AND localStorage changes (multi-tab sync)
  const currentLocation = useLocation();
  
  useEffect(() => {
    const syncState = () => {
      setLoggedIn(isAuthenticated());
      setProfile(getStoredProfile());
    };
    
    syncState();
    
    // Listen for login/logout in other tabs
    window.addEventListener('storage', syncState);
    return () => window.removeEventListener('storage', syncState);
  }, [currentLocation.pathname]);

  const userName = profile?.fullName || profile?.name || "User";
  const userEmail = profile?.email || "";
  const userAvatar = profile?.image && !profile.image.startsWith('data:') ? profile.image : null;

  const profileRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const handleLogout = () => {
    clearAuthSession();
    signOut(auth).catch(() => {});
    localStorage.removeItem('profileData');
    setLoggedIn(false);
    setProfileOpen(false);
    setMenuOpen(false);
    navigate("/sign-in");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
        .nav-root { font-family: 'Outfit', sans-serif; }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -1px; left: 50%;
          transform: translateX(-50%);
          width: 0; height: 2px;
          background: #8dcae4;
          border-radius: 9999px;
          transition: width 0.28s cubic-bezier(.4,0,.2,1);
        }
        .nav-link:hover::after { width: 80%; }
        .dd-enter {
          animation: ddIn .18s cubic-bezier(.4,0,.2,1) both;
        }
        @keyframes ddIn {
          from { opacity:0; transform:translateY(-6px) scale(.96); }
          to   { opacity:1; transform:translateY(0)   scale(1);    }
        }
        .drawer {
          transition: max-height .36s cubic-bezier(.4,0,.2,1),
                      opacity    .28s cubic-bezier(.4,0,.2,1);
        }
        .hb { display:block; height:1.5px; background:currentColor; border-radius:9999px;
              transition: transform .28s ease, opacity .22s ease, width .28s ease; }
      `}</style>

      <nav className={`nav-root fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white ${
        scrolled || menuOpen
          ? "shadow-[0_1px_16px_rgba(0,0,0,0.08)]"
          : "border-b border-gray-100"
      }`}>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between h-16">

            <Link to="/" className="flex items-center gap-2.5 group select-none" aria-label="LaserRedux home">
              <div className="relative w-8 h-8 rounded-lg bg-[#8dcae4] flex items-center justify-center shadow-md shadow-[#aadce7] transition-all duration-300 group-hover:scale-110 group-hover:shadow-[#8dcae4] group-hover:rounded-xl">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07"
                    stroke="white" strokeWidth="2.3" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="text-[12.5px] font-bold tracking-[0.22em] text-gray-900 uppercase">
                Laser<span className="text-[#8dcae4]">Redux</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link key={link.label} to={link.href}
                  className="nav-link relative text-[13px] font-medium text-gray-500 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-50/80 transition-colors duration-200">
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-3">
              {!loggedIn ? (
                <>
                  <Link to="/sign-in"
                    className="text-[13px] font-semibold text-gray-600 hover:text-[#8dcae4] px-4 py-2 rounded-lg hover:bg-[#e3f1f7] transition-all duration-200">
                    Log In
                  </Link>
                  <Link to="/create-account"
                    className="text-[13px] font-semibold text-white bg-[#8dcae4] hover:bg-[#70b8d7] active:scale-95 px-5 py-2.5 rounded-xl shadow-md shadow-[#aadce7] hover:shadow-lg hover:shadow-[#8dcae4] transition-all duration-200">
                    Sign Up
                  </Link>
                  <Link to="/cart"
                    className="flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:text-[#8dcae4] hover:bg-[#e3f1f7] transition-all duration-200 relative"
                    aria-label="Shopping cart">
                    <CartIcon />
                    {getCartCount() > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {getCartCount() > 99 ? '99+' : getCartCount()}
                      </span>
                    )}
                  </Link>
                </>
              ) : (
                <div className="flex items-center gap-2.5">
                  <Link to="/cart"
                    className="flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:text-[#8dcae4] hover:bg-[#e3f1f7] transition-all duration-200 relative"
                    aria-label="Shopping cart">
                    <CartIcon />
                    {getCartCount() > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {getCartCount() > 99 ? '99+' : getCartCount()}
                      </span>
                    )}
                  </Link>
                  <div ref={profileRef} className="relative">
                  <button
                    onClick={() => setProfileOpen((v) => !v)}
                    aria-expanded={profileOpen}
                    aria-label="Open profile menu"
                    className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-xl border border-gray-200 hover:border-[#8dcae4] bg-white hover:bg-[#8dcae4/10] shadow-sm transition-all duration-200"
                  >
                    <Avatar name={userName} avatar={userAvatar} size="sm" />
                    <span className="text-[13px] font-semibold text-gray-800 max-w-[96px] truncate">
                      {userName.split(" ")[0]}
                    </span>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true"
                      className={`text-gray-400 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`}>
                      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>

                  {profileOpen && (
                    <div className="dd-enter absolute right-0 top-[calc(100%+10px)] w-58 min-w-[224px] bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.14)] border border-gray-100 overflow-hidden z-50">
                      <div className="flex items-center gap-3 px-4 py-3.5 bg-gradient-to-br from-[#e3f1f7] to-[#e8f5fa] border-b border-[#aadce7]">
                        <Avatar name={userName} avatar={userAvatar} size="md" />
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">{userName}</p>
                          <p className="text-xs text-gray-400 truncate">{userEmail}</p>
                        </div>
                      </div>

                      <div className="py-1.5">
                        <DDItem href="/profile-dashboard" icon={<DashIcon />} label="Profile Dashboard" onClick={() => setProfileOpen(false)} />
                        <DDItem href="/my-booking"  icon={<CalIcon />}  label="My Bookings"       onClick={() => setProfileOpen(false)} />
                        <DDItem href="/profile-settings"  icon={<GearIcon />} label="Settings"          onClick={() => setProfileOpen(false)} />
                      </div>

                      <div className="border-t border-gray-100 py-1.5">
                        <button onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors duration-150">
                          <SignOutIcon />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                </div>
              )}
            </div>

            <div className="md:hidden flex items-center gap-2">
              <Link to="/cart"
                className="flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:text-[#8dcae4] hover:bg-gray-100 active:bg-gray-200 transition-colors relative"
                aria-label="Shopping cart">
                <CartIcon />
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {getCartCount() > 99 ? '99+' : getCartCount()}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                className="flex flex-col justify-center items-center w-10 h-10 rounded-xl text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors gap-[5px]"
              >
                <span className={`hb w-[22px] ${menuOpen ? "translate-y-[6.5px] rotate-45" : ""}`} />
                <span className={`hb ${menuOpen ? "opacity-0 w-0" : "w-[14px]"}`} />
                <span className={`hb w-[22px] ${menuOpen ? "-translate-y-[6.5px] -rotate-45" : ""}`} />
              </button>
            </div>

          </div>
        </div>

        <div className={`drawer md:hidden overflow-hidden border-t border-gray-100 bg-white ${
          menuOpen ? "max-h-[540px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        }`}>
          <div className="px-4 pt-3 pb-5 space-y-0.5">

            {NAV_LINKS.map((link) => (
              <Link key={link.label} to={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between px-3 py-3 rounded-xl text-[14px] font-medium text-gray-700 hover:bg-[#e3f1f7] hover:text-[#70b8d7] transition-colors group">
                {link.label}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-gray-300 group-hover:text-[#8dcae4] transition-colors" aria-hidden="true">
                  <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            ))}

            <div className="pt-3 border-t border-gray-100 mt-1">
              {!loggedIn ? (
                <div className="flex flex-col gap-2.5">
                  <Link to="/sign-in" onClick={() => setMenuOpen(false)}
                    className="w-full text-center text-[14px] font-semibold text-[#8dcae4] border border-[#aadce7] bg-[#e3f1f7] hover:bg-[#d5eef5] py-3 rounded-xl transition-colors">
                    Log In
                  </Link>
                  <Link to="/create-account" onClick={() => setMenuOpen(false)}
                    className="w-full text-center text-[14px] font-semibold text-white bg-[#8dcae4] hover:bg-[#70b8d7] py-3 rounded-xl shadow-md shadow-[#aadce7] transition-all active:scale-[0.98]">
                    Sign Up — It's Free
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-1.5 bg-gray-50 p-2 rounded-2xl border border-gray-100">
                  <div className="flex items-center justify-between px-3 py-2.5">
                    <span className="text-[14px] font-semibold text-gray-900 truncate">
                      {userName}
                    </span>
                    <Link
                      to="/profile-dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="shrink-0 text-[12.5px] font-semibold text-white bg-[#8dcae4] hover:bg-[#70b8d7] active:scale-95 px-4 py-2 rounded-lg transition-all"
                    >
                      Dashboard
                    </Link>
                  </div>
                  <Link
                    to="/profile-settings"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-[14px] font-medium text-gray-600 hover:text-[#8dcae4] transition-colors"
                  >
                    <GearIcon /> Settings
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="h-[64px]" aria-hidden="true" />
    </>
  );
}

function Avatar({ name, avatar, size = "sm" }) {
  const sizes = { sm: "w-7 h-7 text-[11px]", md: "w-9 h-9 text-[12px]", lg: "w-10 h-10 text-[13px]" };
  const initials = name.split(" ").map((n) => n[0]).join("").toUpperCase();
  return (
    <div className={`${sizes[size]} rounded-lg bg-[#8dcae4] flex items-center justify-center text-white font-bold shadow-sm shrink-0`}>
      {avatar ? <img src={avatar} alt="" className="w-full h-full rounded-lg object-cover" /> : initials}
    </div>
  );
}

function DDItem({ href, icon, label, onClick }) {
  return (
    <Link to={href} onClick={onClick}
      className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-[#e3f1f7] hover:text-[#70b8d7] transition-colors duration-150">
      <span className="text-gray-400">{icon}</span>
      {label}
    </Link>
  );
}

function DashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8"/>
      <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8"/>
      <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8"/>
      <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8"/>
    </svg>
  );
}

function CalIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M16 3v4M8 3v4M3 9h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

function GearIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M12 2v2m0 16v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M2 12h2m16 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}

function SignOutIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="9" cy="21" r="1.5" stroke="currentColor" strokeWidth="1.8"/>
      <circle cx="20" cy="21" r="1.5" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}