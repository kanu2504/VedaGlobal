import React from 'react';
import { motion } from 'framer-motion';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sophia Martinez",
      location: "Madrid, Spain",
      review: "The Basmati rice we sourced from Veda Global has exceptional aroma and grain length. Our customers in Spain absolutely love it. Excellent packaging and delivery speed.",
      rating: 5,
      product: "Premium Basmati Rice"
    },
    {
      name: "David Chen",
      location: "Vancouver, Canada",
      review: "Outstanding quality of organic seeds. Their flax and sesame seeds met all our compliance standards with zero hassle. Will definitely keep ordering in bulk.",
      rating: 5,
      product: "Organic Seeds"
    },
    {
      name: "Amina Al-Mansoor",
      location: "Dubai, UAE",
      review: "Excellent response times and client support. The cold-pressed oils are pure and aromatic, matching our premium gourmet retail standards perfectly.",
      rating: 5,
      product: "Cold Pressed Oils"
    },
    {
      name: "Liam O'Connor",
      location: "Dublin, Ireland",
      review: "Importing agricultural goods from India was made seamless by their documentation team. Every shipment of ground spices arrives on time and completely fresh.",
      rating: 4,
      product: "Indian Spices"
    },
    {
      name: "Yuki Tanaka",
      location: "Tokyo, Japan",
      review: "Veda Global's millets are of supreme grade. Clean, properly sorted, and sustainably sourced. Highly recommend their export services.",
      rating: 5,
      product: "Millets & Grains"
    },
    {
      name: "Sarah Jenkins",
      location: "London, UK",
      review: "Amazing herbal product selection. Their dried fenugreek leaves are incredibly aromatic and fresh. The white-label packaging option was a game changer for us.",
      rating: 5,
      product: "Herbal Products"
    },
    {
      name: "Giovanni Rossi",
      location: "Milan, Italy",
      review: "Very professional logistics management. Custom documentation was handled perfectly, and the pricing for bulk spices is highly competitive.",
      rating: 4,
      product: "Indian Spices"
    },
    {
      name: "Emma Watson",
      location: "New York, USA",
      review: "Sourcing organic products directly from native farms with trace verification has elevated our brand trust. Highly satisfied with Veda Global.",
      rating: 5,
      product: "Basmati Rice"
    }
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < rating ? 'var(--accent-gold)' : '#E5E7EB', fontSize: '1.2rem' }}>★</span>
    ));
  };

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
            Global Client Reviews
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            Hear what our international importers and wholesale buyers say about our organic agricultural product quality and dispatch services.
          </motion.p>
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            Testimonials
          </motion.span>
        </div>
      </div>

      {/* Grid Content Section */}
      <div className="container policy-grid-container">
        <div className="policy-grid">
            {testimonials.map((t, idx) => (
              <motion.div
                key={idx}
                className="testimonial-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                whileHover={{ y: -6, boxShadow: 'var(--shadow-lg)' }}
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: '16px',
                  padding: '30px',
                  border: '1px solid rgba(6, 78, 59, 0.1)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'box-shadow 0.3s ease'
                }}
              >
                <div>
                  <p style={{ color: 'var(--secondary-text)', fontSize: '0.95rem', fontStyle: 'italic', lineHeight: '1.6', marginBottom: '20px' }}>
                    "{t.review}"
                  </p>
                </div>
                <div>
                  <h4 style={{ color: 'var(--heading-color)', margin: '0 0 4px 0', fontSize: '1.1rem', fontWeight: '700' }}>{t.name}</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--primary-text)', fontWeight: '600' }}>{t.location}</span>
                    {t.product && (
                      <span style={{ backgroundColor: 'rgba(6, 78, 59, 0.08)', color: 'var(--heading-color)', padding: '2px 8px', borderRadius: '4px', fontWeight: '600', fontSize: '0.75rem' }}>
                        {t.product}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
