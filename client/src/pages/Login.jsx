import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const validate = () => {
    const errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (isRegistering) {
      if (!name.trim()) errs.name = 'Name is required';
      if (!phone.trim()) {
        errs.phone = 'Phone number is required';
      } else {
        const cleanedPhone = phone.replace(/[^0-9]/g, '');
        if (cleanedPhone.length !== 10) {
          errs.phone = 'Please enter a valid 10-digit phone number';
        }
      }
    }
    
    if (!email.trim()) {
      errs.email = 'Email is required';
    } else if (!emailRegex.test(email.trim())) {
      errs.email = 'Please enter a valid email address';
    }

    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 8) {
      errs.password = 'Password must be at least 8 characters';
    }

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const getInputStyle = (field, value, extraStyles = {}) => {
    let base = {
      padding: '12px 16px',
      borderRadius: '10px',
      border: '1px solid rgba(79, 95, 58, 0.2)',
      fontSize: '0.95rem',
      transition: 'var(--transition)',
      ...extraStyles
    };
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

    if (isRegistering) {
      const res = await register(name, email, password, phone);
      if (res.success) {
        setSuccess('Registration successful! Logging you in...');
        setTimeout(() => {
          navigate(redirect);
        }, 1200);
      } else {
        setError(res.message);
      }
    } else {
      const res = await login(email, password);
      if (res.success) {
        setSuccess('Login successful!');
        setTimeout(() => {
          navigate(redirect);
        }, 1200);
      } else {
        setError(res.message);
      }
    }
  };

  return (
    <div className="login-page-wrapper" style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', marginTop: '40px' }}>
      <div className="login-split-container" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        maxWidth: '1000px',
        width: '100%',
        background: 'rgba(255, 255, 255, 0.85)',
        borderRadius: '30px',
        overflow: 'hidden',
        boxShadow: '0 20px 50px rgba(79, 95, 58, 0.1)',
        border: '1px solid rgba(79, 95, 58, 0.08)',
        backdropFilter: 'blur(20px)'
      }}>
        
        {/* Left Side: Brand Showcase (Hidden or stacked on mobile based on grid auto-fit) */}
        <div className="login-brand-side" style={{
          background: 'linear-gradient(135deg, var(--dark-green) 0%, #1f301f 100%)',
          color: 'var(--cream)',
          padding: '50px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Background overlay design */}
          <div style={{
            position: 'absolute',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'rgba(229, 210, 184, 0.05)',
            top: '-50px',
            left: '-50px'
          }}></div>

          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: '800', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--vanilla)' }}>
              VEDA GLOBAL EXPORTS
            </span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginTop: '16px', lineHeight: '1.2' }}>
              Cultivating Quality, Exporting Trust.
            </h2>
            <p style={{ marginTop: '20px', opacity: '0.8', lineHeight: '1.7', fontSize: '1.05rem', textAlign: 'justify' }}>
              Access premium Basmati rice, cold pressed oils, and Indian spices sourced directly from local farming communities with trace verification.
            </p>
          </div>

          <div style={{ marginTop: '40px', borderTop: '1px solid rgba(229, 210, 184, 0.15)', paddingTop: '20px' }}>
            <div style={{ fontStyle: 'italic', opacity: '0.9', fontSize: '0.95rem', textAlign: 'center' }}>
              “Delivering India’s Natural Goodness Globally”
            </div>
          </div>
        </div>

        {/* Right Side: Form Block */}
        <div className="login-form-side" style={{ padding: '50px' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--dark-green)', fontSize: '2rem', margin: '0 0 10px 0' }}>
            {isRegistering ? 'Join Us' : 'Welcome Back'}
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '30px', fontWeight: '500' }}>
            {isRegistering ? 'Create a customer account to get custom export quotes.' : 'Sign in to access catalog parameters and place enquiries.'}
          </p>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{ color: '#9c2a11', backgroundColor: '#fff7f5', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontWeight: '550', fontSize: '0.9rem', border: '1px solid rgba(156, 42, 17, 0.2)' }}
              >
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{ color: 'var(--dark-green)', backgroundColor: 'var(--cream)', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontWeight: '550', fontSize: '0.9rem', border: '1px solid rgba(6, 78, 59, 0.2)' }}
              >
                {success}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {isRegistering && (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label htmlFor="register-name" style={{ fontWeight: '600', color: 'var(--dark-green)', fontSize: '0.9rem' }}>Full Name *</label>
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
                    id="register-name"
                    name="name"
                    className="form-input"
                    style={getInputStyle('name', name)}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label htmlFor="register-phone" style={{ fontWeight: '600', color: 'var(--dark-green)', fontSize: '0.9rem' }}>Phone Number *</label>
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
                    id="register-phone"
                    name="phone"
                    className="form-input"
                    style={getInputStyle('phone', phone)}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>
              </>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label htmlFor="login-email" style={{ fontWeight: '600', color: 'var(--dark-green)', fontSize: '0.9rem' }}>Email Address *</label>
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
                id="login-email"
                name="email"
                className="form-input"
                style={getInputStyle('email', email)}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label htmlFor="login-password" style={{ fontWeight: '600', color: 'var(--dark-green)', fontSize: '0.9rem' }}>Password *</label>
              <AnimatePresence>
                {isSubmitted && formErrors.password && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }} 
                    exit={{ opacity: 0, height: 0 }} 
                    className="validation-error-text"
                  >
                    ⚠️ {formErrors.password}
                  </motion.div>
                )}
              </AnimatePresence>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="login-password"
                  name="password"
                  className="form-input"
                  style={getInputStyle('password', password, { padding: '12px 48px 12px 16px', width: '100%' })}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--matcha)',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 'bold',
                    padding: '4px',
                    zIndex: 2
                  }}
                >
                  {showPassword ? 'HIDE' : 'SHOW'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary hover-lift"
              style={{ padding: '14px', borderRadius: '30px', fontWeight: 'bold', fontSize: '1rem', border: 'none', cursor: 'pointer', marginTop: '10px' }}
            >
              {isRegistering ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <button
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError('');
                setSuccess('');
              }}
              style={{ background: 'none', border: 'none', color: 'var(--matcha)', fontWeight: '700', cursor: 'pointer', fontSize: '0.95rem' }}
            >
              {isRegistering ? 'Already have a customer account? Sign In' : "New to Veda Global? Register here"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
