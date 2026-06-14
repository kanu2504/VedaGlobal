import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useMode } from '../context/ModeContext';
import axios from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';

const CheckoutForm = ({ onSuccess }) => {
  const { cart, cartTotal, clearCart } = useCart();
  const { mode } = useMode();
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    address: '',
    pincode: '',
    paymentMode: 'Cash on Delivery (COD)'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
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

    if (!formData.customerName.trim()) {
      errs.customerName = 'Full Name is required';
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
    if (!formData.address.trim()) {
      errs.address = 'Delivery Address is required';
    }
    if (!formData.pincode.trim()) {
      errs.pincode = 'Pincode is required';
    } else if (formData.pincode.trim().length < 5) {
      errs.pincode = 'Please enter a valid pincode';
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

    if (cart.length === 0) {
      setError('Your shopping cart is empty.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        customerName: formData.customerName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        pincode: formData.pincode,
        mode: mode === 'B2B' ? 'Wholesale' : 'Retail',
        paymentMode: formData.paymentMode,
        items: cart.map(item => ({
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          price: item.price
        }))
      };

      const { data } = await axios.post('/orders', payload);
      setPlacedOrderId(data._id);
      setShowSuccessPopup(true);
      clearCart();
      setIsSubmitted(false);
      setFormErrors({});
      
      // Auto close after 3 seconds and navigate/callback
      setTimeout(() => {
        setShowSuccessPopup(false);
        if (onSuccess) {
          onSuccess(data);
        }
      }, 3000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-form-box">
      <h3>Shipping and Billing Information</h3>
      
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} noValidate className="checkout-form">
        <div className="form-group">
          <label className="form-label">Full Name *</label>
          <AnimatePresence>
            {isSubmitted && formErrors.customerName && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="validation-error-text"
              >
                ⚠️ {formErrors.customerName}
              </motion.div>
            )}
          </AnimatePresence>
          <input
            type="text"
            name="customerName"
            className="form-input"
            value={formData.customerName}
            onChange={handleChange}
            style={getInputStyle('customerName', formData.customerName)}
          />
        </div>

        <div className="form-group-row">
          <div className="form-group">
            <label className="form-label">Email Address *</label>
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
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              style={getInputStyle('email', formData.email)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Phone Number *</label>
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
              name="phone"
              className="form-input"
              value={formData.phone}
              onChange={handleChange}
              style={getInputStyle('phone', formData.phone)}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Delivery Address *</label>
          <AnimatePresence>
            {isSubmitted && formErrors.address && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="validation-error-text"
              >
                ⚠️ {formErrors.address}
              </motion.div>
            )}
          </AnimatePresence>
          <textarea
            name="address"
            className="form-input"
            rows="3"
            value={formData.address}
            onChange={handleChange}
            style={getInputStyle('address', formData.address)}
          ></textarea>
        </div>

        <div className="form-group">
          <label className="form-label">Pincode / Zipcode *</label>
          <AnimatePresence>
            {isSubmitted && formErrors.pincode && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="validation-error-text"
              >
                ⚠️ {formErrors.pincode}
              </motion.div>
            )}
          </AnimatePresence>
          <input
            type="text"
            name="pincode"
            className="form-input"
            value={formData.pincode}
            onChange={handleChange}
            style={getInputStyle('pincode', formData.pincode)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Payment Mode</label>
          <select
            name="paymentMode"
            className="form-input"
            value={formData.paymentMode}
            onChange={handleChange}
          >
            <option value="Cash on Delivery (COD)">Cash on Delivery (COD)</option>
            <option value="UPI Payment">UPI Payment</option>
            <option value="Net Banking">Net Banking</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Direct Bank Transfer">Direct Bank Transfer</option>
            <option value="Wallet Payment">Wallet Payment</option>
          </select>
        </div>

        <div className="order-summary-block">
          <h4>Order Summary</h4>
          <div className="order-summary-total-row">
            <span>Total Payable Amount:</span>
            <strong>₹{cartTotal}</strong>
          </div>
        </div>

        <button type="submit" className="btn-primary w-100 mt-3 hover-lift" disabled={loading || cart.length === 0}>
          {loading ? 'Processing Order...' : 'Place Order'}
        </button>
      </form>

      {/* Success Popup */}
      <AnimatePresence>
        {showSuccessPopup && (
          <>
            <motion.div
              className="success-popup-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(8px)',
                zIndex: 99999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px'
              }}
            >
              <motion.div
                className="success-popup-card"
                initial={{ scale: 0.9, y: 50, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 50, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '2px solid var(--matcha)',
                  borderRadius: '24px',
                  padding: '40px 30px',
                  maxWidth: '450px',
                  width: '100%',
                  textAlign: 'center',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 500, damping: 15 }}
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(79, 95, 58, 0.1)',
                      border: '3px solid var(--matcha)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--matcha)"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </motion.div>
                </div>

                <h3 style={{ color: 'var(--dark-green)', fontSize: '1.8rem', marginBottom: '12px', fontFamily: 'var(--font-sans)', fontWeight: '700' }}>
                  Order Placed!
                </h3>
                
                <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', margin: '0 0 16px 0', lineHeight: '1.5' }}>
                  Your order has been placed successfully!
                </p>

                {placedOrderId && (
                  <div style={{ 
                    backgroundColor: 'rgba(79, 95, 58, 0.05)', 
                    border: '1px dashed var(--matcha)', 
                    borderRadius: '12px', 
                    padding: '10px 16px',
                    display: 'inline-block',
                    fontSize: '0.9rem',
                    color: 'var(--dark-green)'
                  }}>
                    Order ID: <strong>{placedOrderId}</strong>
                  </div>
                )}

                <div style={{ marginTop: '24px' }}>
                  <div className="loading-bar-container" style={{ width: '100%', height: '4px', backgroundColor: 'rgba(79, 95, 58, 0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                    <motion.div 
                      className="loading-bar-fill" 
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 3, ease: 'linear' }}
                      style={{ height: '100%', backgroundColor: 'var(--matcha)' }}
                    />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CheckoutForm;
