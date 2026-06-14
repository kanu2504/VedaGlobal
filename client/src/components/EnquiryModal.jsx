import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../api/axios';
import { useMode } from '../context/ModeContext';

const EnquiryModal = ({ isOpen, onClose, productName, productId }) => {
  const { mode } = useMode();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState({
    id: productId || '',
    name: productName || ''
  });

  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    email: '',
    phone: '',
    country: '',
    message: `We are interested in sourcing ${productName || 'your products'}. Please send us export quotes, certification details, and packaging options.`
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Fetch all products for the dropdown
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/products');
        setProducts(res.data || []);
      } catch (err) {
        console.error('Error fetching products for dropdown:', err);
      }
    };
    if (isOpen) {
      fetchProducts();
    }
  }, [isOpen]);

  // Synchronize when opened with props (e.g. from details page)
  useEffect(() => {
    setSelectedProduct({
      id: productId || '',
      name: productName || ''
    });
    setFormData(prev => ({
      ...prev,
      message: `We are interested in sourcing ${productName || 'your products'}. Please send us export quotes, certification details, and packaging options.`
    }));
    setIsSubmitted(false);
    setFormErrors({});
  }, [productId, productName, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (isSubmitted) {
      setFormErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleProductChange = (e) => {
    const val = e.target.value;
    if (!val) {
      setSelectedProduct({ id: '', name: '' });
      setFormData(prev => ({
        ...prev,
        message: `We are interested in sourcing your products. Please send us export quotes, certification details, and packaging options.`
      }));
    } else {
      const match = products.find(p => p._id === val);
      if (match) {
        setSelectedProduct({ id: match._id, name: match.name });
        setFormData(prev => ({
          ...prev,
          message: `We are interested in sourcing ${match.name}. Please send us export quotes, certification details, and packaging options.`
        }));
      }
    }
  };

  const validate = () => {
    const errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) {
      errs.name = 'Full Name is required';
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
    if (!formData.country.trim()) {
      errs.country = 'Destination country is required';
    }
    if (!formData.message.trim()) {
      errs.message = 'Message details are required';
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
    setIsSubmitted(true);

    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      const payload = {
        productId: selectedProduct.id || null,
        productName: selectedProduct.name || 'General Inquiry',
        companyName: formData.companyName,
        contactPerson: formData.name,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        message: formData.message,
        enquiryType: 'Product Enquiry',
        mode: mode === 'B2B' ? 'Wholesale' : 'Retail'
      };
      await axios.post('/enquiries', payload);
      setSuccess(true);
      setIsSubmitted(false);
      setFormErrors({});
      setTimeout(() => {
        setSuccess(false);
        onClose();
        // Reset form
        setFormData({
          name: '',
          companyName: '',
          email: '',
          phone: '',
          country: '',
          message: `We are interested in sourcing ${productName || 'your products'}. Please send us export quotes, certification details, and packaging options.`
        });
      }, 3000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-overlay" style={{ zIndex: 9999 }}>
          <motion.div 
            className="modal-content enquiry-modal-content"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="modal-header">
              <h2>Request Export Quote / Enquiry</h2>
              <button className="modal-close-btn" onClick={onClose}>×</button>
            </div>
            
            {success ? (
              <motion.div 
                className="success-message text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌱</div>
                <h3>Enquiry Submitted Successfully</h3>
                <p>Thank you for contacting Veda Global. Our export desk will get back to you shortly with specifications and prices.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="enquiry-form">
                {error && <div className="form-error">{error}</div>}
                
                <div className="form-group-row">
                  <div className="form-group">
                    <label htmlFor="enquiry-name">Full Name *</label>
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
                      id="enquiry-name"
                      name="name" 
                      className="form-input" 
                      value={formData.name} 
                      onChange={handleChange}
                      placeholder="e.g. John Doe"
                      style={getInputStyle('name', formData.name)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="enquiry-companyName">Company Name</label>
                    <input 
                      type="text" 
                      id="enquiry-companyName"
                      name="companyName" 
                      className="form-input" 
                      value={formData.companyName} 
                      onChange={handleChange}
                      placeholder="e.g. Global Imports LLC"
                      style={getInputStyle('companyName', formData.companyName)}
                    />
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label htmlFor="enquiry-email">Corporate Email *</label>
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
                      id="enquiry-email"
                      name="email" 
                      className="form-input" 
                      value={formData.email} 
                      onChange={handleChange}
                      placeholder="e.g. purchasing@company.com"
                      style={getInputStyle('email', formData.email)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="enquiry-phone">Phone Number *</label>
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
                      id="enquiry-phone"
                      name="phone" 
                      className="form-input" 
                      value={formData.phone} 
                      onChange={handleChange}
                      placeholder="e.g. +1 555-0199"
                      style={getInputStyle('phone', formData.phone)}
                    />
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label htmlFor="enquiry-country">Destination Country *</label>
                    <AnimatePresence>
                      {isSubmitted && formErrors.country && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="validation-error-text"
                        >
                          ⚠️ {formErrors.country}
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <input 
                      type="text" 
                      id="enquiry-country"
                      name="country" 
                      className="form-input" 
                      value={formData.country} 
                      onChange={handleChange}
                      placeholder="e.g. United States"
                      style={getInputStyle('country', formData.country)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="enquiry-product">Product of Interest</label>
                    <select
                      id="enquiry-product"
                      name="productId"
                      className="form-input"
                      value={selectedProduct.id}
                      onChange={handleProductChange}
                      style={getInputStyle('productId', selectedProduct.id, {
                        background: '#FDFBF7',
                        border: '1px solid #D4AF37',
                        color: '#0B3D2E',
                        fontWeight: '500',
                        cursor: 'pointer',
                        width: '100%'
                      })}
                    >
                      <option value="">Select Product of Interest</option>
                      {products.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="enquiry-message">Message / Requirements *</label>
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
                    id="enquiry-message"
                    name="message" 
                    className="form-input" 
                    rows="4" 
                    value={formData.message} 
                    onChange={handleChange}
                    style={getInputStyle('message', formData.message)}
                  ></textarea>
                </div>

                <div style={{ marginTop: '2rem' }}>
                  <button 
                    type="submit" 
                    className="btn-primary hover-lift" 
                    style={{ 
                      width: '100%', 
                      padding: '14px', 
                      borderRadius: '50px', 
                      backgroundColor: '#8f9e8b', 
                      color: '#ffffff', 
                      border: 'none', 
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      cursor: 'pointer',
                      display: 'block'
                    }}
                    disabled={loading}
                  >
                    {loading ? 'Submitting...' : 'Submit Enquiry'}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EnquiryModal;
