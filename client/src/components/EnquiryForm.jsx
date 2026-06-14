import React, { useState } from 'react';
import axios from '../api/axios';
import { useMode } from '../context/ModeContext';
import { motion, AnimatePresence } from 'framer-motion';

const EnquiryForm = ({ product, onSuccess }) => {
  const { mode } = useMode();
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    quantity: 1,
    message: `We are interested in your product: ${product ? product.name : ''}. Please provide price quotes and shipping specifications.`,
    enquiryType: 'Product Enquiry'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error for this field if user types
    if (isSubmitted) {
      setFormErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = () => {
    const errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.contactPerson.trim()) {
      errs.contactPerson = 'Contact Person is required';
    }
    if (!formData.email.trim()) {
      errs.email = 'Email is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required';
    } else {
      const cleanedPhone = formData.phone.replace(/[^0-9]/g, '');
      if (cleanedPhone.length < 8) {
        errs.phone = 'Please enter a valid phone number';
      }
    }
    if (!formData.message.trim()) {
      errs.message = 'Inquiry details are required';
    }

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const getInputStyle = (field, value, extraStyles = {}) => {
    let base = { ...extraStyles };
    if (!isSubmitted) return base;
    if (formErrors[field]) {
      return {
        ...base,
        border: '2px solid #DC2626',
        backgroundColor: 'rgba(220, 38, 38, 0.04)',
      };
    }
    if (value) {
      return {
        ...base,
        border: '2px solid #16A34A',
      };
    }
    return base;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitted(true);

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        productId: product ? product._id : undefined,
        productName: product ? product.name : 'General Enquiry',
        mode: mode === 'B2B' ? 'Wholesale' : 'Retail'
      };

      await axios.post('/enquiries', payload);
      setSuccess('Your enquiry has been submitted successfully! Our sales division will contact you shortly.');
      setFormData({
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        quantity: 1,
        message: '',
        enquiryType: 'Product Enquiry'
      });
      setIsSubmitted(false);
      setFormErrors({});
      if (onSuccess) {
        setTimeout(onSuccess, 3000);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Something went wrong. Please check your network and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="enquiry-form-container">
      <h3>Submit B2B Export Enquiry</h3>
      {product && <p className="enquiry-product-ref">Product: <strong>{product.name}</strong></p>}
      
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit} noValidate className="enquiry-form">
        <div className="form-group-row">
          <div className="form-group">
            <label htmlFor="enqform-companyName" className="form-label">Company Name</label>
            <input
              type="text"
              id="enqform-companyName"
              name="companyName"
              className="form-input"
              placeholder="e.g. Agri Global Import LLC"
              value={formData.companyName}
              onChange={handleChange}
              style={getInputStyle('companyName', formData.companyName)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="enqform-contactPerson" className="form-label">Contact Person *</label>
            <AnimatePresence>
              {isSubmitted && formErrors.contactPerson && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="validation-error-text"
                >
                  ⚠️ {formErrors.contactPerson}
                </motion.div>
              )}
            </AnimatePresence>
            <input
              type="text"
              id="enqform-contactPerson"
              name="contactPerson"
              className="form-input"
              placeholder="Your full name"
              value={formData.contactPerson}
              onChange={handleChange}
              style={getInputStyle('contactPerson', formData.contactPerson)}
            />
          </div>
        </div>

        <div className="form-group-row">
          <div className="form-group">
            <label htmlFor="enqform-email" className="form-label">Corporate Email *</label>
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
              id="enqform-email"
              name="email"
              className="form-input"
              placeholder="buyer@company.com"
              value={formData.email}
              onChange={handleChange}
              style={getInputStyle('email', formData.email)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="enqform-phone" className="form-label">Phone Number *</label>
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
              id="enqform-phone"
              name="phone"
              className="form-input"
              placeholder="+1 555-123-4567"
              value={formData.phone}
              onChange={handleChange}
              style={getInputStyle('phone', formData.phone)}
            />
          </div>
        </div>

        <div className="form-group-row">
          <div className="form-group">
            <label htmlFor="enqform-quantity" className="form-label">Target Quantity (in Packages/Units)</label>
            <input
              type="number"
              id="enqform-quantity"
              name="quantity"
              className="form-input"
              min="1"
              value={formData.quantity}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="enqform-enquiryType" className="form-label">Inquiry Type</label>
            <select
              id="enqform-enquiryType"
              name="enquiryType"
              className="form-input"
              value={formData.enquiryType}
              onChange={handleChange}
            >
              <option value="Product Enquiry">Product Enquiry</option>
              <option value="Bulk Order">Bulk Order Request</option>
              <option value="Partnership">Partnership Enquiry</option>
              <option value="Other">Other Query</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="enqform-message" className="form-label">Details / Special Requirements *</label>
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
            id="enqform-message"
            name="message"
            className="form-input"
            rows="4"
            placeholder="Specify target packaging requirements, port of discharge, quality inspection parameters, etc."
            value={formData.message}
            onChange={handleChange}
            style={getInputStyle('message', formData.message)}
          ></textarea>
        </div>

        <button type="submit" className="btn-primary w-100" disabled={loading}>
          {loading ? 'Submitting Enquiry...' : 'Submit Wholesale Enquiry'}
        </button>
      </form>
    </div>
  );
};

export default EnquiryForm;
