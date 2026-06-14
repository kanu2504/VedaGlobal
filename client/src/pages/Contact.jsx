import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../api/axios';
import { useMode } from '../context/ModeContext';

const Contact = () => {
  const { mode } = useMode();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', text: '' });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validate = () => {
    const errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.name.trim()) errs.name = 'Name is required';
    if (!formData.message.trim()) errs.message = 'Message is required';
    
    if (!formData.email.trim()) {
      errs.email = 'Email is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required';
    } else {
      const cleanedPhone = formData.phone.replace(/[^0-9]/g, '');
      if (cleanedPhone.length !== 10) {
        errs.phone = 'Please enter a valid 10-digit phone number';
      }
    }

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const getInputClass = (field, value) => {
    let classes = 'form-input';
    if (!isSubmitted) return classes;
    if (formErrors[field]) return `${classes} validation-input-error`;
    if (value) return `${classes} validation-input-success`;
    return classes;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', text: '' });
    setIsSubmitted(true);

    if (!validate()) {
      setLoading(false);
      return;
    }

    try {
      await axios.post('/enquiries', {
        ...formData,
        productName: 'General Inquiry',
        mode: mode === 'B2B' ? 'Wholesale' : 'Retail'
      });
      setStatus({
        type: 'success',
        text: 'Thank you! Your inquiry has been received. Our trade desk will get back to you shortly.'
      });
      setFormData({ name: '', email: '', phone: '', message: '' });
      setIsSubmitted(false);
    } catch (err) {
      console.error(err);
      setStatus({
        type: 'danger',
        text: err.response?.data?.message || 'Something went wrong. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">

      <section className="section contact-section">
        <div className="container contact-grid">
          
          {/* Left: Contact Info */}
          <motion.div 
            className="contact-info-block"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span className="section-subtitle">GET IN TOUCH</span>
            <h2>Office & Export Facilities</h2>
            <p className="contact-intro-text">
              Have questions about certificates, pricing, or custom packaging? Fill out the form, or reach out directly to our global trade representatives.
            </p>

            <div className="contact-details-list">
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <div>
                  <h4>Registered Head Office</h4>
                  <p>Veda Global Tower, Phase-II Export Hub, New Delhi, 110025, India</p>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <div>
                  <h4>Trade Representative</h4>
                  <p>+91 98765 43210 (Global Sales Support)</p>
                  <p>+91 11 2543 9876 (Landline Office)</p>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon">✉️</span>
                <div>
                  <h4>Electronic Enquiries</h4>
                  <p>info@vedaglobal.com (General Desk)</p>
                  <p>export@vedaglobal.com (Trade Desk)</p>
                </div>
              </div>
            </div>

            {/* Google Map Placeholder (Aesthetic Glassmorphism Box) */}
            <div className="map-placeholder">
              <div className="map-inner">
                <span className="map-icon">🗺️</span>
                <h4>Veda Global Facilities Location</h4>
                <p>New Delhi Export Zone Phase-II, India</p>
                <small>(Interactive map locked - export control facility)</small>
              </div>
            </div>
          </motion.div>

          {/* Right: Contact Form */}
          <motion.div 
            className="contact-form-block"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3>Send Message</h3>
            <p>Our specialists generally reply in less than 24 hours.</p>

            {status.text && (
              <div className={`alert alert-${status.type}`}>
                {status.text}
              </div>
            )}

            <form onSubmit={handleFormSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="contact-name" className="form-label">Full Name</label>
                <AnimatePresence>
                  {isSubmitted && formErrors.name && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }} 
                      animate={{ opacity: 1, height: 'auto' }} 
                      exit={{ opacity: 0, height: 0 }} 
                      className="validation-error-text"
                    >
                      ⚠️ {formErrors.name}
                    </motion.div>
                  )}
                </AnimatePresence>
                <input
                  type="text"
                  id="contact-name"
                  name="name"
                  className={getInputClass('name', formData.name)}
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact-email" className="form-label">Email Address</label>
                <AnimatePresence>
                  {isSubmitted && formErrors.email && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }} 
                      animate={{ opacity: 1, height: 'auto' }} 
                      exit={{ opacity: 0, height: 0 }} 
                      className="validation-error-text"
                    >
                      ⚠️ {formErrors.email}
                    </motion.div>
                  )}
                </AnimatePresence>
                <input
                  type="email"
                  id="contact-email"
                  name="email"
                  className={getInputClass('email', formData.email)}
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact-phone" className="form-label">Phone Number (with Country Code)</label>
                <AnimatePresence>
                  {isSubmitted && formErrors.phone && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }} 
                      animate={{ opacity: 1, height: 'auto' }} 
                      exit={{ opacity: 0, height: 0 }} 
                      className="validation-error-text"
                    >
                      ⚠️ {formErrors.phone}
                    </motion.div>
                  )}
                </AnimatePresence>
                <input
                  type="tel"
                  id="contact-phone"
                  name="phone"
                  className={getInputClass('phone', formData.phone)}
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="contact-message" className="form-label">Your Message / Requirements</label>
                <AnimatePresence>
                  {isSubmitted && formErrors.message && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }} 
                      animate={{ opacity: 1, height: 'auto' }} 
                      exit={{ opacity: 0, height: 0 }} 
                      className="validation-error-text"
                    >
                      ⚠️ {formErrors.message}
                    </motion.div>
                  )}
                </AnimatePresence>
                <textarea
                  id="contact-message"
                  name="message"
                  className={getInputClass('message', formData.message)}
                  rows="5"
                  required
                  placeholder="Detail your request, specifying required product volume, target delivery ports, etc."
                  value={formData.message}
                  onChange={handleInputChange}
                ></textarea>
              </div>

              <button type="submit" className="btn-primary w-100" disabled={loading}>
                {loading ? 'Sending Message...' : 'Submit Inquiry'}
              </button>
            </form>
          </motion.div>

        </div>
      </section>
    </div>
  );
};

export default Contact;
