import React from 'react';
import { motion } from 'framer-motion';

const TermsConditions = () => {
  const cards = [
    {
      title: "Website Usage",
      svg: <svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
      text: "Veda Global grants commercial importers access to browse agricultural stocks, issue quote enquiries, and verify certifications solely for trade purposes."
    },
    {
      title: "Product Information",
      svg: <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
      text: "While we seek absolute accuracy, all weights, physical specifications, moisture content, and crop grades are approximations subject to final pre-shipment survey."
    },
    {
      title: "Pricing Policy",
      svg: <svg viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
      text: "Global bulk rates fluctuate due to seasonal agricultural variables. Confirmed trade desk quotes are legally binding only for the duration noted on the formal sheet."
    },
    {
      title: "User Responsibilities",
      svg: <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/></svg>,
      text: "Users must provide authentic verification details. Any attempt to supply fraudulent import registration or forge corporate details will terminate trade relations."
    },
    {
      title: "Intellectual Property",
      svg: <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M14.83 9.17a4 4 0 1 0 0 5.66"/></svg>,
      text: "All trademark logos, leaf branding, layout styles, and catalog assets belong to Veda Global. Reproduction is prohibited without strict written authorization."
    },
    {
      title: "Limitation of Liability",
      svg: <svg viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
      text: "We are not liable for transit crop spoilage caused by maritime shipping bottlenecks, custom delays at destinations, or force majeure occurrences."
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
            Terms & Conditions
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            Please review the standard terms of business and shipping compliance with Veda Global.
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

export default TermsConditions;
