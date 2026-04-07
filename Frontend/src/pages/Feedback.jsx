import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Feedback.css';
import api from '../api/axios'; // Assuming you have an API utility for making requests
const Feedback = () => {
  const [formData, setFormData] = useState({
    treatment: '',
    rating: 0,
    comment: '',
    agreeTerms: false
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [hoverRating, setHoverRating] = useState(0);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state for button
  
  // Toast notification state
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success' // 'success', 'error', 'info'
  });

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast(prev => ({ ...prev, show: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const showToast = (message, type = 'success') => {
    setToast({
      show: true,
      message,
      type
    });
  };

  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'treatment':
        if (!value) {
          error = 'Please select a treatment';
        }
        break;

      case 'rating':
        if (value === 0) {
          error = 'Please rate your satisfaction';
        }
        break;

      case 'comment':
        if (!value.trim()) {
          error = 'Please share your feedback';
        } else if (value.trim().length < 10) {
          error = 'Feedback must be at least 10 characters';
        } else if (value.trim().length > 1000) {
          error = 'Feedback must be less than 1000 characters';
        }
        break;

      case 'agreeTerms':
        if (!value) {
          error = 'You must agree to the Terms of Service and Privacy Policy';
        }
        break;

      default:
        break;
    }

    return error;
  };

  const validateForm = () => {
    const newErrors = {};
    
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Validate on change if field has been touched or submit was attempted
    if (touched[name] || submitAttempted) {
      const error = validateField(name, newValue);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    const error = validateField(name, formData[name]);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleStarClick = (selectedRating) => {
    setFormData(prev => ({
      ...prev,
      rating: selectedRating
    }));
    
    // Validate rating
    if (touched.rating || submitAttempted) {
      const error = validateField('rating', selectedRating);
      setErrors(prev => ({
        ...prev,
        rating: error
      }));
    }
  };

  const handleStarHover = (hoveredRating) => {
    setHoverRating(hoveredRating);
  };

  const handleStarLeave = () => {
    setHoverRating(0);
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmitAttempted(true);

  const allTouched = {};
  Object.keys(formData).forEach((key) => {
    allTouched[key] = true;
  });
  setTouched(allTouched);

  if (!validateForm()) {
    const firstError = document.querySelector(".is-invalid");
    if (firstError) {
      firstError.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    showToast("Please fix the errors in the form.", "error");
    return;
  }

  try {
    setIsLoading(true);

    const response = await api.post("/feedback", {
      ...formData,
      submittedAt: new Date().toISOString()
    });
   
    showToast(
      response.data.message || "Thank you for your feedback!",
      "success"
    );

    setFormData({
      treatment: "",
      rating: 0,
      comment: "",
      agreeTerms: false
    });

    setTouched({});
    setSubmitAttempted(false);
    setErrors({});

  } catch (error) {

    console.error(error);

    showToast(
      error.response?.data?.message ||
      "Something went wrong while submitting feedback.",
      "error"
    );

  } finally {
    setIsLoading(false);
  }
};
  const getFieldClass = (fieldName) => {
    const hasError = errors[fieldName];
    const isTouched = touched[fieldName] || submitAttempted;
    
    if (!isTouched) return 'form-control form-control-lg border-start-0 bg-light';
    return `form-control form-control-lg border-start-0 bg-light ${hasError ? 'is-invalid' : 'is-valid'}`;
  };

  const getSelectClass = () => {
    const hasError = errors.treatment;
    const isTouched = touched.treatment || submitAttempted;
    
    if (!isTouched) return 'form-select form-select-lg border-start-0 bg-light';
    return `form-select form-select-lg border-start-0 bg-light ${hasError ? 'is-invalid' : 'is-valid'}`;
  };

  return (
    <main className="split-screen">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`toast-notification toast-${toast.type}`}>
          <div className="toast-content">
            {toast.type === 'success' && (
              <svg className="toast-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
              </svg>
            )}
            {toast.type === 'error' && (
              <svg className="toast-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
              </svg>
            )}
            {toast.type === 'info' && (
              <svg className="toast-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
              </svg>
            )}
            <span className="toast-message">{toast.message}</span>
          </div>
          <button 
            className="toast-close"
            onClick={() => setToast(prev => ({ ...prev, show: false }))}
          >
          </button>
        </div>
      )}

      {/* Left Section - Hero Image and Branding */}
      <section className="hero-image-container-feedback">
        {/* Logo/Brand Top Left */}
        <div className="d-flex align-items-center gap-2">
          <svg className="icon-lg" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L12 22M2 12L22 12M19.07 4.93L4.93 19.07M19.07 19.07L4.93 4.93" stroke="white" strokeLinecap="round" strokeWidth="2"></path>
          </svg>
          <span className="h4 fw-semibold mb-0">FlawSkin</span>
        </div>

        {/* Hero Text Overlay */}
        <div className="hero-text-feedback">
          <h1 className="display-4 fw-bold mb-4">
            Your journey to perfection matters.
          </h1>
          <p className="fs-5 opacity-75">
            We value your experience. Your feedback helps us maintain the gold standard in aesthetic care.
          </p>
        </div>

        {/* Empty spacer for flex-between alignment */}
        <div></div>
      </section>

      {/* Right Section - Feedback Form */}
      <section className="form-section">
        <div className="form-container">
          {/* Form Header */}
          <div className="mb-4">
            <h2 className="fw-bold text-flaw-dark mb-2">Treatment Feedback</h2>
            <p className="text-flaw-gray small">
              Please tell us about your recent visit and help us improve.
            </p>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="needs-validation" noValidate>
            {/* Treatment Received Field */}
            <div className="mb-4">
              <label htmlFor="treatment" className="form-label fw-medium text-flaw-dark small">
                Treatment Received <span className="text-danger">*</span>
              </label>
              <div className="input-group has-validation">
                <span className="input-group-text bg-transparent border-end-0">
                  <svg className="icon-sm text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                </span>
                <select
                  className={getSelectClass()}
                  id="treatment"
                  name="treatment"
                  value={formData.treatment}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isLoading}
                  required
                >
                  <option value="" disabled>Select a treatment</option>
                  <option value="laser-hair-removal">Laser Hair Removal</option>
                  
                </select>
                {(touched.treatment || submitAttempted) && errors.treatment && (
                  <div className="invalid-feedback">
                    {errors.treatment}
                  </div>
                )}
              </div>
            </div>

            {/* Overall Satisfaction - Star Rating */}
            <div className="mb-4">
              <label className="form-label fw-medium text-flaw-dark small">
                Overall Satisfaction <span className="text-danger">*</span>
              </label>
              <div 
                className={`star-rating-container ${(touched.rating || submitAttempted) && errors.rating ? 'is-invalid' : ''}`}
                onBlur={() => {
                  setTouched(prev => ({ ...prev, rating: true }));
                }}
              >
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="star-btn"
                      onClick={() => handleStarClick(star)}
                      onMouseEnter={() => handleStarHover(star)}
                      onMouseLeave={handleStarLeave}
                      disabled={isLoading}
                      aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
                    >
                      <svg
                        className={`star-icon ${star <= (hoverRating || formData.rating) ? 'filled' : ''} ${star <= hoverRating ? 'hovered' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Rating feedback messages */}
              {formData.rating > 0 && (
                <div className="mt-2 small" style={{ color: '#92CCE1' }}>
                  You selected {formData.rating} star{formData.rating !== 1 ? 's' : ''}
                </div>
              )}
              
              {(touched.rating || submitAttempted) && errors.rating && (
                <div className="invalid-feedback d-block">
                  {errors.rating}
                </div>
              )}
              
              {(touched.rating || submitAttempted) && !errors.rating && formData.rating > 0 && (
                <div className="valid-feedback d-block">
                  ✓ Thank you for rating
                </div>
              )}
            </div>

            {/* Your Comments Field */}
            <div className="mb-4">
              <label htmlFor="comment" className="form-label fw-medium text-flaw-dark small">
                Your Comments <span className="text-danger">*</span>
              </label>
              <div className="input-group has-validation">
                <span className="input-group-text bg-transparent border-end-0 align-items-start pt-3">
                  <svg className="icon-sm text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                </span>
                <textarea
                  className={getFieldClass('comment')}
                  id="comment"
                  name="comment"
                  placeholder="Share your experience with us..."
                  rows="1"
                  value={formData.comment}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isLoading}
                  required
                />
                {(touched.comment || submitAttempted) && (
                  <div className="invalid-feedback">
                    {errors.comment}
                  </div>
                )}
              </div>
              
              {/* Character count */}
              {formData.comment && (
                <div className="mt-1 small text-flaw-gray text-end">
                  {formData.comment.length}/1000 characters
                </div>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="mb-4">
              <div className="form-check">
                <input
                  type="checkbox"
                  className={`form-check-input border-flaw-border ${(touched.agreeTerms || submitAttempted) && errors.agreeTerms ? 'is-invalid' : ''}`}
                  id="terms"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isLoading}
                  required
                />
                <label className="form-check-label small text-flaw-gray" htmlFor="terms">
                  I agree to the <a href="/terms-and-policy" className="text-flaw-blue text-decoration-none hover-underline">Terms of Service</a> and <a href="/terms-and-policy" className="text-flaw-blue text-decoration-none hover-underline">Privacy Policy</a>.
                </label>
              </div>
              {(touched.agreeTerms || submitAttempted) && errors.agreeTerms && (
                <div className="invalid-feedback d-block">
                  {errors.agreeTerms}
                </div>
              )}
            </div>

            {/* Submit Button with Loading State */}
            <div className="mb-3">
              <button
                type="submit"
                className="btn btn-primary-custom w-100 py-3 d-flex align-items-center justify-content-center border-0"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Feedback
                    <svg className="ms-2 icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                    </svg>
                  </>
                )}
              </button>
            </div>

            {/* Return to Dashboard Link */}
            <div className="text-center">
              <a 
                href="#" 
                className="return-link"
                onClick={(e) => {
                  e.preventDefault();
                  console.log("Return to dashboard");
                  // Add your navigation logic here
                }}
              >
                <svg 
                  className="return-icon icon-sm" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M10 19l-7-7m0 0l7-7m-7 7h18" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
                Return to Dashboard
              </a>
            </div>
          </form>

          {/* Footer */}
          <div className="footer-text text-center">
            <p className="small text-uppercase text-gray-400 tracking-widest mb-0">
              © FLAW SKIN &nbsp;
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Feedback;