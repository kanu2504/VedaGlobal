import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const adminInfo = localStorage.getItem('adminInfo');
    if (adminInfo) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const validate = () => {
    const errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      errs.email = 'Email is required';
    } else if (!emailRegex.test(email.trim())) {
      errs.email = 'Please enter a valid email address';
    }

    if (!password) {
      errs.password = 'Password is required';
    }

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const getInputStyle = (field, value) => {
    if (!isSubmitted) return {};
    if (formErrors[field]) {
      return {
        border: '2px solid #DC2626',
        backgroundColor: 'rgba(220, 38, 38, 0.04)',
      };
    }
    if (value) {
      return {
        border: '2px solid #16A34A',
      };
    }
    return {};
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitted(true);

    if (!validate()) {
      return;
    }

    setLoading(true);

    // Strictly validate correct admin credentials
    if (email !== 'admin@vedaglobal.com' || password !== 'Admin@1234') {
      setError('Invalid admin email or password');
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post('/admin/login', { email, password });
      localStorage.setItem('adminInfo', JSON.stringify(data));
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      console.error(err);
      setError('Invalid admin email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="login-box animate-fade-in">
        <div className="login-header text-center">
          <h2>Veda Global</h2>
          <p>Admin Trade Portal</p>
        </div>

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="admin-email" className="form-label">Admin Email</label>
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
              id="admin-email"
              name="email"
              className="form-input"
              placeholder="e.g. admin@vedaglobal.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (isSubmitted) {
                  setFormErrors(prev => {
                    const next = { ...prev };
                    delete next.email;
                    return next;
                  });
                }
              }}
              style={getInputStyle('email', email)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="admin-password" className="form-label">Password</label>
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
            <input
              type="password"
              id="admin-password"
              name="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (isSubmitted) {
                  setFormErrors(prev => {
                    const next = { ...prev };
                    delete next.password;
                    return next;
                  });
                }
              }}
              style={getInputStyle('password', password)}
            />
          </div>

          <button type="submit" className="btn-primary w-100" disabled={loading}>
            {loading ? 'Authenticating...' : 'Access Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
