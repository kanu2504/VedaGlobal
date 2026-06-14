import React from 'react';
import { motion } from 'framer-motion';

const ShippingPolicy = () => {
  const cards = [
    {
      title: "Processing Time",
      svg: <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>,
      text: "Retail orders ship in 2-4 business days. Bulk trade shipments (FCL/LCL orders) require 7-15 days for customs check, phyto-sanitary screening, and freight bookings."
    },
    {
      title: "Domestic Shipping",
      svg: <svg viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13" rx="2" ry="2"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
      text: "Within India, we use trusted road surface express courier partners. Standard domestic deliveries arrive at target commercial spots within 3 to 7 business days."
    },
    {
      title: "International Shipping",
      svg: <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
      text: "We support FOB, CFR, and CIF incoterms. Maritime cargo transit takes 15 to 40 days to global hubs (Americas, Europe, Gulf, Asia). Air dispatch takes 5-10 days."
    },
    {
      title: "Tracking Information",
      svg: <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
      text: "Once the container clears port terminal gates or cargo planes leave, complete ocean bill of lading (B/L) details and tracking links are shared immediately."
    },
    {
      title: "Customs & Duties",
      svg: <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
      text: "The import destination duties, custom clearances, warehouse charges, and local agricultural board taxes are the sole responsibility of the importer."
    },
    {
      title: "Delivery Delays",
      svg: <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
      text: "We are not liable for transit port bottlenecks, weather disruptions, or sea freight route blocks. However, our logistics desk offers support for all status issues."
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
            Shipping Policy
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            Learn about dispatch timelines, shipping hubs, and international maritime logistics.
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

export default ShippingPolicy;
