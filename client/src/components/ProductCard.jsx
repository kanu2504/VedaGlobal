import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useMode } from '../context/ModeContext';
import { useCart } from '../context/CartContext';
import { getImageUrl } from '../utils/imageHelper';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { mode } = useMode();
  const { addToCart, setIsCartOpen } = useCart();

  const isBestSeller = product.isBestSeller || product.bestseller || false;

  return (
    <div className="premium-export-card">
      <div className="export-card-image-wrapper" style={{ position: 'relative', overflow: 'hidden' }}>
        <Link to={`/products/${product.slug}`} style={{ display: 'block', height: '100%' }}>
          <img 
            src={getImageUrl(product.image)} 
            alt={product.name} 
            className="export-card-image"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=600&auto=format&fit=crop';
            }}
          />
        </Link>
        {isBestSeller && (
          <span className="tag-badge-new bestseller-tag">BESTSELLER</span>
        )}
        {mode === 'B2C' && (
          <button 
            type="button"
            className={`wishlist-toggle-btn ${isInWishlist(product._id) ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product);
            }}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: 'rgba(255, 255, 255, 0.95)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
              zIndex: 10,
              transition: 'all 0.3s ease',
              color: isInWishlist(product._id) ? '#D4AF37' : '#0B3D2E'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill={isInWishlist(product._id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        )}
        <button 
          type="button"
          className="quick-view-btn"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            navigate(`/products/${product.slug}`);
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
          QUICK VIEW
        </button>
      </div>

      <div className="export-card-content">
        <span className="premium-card-category">{product.category}</span>
        <h3 className="export-card-title" style={{ marginTop: '4px' }}>{product.name}</h3>
        <p className="export-card-desc">{product.shortDescription}</p>
        
        {/* Specs list */}
        <div className="export-specs-list">
          <div className="spec-item">
            <span className="label">Origin:</span>
            <span className="val">{product.origin || 'India'}</span>
          </div>
          <div className="spec-item">
            <span className="label">MOQ:</span>
            <span className="val">{product.moq || '25kg+'}</span>
          </div>
          <div className="spec-item">
            <span className="label">Packaging:</span>
            <span className="val">{product.packaging || 'Custom Available'}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="export-card-actions" style={{ marginTop: 'auto' }}>
          {mode === 'B2C' ? (
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addToCart(product, 1);
                setIsCartOpen(true);
              }}
              className="premium-card-enquiry-btn hover-lift"
              style={{ backgroundColor: '#D4AF37', color: '#064E3B', border: 'none', width: '100%', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Add to Cart
            </button>
          ) : (
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                navigate(`/products/${product.slug}`);
              }}
              className="premium-card-enquiry-btn hover-lift"
              style={{ backgroundColor: 'var(--dark-green)', color: 'var(--cream)', border: 'none', width: '100%', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Send Enquiry
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
