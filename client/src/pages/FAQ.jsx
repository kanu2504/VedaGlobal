import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from '../api/axios';
import FAQAccordion from '../components/FAQAccordion';

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const { data } = await axios.get('/faqs');
        setFaqs(data);
      } catch (err) {
        console.error('Error fetching FAQs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFAQs();
  }, []);

  return (
    <div className="faq-page">

      <section className="section faq-content-section">
        <div className="container">
          {loading ? (
            <div className="loader-container">
              <div className="loader"></div>
            </div>
          ) : faqs.length === 0 ? (
            <div className="empty-state text-center">
              <span className="empty-icon">❓</span>
              <h2>No FAQs Found</h2>
              <p>Check back later or contact our trade desk directly.</p>
            </div>
          ) : (
            <div className="faq-accordion">
              {faqs.map((faq, idx) => (
                <motion.div 
                  key={faq._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  viewport={{ once: true }}
                >
                  <FAQAccordion faq={faq} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default FAQ;
