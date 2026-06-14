import React from 'react';
import { motion } from 'framer-motion';

const ReturnRefundPolicy = () => {
  const cards = [
    {
      title: "Return Eligibility",
      svg: <svg viewBox="0 0 24 24"><polyline points="21,8 21,21 3,21 3,8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>,
      text: "Retail refund queries must be requested within 7 days of arrival. The package items must remain completely unopened, sealed, and in original condition."
    },
    {
      title: "Damaged Products",
      svg: <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>,
      text: "If a retail pack arrives damaged or incorrect, email photos to support@vedaglobal.com within 48 hours. We will arrange a replacement or refund."
    },
    {
      title: "Refund Process",
      svg: <svg viewBox="0 0 24 24"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>,
      text: "Once inspected and approved by our quality control desk, standard refunds are processed back to the original method in 5-10 business days."
    },
    {
      title: "Non-Refundable Items",
      svg: <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>,
      text: "Opened grocery bags, custom label retail orders, or commercial wholesale shipments cleared by port authorities are strictly non-refundable."
    },
    {
      title: "Cancellation Policy",
      svg: <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>,
      text: "Retail orders can be cancelled before standard dispatch. Bulk wholesale orders cannot be cancelled once custom documents are filed."
    },
    {
      title: "Contact Support",
      svg: <svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
      text: "For questions about returning packages or refund timelines, our support representatives are available 24/7 at support@vedaglobal.com."
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
            Refund Policy
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            Review our rules regarding retail order cancellations, damaged packages, and refund processing.
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

export default ReturnRefundPolicy;
