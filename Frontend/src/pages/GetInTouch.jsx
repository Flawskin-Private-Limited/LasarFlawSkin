import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/GetInTouch.css';
import api from '../api/axios';
import { submitContactForm } from '../firebase/feedbackService';

const GetInTouch = () => {

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    message: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success'
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

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

      case 'full_name':
        if (!value.trim()) {
          error = 'Full name is required';
        } else if (value.trim().length < 2) {
          error = 'Name must be at least 2 characters';
        }
        break;

      case 'email':
        if (!value.trim()) {
          error = 'Email address is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid email address';
        }
        break;

      case 'message':
        if (!value.trim()) {
          error = 'Message is required';
        } else if (value.trim().length < 10) {
          error = 'Message must be at least 10 characters';
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
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (touched[name]) {

      const error = validateField(name, value);

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

  const handleSubmit = async (e) => {

    e.preventDefault();

    const allTouched = {};

    Object.keys(formData).forEach(key => {
      allTouched[key] = true;
    });

    setTouched(allTouched);

    if (!validateForm()) {

      showToast('Please fix the errors in the form.', 'error');

      const firstError = document.querySelector('.is-invalid');

      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      return;
    }

    try {

      setIsLoading(true);

      // Submit to Firebase using existing contact form service
      await submitContactForm(formData);

      showToast(
        'Message sent successfully! We will get back to you soon.',
        'success'
      );

      setFormData({
        full_name: '',
        email: '',
        message: ''
      });

      setErrors({});
      setTouched({});

    } catch (error) {

      console.error(error);

      showToast(
        error.response?.data?.message || 'Something went wrong',
        'error'
      );

    } finally {

      setIsLoading(false);

    }
  };

  const getFieldClass = (fieldName) => {

    if (!touched[fieldName]) {
      return 'form-control form-control-lg border-start-0 bg-light';
    }

    return `form-control form-control-lg border-start-0 bg-light ${
      errors[fieldName] ? 'is-invalid' : 'is-valid'
    }`;
  };

  return (
    <main className="split-screen d-flex">

      {toast.show && (
        <div className={`toast-notification toast-${toast.type}`}>
          <div className="toast-content">
            <span className="toast-message">{toast.message}</span>
          </div>
          <button
            className="toast-close"
            onClick={() => setToast(prev => ({ ...prev, show: false }))}
          />
        </div>
      )}

      <section className="form-section d-flex flex-column justify-content-center align-items-center p-4 p-lg-5 bg-white">

        <div className="form-container w-100">

          <div className="header-area mb-3">
            <h2 className="fw-bold text-flaw-dark mb-2">Get in Touch</h2>
            <p className="text-flaw-gray small">
              Experience premium laser treatments in a FlawSkin environment.
            </p>
          </div>

          <form className="contact-form" noValidate onSubmit={handleSubmit}>

            <div className="form-group mb-3">
              <label className="form-label small">Full Name *</label>

              <input
                type="text"
                className={getFieldClass('full_name')}
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Jane Doe"
                disabled={isLoading}
              />

              {touched.full_name && errors.full_name && (
                <div className="invalid-feedback">
                  {errors.full_name}
                </div>
              )}

            </div>

            <div className="form-group mb-3">

              <label className="form-label small">Email *</label>

              <input
                type="email"
                className={getFieldClass('email')}
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="jane@example.com"
                disabled={isLoading}
              />

              {touched.email && errors.email && (
                <div className="invalid-feedback">
                  {errors.email}
                </div>
              )}

            </div>

            <div className="form-group mb-3">

              <label className="form-label small">Message *</label>

              <textarea
                className={getFieldClass('message')}
                name="message"
                value={formData.message}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="How can we help you?"
                rows="3"
                disabled={isLoading}
              />

              {touched.message && errors.message && (
                <div className="invalid-feedback">
                  {errors.message}
                </div>
              )}

            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Message'}
            </button>

          </form>

        </div>

      </section>

    </main>
  );
};

export default GetInTouch;