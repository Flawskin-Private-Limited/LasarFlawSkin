import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import clinicImage from '../assets/images/laser-clinic-image.jpg';
import '../styles/CreateAccount.css';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { setAuthSession } from '../utils/authSession';
import { auth } from '../firebase/config';
import { signInWithCustomToken } from 'firebase/auth';

function CreateAccount() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    gender: '',
    age: '',
    otpInput: '',
    phone: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false
  });

  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [emailVerified, setEmailVerified] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [emailLocked, setEmailLocked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [popup, setPopup] = useState({ show: false, message: '', type: '' });
  const [timer, setTimer] = useState(0);
  const [isResendActive, setIsResendActive] = useState(false);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [isGenderOpen, setIsGenderOpen] = useState(false);
  const inputRefs = useRef([]);
  const genderRef = useRef(null);
  const [verifyButtonState, setVerifyButtonState] = useState('normal');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const passwordCriteria = {
  minLength: formData.password.length >= 8,
  hasUpper: /[A-Z]/.test(formData.password),
  hasNumber: /[0-9]/.test(formData.password),
  hasSpecial: /[!@#$%^&*]/.test(formData.password)
};

const passwordsMatch =
  formData.password &&
  formData.confirmPassword &&
  formData.password === formData.confirmPassword;

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            setIsResendActive(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (genderRef.current && !genderRef.current.contains(event.target)) {
        setIsGenderOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const showPopup = (message, type) => {
    setPopup({ show: true, message, type });
    setTimeout(() => {
      setPopup({ show: false, message: '', type: '' });
    }, 3000);
  };

  const sendOtp = async () => {
  if (!formData.email) {
    showPopup("Email is required", "error");
    return;
  }

  if (!validateEmail(formData.email)) {
    showPopup("Invalid email address", "error");
    return;
  }

  try {
    const response = await api.post("/auth/send-otp", {
      email: formData.email
    });

    // Handle special backend response (email already registered)
    if (
      response.status === 201 &&
      response.data.msg === "Email already registered!Please Login"
    ) {
      setEmailLocked(true);
      showPopup("Email already registered! Please Login", "error");
      return;
    }

    setShowOtp(true);
    setTimer(59);
    setIsResendActive(false);
    setOtpDigits(["", "", "", "", "", ""]);
    setFormData((prev) => ({ ...prev, otpInput: "" }));
    setVerifyButtonState("normal");

    showPopup("OTP sent to your email", "success");

    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);

  } catch (error) {
    console.error("Send OTP error:", error);

    const errorMessage =
      error.response?.data?.msg ||
      error.response?.data?.message ||
      "Failed to send OTP";

    showPopup(errorMessage, "error");
  }
};
  const handleVerifyOtp = async () => {

  if (formData.otpInput.length < 6) {
    showPopup('Please enter complete OTP', 'error');
    setVerifyButtonState('error');
    return;
  }

  try {

    setIsVerifyingOtp(true);

    const response = await api.post('/auth/verify-otp', {
      email: formData.email,
      otp: formData.otpInput
    });

    if (response.data.success) {
      setEmailVerified(true);
      setVerifyButtonState('success');
      showPopup('Email verified successfully', 'success');
    }

  } catch (error) {

    setVerifyButtonState('error');

    showPopup(
      error.response?.data?.message || 'Invalid OTP',
      'error'
    );

  } finally {
    setIsVerifyingOtp(false);
  }
};
  const handleOtpDigitChange = (index, value) => {
    if (value && !/^\d+$/.test(value)) return;

    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(0, 1);
    setOtpDigits(newDigits);

    const combinedOtp = newDigits.join('');
    setFormData(prev => ({ ...prev, otpInput: combinedOtp }));

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otpDigits[index] && index > 0) {
        inputRefs.current[index - 1].focus();
      } else {
        const newDigits = [...otpDigits];
        newDigits[index] = '';
        setOtpDigits(newDigits);
        setFormData(prev => ({ ...prev, otpInput: newDigits.join('') }));
      }
    }

    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1].focus();
    }

    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const digits = pastedData.split('');
    const newDigits = [...otpDigits];

    digits.forEach((digit, index) => {
      if (index < 6) newDigits[index] = digit;
    });

    setOtpDigits(newDigits);
    setFormData(prev => ({ ...prev, otpInput: newDigits.join('') }));
  };

  const handleResendOtp = () => {
    if (!isResendActive) return;
    sendOtp();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const selectGender = (val) => {
    setFormData(prev => ({ ...prev, gender: val }));
    setIsGenderOpen(false);
    if (errors.gender) setErrors(prev => ({ ...prev, gender: '' }));
  };

 const validateForm = () => {
  const newErrors = {};

  if (!formData.email) newErrors.email = "Email is required";
  if (!formData.name) newErrors.name = "Name is required";
  if (!formData.gender) newErrors.gender = "Gender is required";
  if (!formData.age) newErrors.age = "Age is required";
  if (!formData.phone) newErrors.phone = "Phone is required";

  if (!formData.password) {
    newErrors.password = "Password is required";
  }

  if (formData.password !== formData.confirmPassword) {
    newErrors.confirmPassword = "Passwords do not match";
  }

  if (!formData.termsAccepted) {
    newErrors.termsAccepted = "You must accept terms";
  }

  if (!emailVerified) {
    newErrors.email = "Please verify email first";
  }

  return newErrors;
};

  const handleSubmit = async (e) => {

      e.preventDefault();

      const newErrors = validateForm();
      setErrors(newErrors);

      if (Object.keys(newErrors).length > 0) return;

      try {

        setIsSubmitting(true);

        const response = await api.post('/auth/register', {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          gender: formData.gender,
          age: formData.age
        });

        if (response.data?.token && response.data?.user) {
          if (response.data.firebaseToken) {
            try {
              await signInWithCustomToken(auth, response.data.firebaseToken);
            } catch (fbErr) {
              console.warn('Firebase custom token sign-in failed:', fbErr.message);
            }
          }
          setAuthSession(response.data.token, response.data.user);

          // Save profile data locally so Navbar/Dashboard show the real name
          const profileData = {
            fullName: formData.name,
            email: formData.email,
            phone: formData.phone || '',
            gender: formData.gender || 'Female',
            image: (formData.gender === 'Male') ? '/men.png' : '/female.png',
            note: '',
            age: formData.age || '',
          };
          localStorage.setItem('profileData', JSON.stringify(profileData));
        }

        showPopup('Account created successfully!', 'success');
        setTimeout(() => {
          navigate('/');
        }, 900);

      } catch (error) {

        showPopup(
          error.response?.data?.msg || error.response?.data?.message || 'Registration failed',
          'error'
        );

      } finally {
        setIsSubmitting(false);
      }
};
  return (
    <div className="signup-split-layout">
      {popup.show && (
        <div className={`signup-popup-notification show ${popup.type}`}>
          <i className={`bi ${popup.type === 'success' ? 'bi-check-circle' : 'bi-exclamation-circle'}`}></i>
          {popup.message}
        </div>
      )}

      <div className="signup-image-side">
        <img src={clinicImage} alt="Laser Clinic" className="signup-clinic-image" />
        <div className="signup-image-overlay"></div>
        <div className="brand-header signup-logo-wrapper">
          <div className="brand-icon"><i className="bi bi-stars"></i></div>
          <div className="brand-text">Flaw Skin</div>
        </div>
        <div className="signup-hero-text">
          <h2 className="hero-heading">Reimagine Your Natural Radiance</h2>
          <p className="signup-hero-description">Clinical excellence and bespoke aesthetic care.</p>
        </div>
      </div>

      <div className="signup-form-side">
        <div className="signup-form-content">
          <h2 className="signup-form-title">Create Account</h2>
          <p className="signup-form-subtitle">Enter your details to join our premium membership</p>

          <form onSubmit={handleSubmit}>
            <div className="signup-form-field">
              <label className="signup-field-label">Email Address</label>
              <div className="signup-input-wrapper">
                <div className="signup-input-icon-box"><i className="bi bi-envelope"></i></div>
                <input 
                  type="email" name="email" className="signup-form-input"
                  value={formData.email} onChange={handleChange}
                  placeholder="Enter your email" 
                  disabled={emailLocked || emailVerified || isSubmitting || isVerifyingEmail}
                />
                {!emailVerified ? (
                  <button 
                    type="button" 
                    className={`signup-verify-inline-btn ${isVerifyingEmail ? 'verifying' : ''}`} 
                    onClick={sendOtp} 
                    disabled={emailLocked || isVerifyingEmail}
                  >
                    {isVerifyingEmail ? (
                      <>
                        <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                        <span className="visually-hidden">Loading...</span>
                      </>
                    ) : (
                      'VERIFY'
                    )}
                  </button>
                ) : (
                  <span className="signup-verified-tag"><i className="bi bi-patch-check-fill"></i></span>
                )}
              </div>
              {errors.email && <span className="field-error-msg">{errors.email}</span>}
            </div>

            {showOtp && !emailVerified && (
              <div className="signup-otp-section">
                <label className="signup-field-label">Verification Code</label>
                <div className="signup-otp-grid">
                  {otpDigits.map((digit, index) => (
                    <input
                      key={index} type="text" maxLength={1} className="signup-otp-box"
                      value={digit} ref={el => inputRefs.current[index] = el}
                      onChange={e => handleOtpDigitChange(index, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(index, e)}
                    />
                  ))}
                </div>
                <div className="signup-otp-actions">
                  <button type="button" className={`signup-resend-link ${isResendActive ? 'active' : ''}`} onClick={handleResendOtp}>
                    {isResendActive ? 'Resend Code' : `Resend in ${timer}s`}
                  </button>
                  <button type="button" className="signup-otp-verify-btn" onClick={handleVerifyOtp} disabled={isVerifyingOtp}>
                    {isVerifyingOtp ? (
                      <>
                        <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                        <span className="visually-hidden">Loading...</span>
                      </>
                    ) : 'Confirm OTP'}
                  </button>
                </div>
              </div>
            )}

            <div className="signup-form-field">
              <label className="signup-field-label">Name</label>
              <div className="signup-input-wrapper">
                <div className="signup-input-icon-box"><i className="bi bi-person"></i></div>
                <input 
                  type="text" name="name" className="signup-form-input" 
                  value={formData.name} onChange={handleChange} 
                  placeholder="Enter your full name" 
                />
              </div>
              {errors.name && <span className="field-error-msg">{errors.name}</span>}
            </div>

            <div className="signup-gender-age-row">
              <div className="signup-form-field" ref={genderRef}>
                <label className="signup-field-label">Gender</label>
                <div 
                    className={`signup-input-wrapper signup-dropdown-trigger ${isGenderOpen ? 'active' : ''}`}
                    onClick={() => setIsGenderOpen(!isGenderOpen)}
                >
                    <div className="signup-input-icon-box"><i className="bi bi-gender-ambiguous"></i></div>
                    <div className={`signup-dropdown-selected ${!formData.gender ? 'placeholder' : ''}`}>
                        {formData.gender || "Select"}
                    </div>
                    <i className={`bi bi-chevron-down signup-dropdown-arrow ${isGenderOpen ? 'open' : ''}`}></i>
                    
                    {isGenderOpen && (
                        <div className="signup-dropdown-menu">
                            <div className="signup-dropdown-item" onClick={() => selectGender('Male')}>Male</div>
                            <div className="signup-dropdown-item" onClick={() => selectGender('Female')}>Female</div>
                            <div className="signup-dropdown-item" onClick={() => selectGender('Not to say')}>Not to say</div>
                        </div>
                    )}
                </div>
                {errors.gender && <span className="field-error-msg">{errors.gender}</span>}
              </div>

              <div className="signup-form-field">
                <label className="signup-field-label">Age</label>
                <div className="signup-input-wrapper">
                  <div className="signup-input-icon-box"><i className="bi bi-calendar3"></i></div>
                  <input 
                    type="number" name="age" className="signup-form-input" 
                    value={formData.age} onChange={handleChange} 
                    placeholder="Years" 
                  />
                </div>
                {errors.age && <span className="field-error-msg">{errors.age}</span>}
              </div>
            </div>

            <div className="signup-form-field">
              <label className="signup-field-label">Phone Number</label>
              <div className="signup-input-wrapper">
                <div className="signup-input-icon-box"><i className="bi bi-phone"></i></div>
                <input type="tel" name="phone" className="signup-form-input" value={formData.phone} onChange={handleChange} placeholder="+91 00000 00000" />
              </div>
              {errors.phone && <span className="field-error-msg">{errors.phone}</span>}
            </div>

            <div className="signup-password-row">
              <div className="signup-form-field">
                <label className="signup-field-label">Password</label>
                <div className="signup-input-wrapper">
                  <input 
                    type={showPassword ? "text" : "password"} name="password"
                    className="signup-form-input" value={formData.password}
                    onChange={handleChange} placeholder="********"
                  />
                  <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} signup-eye`} onClick={() => setShowPassword(!showPassword)}></i>
                </div>
                {errors.password && <span className="field-error-msg">{errors.password}</span>}
                <div className="password-checklist">
                    <span className={passwordCriteria.minLength ? "valid" : ""}>● 8+ Characters</span>
                    <span className={passwordCriteria.hasUpper ? "valid" : ""}>● Uppercase</span>
                    <span className={passwordCriteria.hasNumber ? "valid" : ""}>● Number</span>
                    <span className={passwordCriteria.hasSpecial ? "valid" : ""}>● Symbol</span>
                </div>
              </div>

              <div className="signup-form-field">
                <label className="signup-field-label">Confirm</label>
                <div className="signup-input-wrapper">
                  <input 
                    type={showConfirmPassword ? "text" : "password"} name="confirmPassword"
                    className="signup-form-input" value={formData.confirmPassword}
                    onChange={handleChange} placeholder="********"
                  />
                  <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'} signup-eye`} onClick={() => setShowConfirmPassword(!showConfirmPassword)}></i>
                </div>
                {errors.confirmPassword && <span className="field-error-msg">{errors.confirmPassword}</span>}
                {formData.confirmPassword && (
                    <div className={`match-indicator ${passwordsMatch ? "valid" : "invalid"}`}>
                        {passwordsMatch ? "✓ Passwords match" : "✗ Passwords differ"}
                    </div>
                )}
              </div>
            </div>

            <div className="signup-checkbox-field">
              <input type="checkbox" name="termsAccepted" id="terms" checked={formData.termsAccepted} onChange={handleChange} />
              <label htmlFor="terms">I confirm I am 18+ and agree with <Link to="/terms-and-policy" className="signup-terms-link">Terms and Policy</Link></label>
              {errors.termsAccepted && <span className="field-error-msg" style={{display: 'block', marginTop: '5px'}}>{errors.termsAccepted}</span>}
            </div>

            <button type="submit" className="signup-submit-btn" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                  <span className="visually-hidden">Loading...</span>
                </>
              ) : "Complete Registration"}
            </button>

            <div className="signup-footer-row">
              <span>Already have an account?</span>
              <Link to="/sign-in" className="signup-signin-link">Sign In</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateAccount;