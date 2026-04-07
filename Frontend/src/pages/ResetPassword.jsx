// src/pages/ResetPassword.jsx

import React, { useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import '../styles/ResetPassword.css';
import api from '../api/axios';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();
  const { token } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

    if (newPassword.length < 8) {
      setErrorMsg("Password must be at least 8 characters long.");
      return;
    }

    if (!hasUpperCase) {
      setErrorMsg("Password must include at least 1 uppercase letter.");
      return;
    }

    if (!hasSpecialChar) {
      setErrorMsg("Password must include at least 1 special character.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    if (!token) {
      setErrorMsg("Invalid or expired reset link. Please request a new one.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await api.post(`/auth/reset-password/${token}`, {
        password: newPassword
      });

      if (response.status === 200) {
        setShowModal(true);
      }

    } catch (error) {
      console.error('Error resetting password:', error);
      setErrorMsg('Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    setShowModal(false);
    navigate('/sign-in');
  };

  return (
    <div className="reset-page-container">

      {/* Success Modal */}
      {showModal && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-card">
            <h3 className="custom-modal-title">Password Updated Successfully</h3>
            <p className="custom-modal-message">
              Your password has been reset.<br />
              You will now be redirected to Sign In.
            </p>
            <div className="custom-modal-footer">
              <button className="custom-modal-btn" onClick={handleContinue}>
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="reset-card">
        <div className="reset-brand-header">
          <span className="brand-text">Flaw Skin</span>
        </div>

        <h2 className="reset-heading">Reset Password</h2>
        <p className="reset-subtext">
          Please enter your new password below to<br />secure your account.
        </p>

        <form onSubmit={handleSubmit} className="reset-form">

          {/* New Password */}
          <div className="form-group">
            <label className="input-label">NEW PASSWORD</label>
            <div className="custom-input-group">
              <div className="icon-left">
                <img src="https://api.iconify.design/bi/lock.svg?color=%2394a3b8" alt="lock" />
              </div>

              <input
                type={showPassword1 ? "text" : "password"}
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="custom-input"
                required
              />

              <div
                className="icon-right toggle-icon"
                onClick={() => setShowPassword1(!showPassword1)}
              >
                <img
                  src={
                    showPassword1
                      ? "https://api.iconify.design/bi/eye.svg?color=%2394a3b8"
                      : "https://api.iconify.design/bi/eye-slash.svg?color=%2394a3b8"
                  }
                  alt="toggle visibility"
                />
              </div>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="form-group mb-small">
            <label className="input-label">CONFIRM NEW PASSWORD</label>

            <div className="custom-input-group">
              <div className="icon-left">
                <img src="https://api.iconify.design/bi/check-circle.svg?color=%2394a3b8" alt="confirm" />
              </div>

              <input
                type={showPassword2 ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="custom-input"
                required
              />

              <div
                className="icon-right toggle-icon"
                onClick={() => setShowPassword2(!showPassword2)}
              >
                <img
                  src={
                    showPassword2
                      ? "https://api.iconify.design/bi/eye.svg?color=%2394a3b8"
                      : "https://api.iconify.design/bi/eye-slash.svg?color=%2394a3b8"
                  }
                  alt="toggle visibility"
                />
              </div>
            </div>
          </div>

          {/* Helper / Error Text */}
          <div className="helper-text-wrapper">
            {errorMsg ? (
              <span className="error-text">{errorMsg}</span>
            ) : (
              <span className="helper-text">
                Must be at least 8 characters long, 1 uppercase, 1 special character.
              </span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="reset-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Reset Password"
            )}
          </button>

        </form>

        {/* Back Link */}
        <div className="back-link-wrapper">
          <Link to="/sign-in" className="back-link">
            <img
              src="https://api.iconify.design/bi/arrow-left.svg?color=%2364748b"
              alt="back"
              className="back-icon"
            />
            Back to Sign In
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="reset-footer">
        <p>© 2024 Flaw Skin Laser Clinic <span className="footer-divider">|</span> Support</p>
      </div>

    </div>
  );
};

export default ResetPassword;