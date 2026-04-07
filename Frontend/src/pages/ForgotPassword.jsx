import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, ArrowLeft, Loader2, CheckCircle2, RotateCw } from 'lucide-react';
import '../styles/ForgotPassword.css';
import flawSkin from '../assets/flawSkin.jpeg';
import api from '../api/axios'; // Assuming you have an API utility for making requests

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);
  const [countdown, setCountdown] = useState(0); // Timer state
  const toastTimerRef = useRef(null);

  // Handle Countdown Interval
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  // Reusable toast logic
  const triggerToast = () => {
    setShowToast(true);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);

    toastTimerRef.current = setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  // Handle primary "Send Reset Link"
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post('/auth/forgot-password', { email });
      if (response.status === 200) {
        setHasRequested(true);
        setCountdown(60);
        triggerToast();
      }
    } catch (error) {
      console.error('Error sending reset link:', error);
      toast.error(error.response?.data?.message || 'Failed to send reset link.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle secondary "Resend Link"
  const handleResend = async (e) => {
    e.preventDefault();
    if (!email || countdown > 0) return;

    setIsResending(true);

    try {
      await api.post('/auth/forgot-password', { email });
    } catch (error) {
      console.error('Error resending reset link:', error);
    }

    // Apply state updates matching AdminForgotPassword logic
    setIsResending(false);
    triggerToast();
    setEmail('');
    setCountdown(60); // Start 60-second cooldown
  };

  return (
    <div className="split-layout-container">

      {/* CUSTOM TOAST NOTIFICATION */}
      <div className={`custom-toast ${showToast ? 'show' : ''}`}>
        <CheckCircle2 size={18} className="toast-icon" />
        <span>Link send to your mail please check the mail.</span>
      </div>

      {/* LEFT PANEL */}
      <div className="left-panel" style={{ backgroundImage: `url(${flawSkin})` }}>
        <div className="glass-overlay">
          <div className="left-content">
            <div className="brand-logo">FLAWSKIN</div>
            <h1 className="hero-heading">Precision meets peace of mind.</h1>
            <p className="hero-subtext">
              Experience the next generation of skincare technology in a sanctuary designed for your comfort.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="right-panel">
        <div className="form-container">
          <h2 className="form-heading">Forgot Password</h2>
          <p className="form-subtext">
            No worries, it happens. Please enter the email associated with your account.
          </p>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="input-label">Email Address</label>
              <div className="input-wrapper">
                <div className="input-icon-left">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  placeholder="Enter your mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="custom-input"
                  required
                />
              </div>
            </div>

            {/* Primary Send Reset Link Button */}
            <button
              type="submit"
              className="submit-btn"
              disabled={isLoading || isResending || hasRequested}
            >
              {isLoading ? (
                <Loader2 size={20} className="spinner-icon" />
              ) : (
                <>
                  <span>Send Reset Link</span>
                  <ArrowRight size={18} className="btn-icon" />
                </>
              )}
            </button>

            {/* Conditionally Rendered Resend Link Button with Timer */}
            {hasRequested && (
              <button
                type="button"
                className="submit-btn resend-btn"
                onClick={handleResend}
                disabled={isLoading || isResending || countdown > 0}
              >
                {isResending ? (
                  <Loader2 size={20} className="spinner-icon" />
                ) : (
                  <>
                    <span>{countdown > 0 ? `Resend Link (${countdown}s)` : "Resend Link"}</span>
                    {countdown === 0 && <RotateCw size={18} className="btn-icon" />}
                  </>
                )}
              </button>
            )}
          </form>

          <div className="back-link-wrapper">
            <Link to="/sign-in" className="back-link">
              <ArrowLeft size={16} className="back-icon" />
              Back to Sign In
            </Link>
          </div>

          <div className="footer-section">
            <hr className="footer-divider" />
            <div className="footer-copy">
              <p>© 2024 FlawSkin Laser Clinic. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;