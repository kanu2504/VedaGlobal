import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CookiesPopup = () => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('vedsCookiesConsent');
    if (!consent) {
      // Show popup after 1.5 seconds delay for better UX
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('vedsCookiesConsent', 'accepted');
    setShowPopup(false);
  };

  const handleReject = () => {
    localStorage.setItem('vedsCookiesConsent', 'rejected');
    setShowPopup(false);
  };

  return (
    <AnimatePresence>
      {showPopup && (
        <motion.div
          className="cookies-popup-container"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          style={{
            position: 'fixed',
            bottom: '30px',
            left: '30px',
            maxWidth: '420px',
            width: 'calc(100% - 60px)',
            background: 'var(--bg-secondary)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(79, 95, 58, 0.2)',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.15)',
            zIndex: 999999,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.5rem' }}>🍪</span>
              <h4 style={{ margin: 0, color: 'var(--dark-green)', fontSize: '1.1rem', fontFamily: 'var(--font-sans)', fontWeight: 700 }}>
                Cookie Consent
              </h4>
            </div>
            
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              We use cookies to improve your browsing experience and personalize VedsGlobal services.
            </p>

            <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
              <button
                onClick={handleAccept}
                className="btn-primary hover-lift"
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  borderRadius: '30px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: 'none',
                  whiteSpace: 'nowrap',
                  justifyContent: 'center'
                }}
              >
                Accept Cookies
              </button>
              
              <button
                onClick={handleReject}
                className="hover-lift"
                style={{
                  padding: '10px 20px',
                  borderRadius: '30px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: 'transparent',
                  border: '1px solid rgba(79, 95, 58, 0.4)',
                  color: 'var(--dark-green)',
                  whiteSpace: 'nowrap',
                }}
              >
                Reject
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookiesPopup;
