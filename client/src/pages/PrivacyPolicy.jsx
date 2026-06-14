import React from 'react';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
  const cards = [
    {
      title: "Information We Collect",
      // Inbox Icon (SVG path)
      svg: <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
      text: "We collect trade registration data, contact names, email addresses, phone numbers, shipping destinations, and billing details required to process global agricultural orders."
    },
    {
      title: "How We Use Data",
      // Gear Icon
      svg: <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
      text: "Your data is used to secure container bookings, handle custom clearance, verify phyto-sanitary compliance, send order updates, and respond to commercial inquiries."
    },
    {
      title: "Data Security",
      // Shield Icon
      svg: <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
      text: "We implement advanced encryption standards (AES-256) and secure firewalls to ensure that corporate credentials and shipment transaction records remain confidential."
    },
    {
      title: "Cookies Policy",
      // Shield/Database/Disk Icon used as policy placeholder
      svg: <svg viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/></svg>,
      text: "Our website uses essential analytics cookies to personalize your catalog browsing sessions, optimize load speeds, and remember your wholesale vs retail preference."
    },
    {
      title: "Third Party Services",
      // Users/Handshake Icon
      svg: <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
      text: "We only share logistic details with verified ocean/air freight carriers, custom house agents (CHAs), and international regulatory boards for dispatch validation."
    },
    {
      title: "Contact Information",
      // Mail/Inbox Icon
      svg: <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
      text: "For legal queries, data access requests, or policy disputes, reach out directly to our designated compliance desk at legal@vedaglobal.com."
    }
  ];

  return (
    <div className="policy-page">
      {/* Hero Section */}
      <div className="policy-hero">
        <div className="container">
          <motion.h1 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Privacy Policy
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            Sourcing trust, exporting security. Learn how Veda Global safeguards your commercial information.
          </motion.p>
        </div>
      </div>

      {/* Grid Content Section */}
      <div className="container policy-grid-container">
        <div className="policy-grid">
          {cards.map((card, idx) => (
            <motion.div
              key={idx}
              className="policy-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.06 }}
              whileHover={{ y: -5, scale: 1.02 }}
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '16px',
                padding: '25px',
                border: '1px solid rgba(6, 78, 59, 0.1)',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: '15px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="policy-card-icon">{card.svg}</span>
                <h3 style={{ color: 'var(--heading-color)', margin: 0, fontSize: '1.25rem', fontWeight: '750', fontFamily: 'var(--font-serif)' }}>
                  {card.title}
                </h3>
              </div>
              <p style={{ color: 'var(--secondary-text)', fontSize: '0.95rem', lineHeight: '1.7', margin: 0 }}>
                {card.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
