import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Profile = () => {
  const { customer, updateProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (!customer) {
      navigate('/login?redirect=/profile');
      return;
    }
    setName(customer.name || '');
    setEmail(customer.email || '');
    setPhone(customer.phone || '');
    setAddress(customer.address || '');
    setPincode(customer.pincode || '');
  }, [customer, navigate]);

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'Name is required';
    if (!address.trim()) errs.address = 'Address is required';
    if (!pincode.trim()) errs.pincode = 'Pincode is required';
    if (phone.trim()) {
      const cleanedPhone = phone.replace(/[^0-9]/g, '');
      if (cleanedPhone.length !== 10) {
        errs.phone = 'Please enter a valid 10-digit phone number';
      }
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const getInputClass = (field, value) => {
    let classes = 'profile-input';
    if (!isEditing || !isSubmitted) return classes;
    if (formErrors[field]) return `${classes} validation-input-error`;
    if (value) return `${classes} validation-input-success`;
    return classes;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    setIsSubmitted(true);

    if (!validate()) {
      return;
    }

    const res = await updateProfile({ name, phone, address, pincode });
    if (res.success) {
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      setIsSubmitted(false);
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } else {
      setError(res.message);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!customer) return null;

  return (
    <div className="profile-page-wrapper">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="profile-card"
      >
        {/* Header/Banner Section */}
        <div className="profile-header">
          {/* Avatar */}
          <div className="profile-avatar">
            {name ? name.charAt(0).toUpperCase() : 'U'}
          </div>

          <div className="profile-meta">
            <span>Veda Customer Profile</span>
            <h2>{name}</h2>
            <p>{email}</p>
          </div>

          <button onClick={handleLogout} className="profile-btn-logout">
            Logout
          </button>
        </div>

        {/* Content Body */}
        <div className="profile-body">
          <AnimatePresence mode="wait">
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{ color: '#064E3B', backgroundColor: '#fdfaf3', padding: '12px 16px', borderRadius: '10px', marginBottom: '25px', fontWeight: '600', border: '1px solid rgba(201, 162, 74, 0.2)' }}
              >
                {success}
              </motion.div>
            )}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{ color: '#9c2a11', backgroundColor: '#fff7f5', padding: '12px 16px', borderRadius: '10px', marginBottom: '25px', fontWeight: '600', border: '1px solid rgba(156, 42, 17, 0.2)' }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSave} noValidate className="profile-form" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="profile-form-grid">
              
              <div className="profile-field">
                <label htmlFor="profile-name" className="profile-label">Full Name</label>
                <AnimatePresence>
                  {isEditing && isSubmitted && formErrors.name && (
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
                  id="profile-name"
                  name="name"
                  className={getInputClass('name', name)}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className="profile-field">
                <label htmlFor="profile-email" className="profile-label">Email (Verification)</label>
                <input
                  type="email"
                  id="profile-email"
                  name="email"
                  className="profile-input"
                  value={email}
                  disabled
                />
              </div>

            </div>

            <div className="profile-form-grid">
              
              <div className="profile-field">
                <label htmlFor="profile-phone" className="profile-label">Phone Number</label>
                <AnimatePresence>
                  {isEditing && isSubmitted && formErrors.phone && (
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
                  type="text"
                  id="profile-phone"
                  name="phone"
                  className={getInputClass('phone', phone)}
                  value={phone}
                  placeholder="Enter phone number"
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className="profile-field">
                <label htmlFor="profile-pincode" className="profile-label">Pincode / Zip Code</label>
                <AnimatePresence>
                  {isEditing && isSubmitted && formErrors.pincode && (
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
                  id="profile-pincode"
                  name="pincode"
                  className={getInputClass('pincode', pincode)}
                  value={pincode}
                  placeholder="Enter Pincode"
                  onChange={(e) => setPincode(e.target.value)}
                  disabled={!isEditing}
                />
              </div>

            </div>

            <div className="profile-field">
              <label htmlFor="profile-address" className="profile-label">Delivery Address</label>
              <AnimatePresence>
                {isEditing && isSubmitted && formErrors.address && (
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
                id="profile-address"
                name="address"
                className={getInputClass('address', address)}
                rows="4"
                style={{ resize: 'vertical', fontFamily: 'inherit' }}
                value={address}
                placeholder="Enter complete shipping address"
                onChange={(e) => setAddress(e.target.value)}
                disabled={!isEditing}
              />
            </div>

            {/* Profile Action Buttons */}
            <div className="profile-button-group">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={() => { setIsEditing(false); setIsSubmitted(false); }}
                    className="profile-btn-cancel"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="profile-btn-save"
                  >
                    Save Profile
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="profile-btn-save"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
