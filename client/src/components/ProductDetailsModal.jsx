import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ProductDetailsModal = ({ isOpen, onClose, product, onOpenEnquiry }) => {
  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-overlay" style={{ zIndex: 9990 }}>
          <motion.div 
            className="modal-content product-details-modal-content"
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ duration: 0.3 }}
            style={{ maxWidth: '900px', width: '90%' }}
          >
            <div className="modal-header">
              <h2>Product Specifications & Details</h2>
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
                <span className="premium-detail-category" style={{ marginBottom: '8px' }}>{product.category}</span>
                
                <h1 className="product-details-title">{product.name}</h1>
                <p className="product-details-short-desc" style={{ fontSize: '1rem', color: '#666', marginBottom: '12px', fontStyle: 'italic' }}>{product.shortDescription}</p>
                
                <div className="details-meta-box">
                  <div className="meta-item"><strong>Origin:</strong> {product.origin || 'India'}</div>
                  <div className="meta-item"><strong>MOQ:</strong> {product.moq || '20 Metric Tons'}</div>
                  <div className="meta-item"><strong>Packaging:</strong> {product.packaging || 'Custom Available'}</div>
                </div>

                <div className="details-section">
                  <h3>Overview</h3>
                  <p>{product.description}</p>
                </div>

                {product.specifications && product.specifications.length > 0 && (
                  <div className="details-section">
                    <h3>Technical Specifications</h3>
                    <table className="specs-table">
                      <tbody>
                        {product.specifications.map((spec, index) => (
                          <tr key={index}>
                            <td className="spec-key">{spec.key}</td>
                            <td className="spec-val">{spec.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {product.benefits && product.benefits.length > 0 && (
                  <div className="details-section">
                    <h3>Key Benefits</h3>
                    <ul className="benefits-list">
                      {product.benefits.map((b, idx) => (
                        <li key={idx}>✦ {b}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div style={{ marginTop: '2rem' }}>
                  <button 
                    className="btn-primary hover-lift" 
                    style={{ width: '100%', padding: '12px' }}
                    onClick={() => {
                      onClose();
                      onOpenEnquiry(product);
                    }}
                  >
                    Send Enquiry
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProductDetailsModal;
