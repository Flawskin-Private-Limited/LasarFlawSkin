import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import signInImage from '../assets/images/SignIn.jpg'; // Correct path to assets/images folder
import "../styles/SignIn.css";  // This looks in the styles folder
import { useNavigate } from 'react-router-dom';
import api from '../api/axios'; // Assuming you have an API utility for making requests
import { setAuthSession } from '../utils/authSession';
import { auth } from '../firebase/config';
import { signInWithCustomToken } from 'firebase/auth';
import { loadProfileFromFirestore } from '../utils/profileData';
function SignIn() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(false);
  const [popup, setPopup] = useState({ show: false, message: '', type: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Hardcoded demo credentials have been removed

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const showPopup = (message, type) => {
    setPopup({ show: true, message, type });
    setTimeout(() => {
      setPopup({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!validateEmail(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const newErrors = validateForm();

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    showPopup('Please fix the errors before submitting', 'error');
    return;
  }

  try {
    setIsLoading(true);

    const response = await api.post('/auth/login', formData);

    if (response.status === 200) {
      // Authenticate with Firebase using the custom token
      if (response.data.firebaseToken) {
        try {
          await signInWithCustomToken(auth, response.data.firebaseToken);
        } catch (fbErr) {
          console.warn('Firebase custom token sign-in failed (project mismatch?):', fbErr.message);
        }
      }

      setAuthSession(response.data.token, response.data.user);
      
      const user = response.data.user || {};
      const profileData = {
        fullName: user.name || user.fullName || user.email?.split('@')[0] || 'User',
        email: user.email || formData.email,
        phone: user.phone || '',
        gender: user.gender || 'Female',
        image: user.image || ((user.gender === 'Male') ? '/men.png' : '/female.png'),
        note: user.note || '',
        age: user.age || '',
      };
      
      localStorage.setItem('profileData', JSON.stringify(profileData));

      if (user.id || user._id) {
        await loadProfileFromFirestore(user.id || user._id).catch(() => {});
      }

      showPopup('Login successful', 'success');

      // redirect
      setTimeout(() => {
        navigate('/');
      }, 1000);
    }

  } catch (error) {
    console.error('Error during sign-in:', error);
    showPopup(
      error.response?.data?.msg || error.response?.data?.message || 'Invalid email or password',
      'error'
    );
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="signin-split-layout">
      {popup.show && (
        <div className={`signin-popup-notification show ${popup.type}`}>
          <i className={`bi ${popup.type === 'success' ? 'bi-check-circle' : 'bi-exclamation-circle'} toast-icon`}></i>
          {popup.message}
        </div>
      )}

      <div className="signin-image-side">
        <div className="signin-image-overlay"></div>
        <img 
          src={signInImage}
          alt="Laser Clinic" 
          className="signin-clinic-image"
        />
        
        <div className="brand-header signin-logo-wrapper">
          <div className="brand-icon">
            <i className="bi bi-stars"></i>
          </div>
          <div className="brand-text">Flaw Skin</div>
        </div>

        <div className="signin-hero-text">
          <h2 className="hero-heading">Precision in every pulse.</h2>
          <p className="signin-hero-description">
            Experience the future of skin care with our advanced laser technology.
          </p>
        </div>
      </div>

      <div className="signin-form-side">
        <div className="signin-form-content">
          <h2 className="signin-form-title">Sign In</h2>
          <p className="signin-form-subtitle">Welcome back to your premium care portal.</p>

          <form onSubmit={handleSubmit}>
            <div className="signin-form-field">
              <label className="signin-field-label">Email Address</label>
              <div className={`signin-input-wrapper ${errors.email ? 'signin-field-error' : ''}`}>
                <div className="signin-input-icon-box">
                  <i className="bi bi-envelope"></i>
                </div>
                <input 
                  type="email" 
                  name="email"
                  className="signin-form-input"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
              </div>
              {errors.email && <span className="signin-error-message">{errors.email}</span>}
            </div>

            <div className="signin-form-field">
              <div className="signin-label-row">
                <label className="signin-field-label">Password</label>
                <Link to="/forgot-password" style={{pointerEvents: isLoading ? 'none' : 'auto'}} className="signin-forgot-link">Forgot password?</Link>
              </div>
              <div className={`signin-input-wrapper ${errors.password ? 'signin-field-error' : ''}`}>
                <div className="signin-input-icon-box">
                  <i className="bi bi-lock"></i>
                </div>
                <input 
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="signin-form-input"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                <i 
                  className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} signin-password-toggle ${isLoading ? 'disabled' : ''}`}
                  onClick={() => !isLoading && setShowPassword(!showPassword)}
                ></i>
              </div>
              {errors.password && <span className="signin-error-message">{errors.password}</span>}
            </div>

            <div className="signin-checkbox-field">
              <input 
                type="checkbox" 
                id="rememberDevice" 
                checked={rememberDevice}
                onChange={(e) => setRememberDevice(e.target.checked)}
                disabled={isLoading}
              />
              <label htmlFor="rememberDevice">Remember this device</label>
            </div>

            <button type="submit" className="signin-submit-btn" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner-border"></span>
                  <span>Processing...</span>
                </>
              ) : "Sign In"}
            </button>

            <div className="signin-create-row">
              <span>Don't have an account?</span>
              <Link to="/create-account" style={{pointerEvents: isLoading ? 'none' : 'auto'}}>Create Account</Link>
            </div>

            <div className="signin-footer-section">
              <hr className="signin-footer-divider" />
              <div className="signin-footer-links">
                <Link to="/terms-and-policy">Terms and policy</Link>
                <span className="signin-footer-separator">·</span>
                <Link to="/contact">Contact Support</Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignIn;