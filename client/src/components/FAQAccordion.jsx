import React, { useState } from 'react';

const FAQAccordion = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="faq-item">
      <button 
        className="faq-question-btn" 
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <h3>{faq.question}</h3>
        <span className={`faq-toggle-icon ${isOpen ? 'active' : ''}`}>+</span>
      </button>
      
      <div className={`faq-answer-pane ${isOpen ? 'open' : ''}`}>
        <div className="faq-answer-content">
          <p>{faq.answer}</p>
        </div>
      </div>
    </div>
  );
};

export default FAQAccordion;
