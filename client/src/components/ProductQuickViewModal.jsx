import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ProductQuickViewModal = ({ isOpen, onClose, product }) => {
  const navigate = useNavigate();

  if (!product) return null;

  const handleSendEnquiry = () => {
    onClose();
    navigate(`/products/${product.slug}?enquiry=true`);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="modal-overlay" style={{ zIndex: 9990 }}>
            <motion.div 
              className="modal-content product-details-modal-content"
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ duration: 0.3 }}
              style={{ maxWidth: '800px', width: '90%' }}
            >
              <div className="modal-header">
                <h2>Product Quick View</h2>
                <button className="modal-close-btn" onClick={onClose}>×</button>
              </div>
              
              <div className="product-details-grid">
                {/* Product Image Column */}
                <div className="product-details-image-col">
                  <motion.img 
                    src={product.image ? (product.image.startsWith('http://') || product.image.startsWith('https://') ? product.image : `http://localhost:5000${product.image.startsWith('/') ? product.image : '/' + product.image}`) : 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?q=80&w=300'}
                    alt={product.name} 
                    className="details-main-image"
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=600';
                    }}
                  />
                </div>

                {/* Product Info Column */}
                <div className="product-details-info-col">
                  <span className="premium-detail-category" style={{ marginBottom: '8px', display: 'inline-block' }}>{product.category}</span>
                  
                  <h1 className="product-details-title" style={{ fontSize: '1.8rem', margin: '8px 0' }}>{product.name}</h1>
                  
                  <p className="product-details-short-desc" style={{ fontSize: '0.95rem', color: '#666', marginBottom: '16px' }}>{product.shortDescription}</p>
                  
                  <div className="details-section" style={{ marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '1rem', margin: '0 0 6px 0' }}>Description</h3>
                    <p style={{ fontSize: '0.9rem', margin: 0 }}>{product.description}</p>
                  </div>

                  {/* Enquiry and Spec Details */}
                  <div className="quickview-action-section" style={{ borderTop: '1px solid rgba(79, 95, 58, 0.1)', paddingTop: '16px', marginTop: '16px' }}>
                    <div className="enquiry-details-container">
                      <div className="details-meta-box" style={{ background: 'rgba(128, 150, 113, 0.1)', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                        <div className="meta-item" style={{ fontSize: '0.85rem' }}><strong>Origin:</strong> {product.origin || 'India'}</div>
                        <div className="meta-item" style={{ fontSize: '0.85rem', marginTop: '4px' }}><strong>MOQ:</strong> {product.moq || '25kg+'}</div>
                        <div className="meta-item" style={{ fontSize: '0.85rem', marginTop: '4px' }}><strong>Packaging:</strong> {product.packaging || 'Custom Available'}</div>
                        <div className="meta-item" style={{ fontSize: '0.85rem', marginTop: '4px' }}><strong>Price Range:</strong> Export Quote Based</div>
                      </div>
                      <button 
                        type="button" 
                        className="btn-primary hover-lift" 
                        style={{ width: '100%', padding: '12px', borderRadius: '4px' }}
                        onClick={handleSendEnquiry}
                      >
                        Send Enquiry
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductQuickViewModal;
