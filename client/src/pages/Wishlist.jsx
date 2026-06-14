import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getImageUrl } from '../utils/imageHelper';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (product) => {
    addToCart(product, 1);
    removeFromWishlist(product._id);
  };

  return (
    <div className="wishlist-page container section" style={{ minHeight: '75vh', marginTop: '60px' }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ marginBottom: '40px' }}
      >
        <span className="showcase-category" style={{ fontSize: '0.85rem', color: 'var(--matcha)', fontWeight: '800', letterSpacing: '3px', textTransform: 'uppercase' }}>
          Your Favorites
        </span>
        <h1 style={{ fontFamily: 'var(--font-serif)', color: 'var(--dark-green)', fontSize: 'clamp(28px, 4vw, 42px)', margin: '8px 0 0 0' }}>
          My Wishlist
        </h1>
      </motion.div>

      {wishlist.length === 0 ? (
        <motion.div 
          className="empty-cart-state text-center" 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ 
            padding: '80px 40px', 
            background: 'rgba(255, 255, 255, 0.6)', 
            borderRadius: '24px', 
            border: '1px solid rgba(79, 95, 58, 0.08)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.02)'
          }}
        >
          <span style={{ fontSize: '5rem', display: 'block', marginBottom: '24px' }}>❤️</span>
          <h2 style={{ color: 'var(--dark-green)', fontFamily: 'var(--font-serif)', fontSize: '1.8rem', marginBottom: '12px' }}>Your Wishlist is Empty</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '450px', margin: '0 auto 30px auto', lineHeight: '1.6' }}>
            Explore our curated selection of premium agricultural exports and save your favorites here.
          </p>
          <Link to="/products" className="btn-primary hover-lift" style={{ display: 'inline-block', padding: '12px 32px', borderRadius: '30px', fontWeight: 'bold', textDecoration: 'none' }}>
            Browse Catalog
          </Link>
        </motion.div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <AnimatePresence mode="popLayout">
            {wishlist.map((product, idx) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '24px',
                  background: 'rgba(255, 255, 255, 0.85)',
                  padding: '20px 24px',
                  borderRadius: '20px',
                  border: '1px solid rgba(79, 95, 58, 0.08)',
                  boxShadow: '0 6px 18px rgba(0,0,0,0.03)',
                  backdropFilter: 'blur(10px)',
                  flexWrap: 'wrap'
                }}
              >
                {/* Product Image */}
                <Link to={`/products/${product.slug}`} style={{ display: 'block' }}>
                  <img
                    src={getImageUrl(product.image)}
                    alt={product.name}
                    style={{
                      width: '100px',
                      height: '100px',
                      objectFit: 'cover',
                      borderRadius: '14px',
                      border: '1px solid rgba(79, 95, 58, 0.06)'
                    }}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=600';
                    }}
                  />
                </Link>

                {/* Details */}
                <div style={{ flex: '1', minWidth: '200px' }}>
                  <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--matcha)', fontWeight: '700', letterSpacing: '1px' }}>
                    {product.category}
                  </span>
                  <h3 style={{ margin: '4px 0 8px 0', fontFamily: 'var(--font-serif)', color: 'var(--dark-green)', fontSize: '1.25rem' }}>
                    <Link to={`/products/${product.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      {product.name}
                    </Link>
                  </h3>
                  <div style={{ fontWeight: '700', color: 'var(--dark-green)', fontSize: '1.1rem' }}>
                    ₹{product.price}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => handleMoveToCart(product)}
                    className="btn-primary hover-lift"
                    style={{
                      padding: '12px 24px',
                      borderRadius: '30px',
                      border: 'none',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    Move to Cart
                  </button>
                  <button
                    onClick={() => removeFromWishlist(product._id)}
                    className="hover-lift"
                    style={{
                      background: 'transparent',
                      border: '1.5px solid rgba(6, 78, 59, 0.2)',
                      color: 'var(--dark-green)',
                      padding: '12px 20px',
                      borderRadius: '30px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#FCFBF7';
                      e.target.style.borderColor = 'var(--matcha)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.borderColor = 'rgba(6, 78, 59, 0.2)';
                    }}
                  >
                    Remove
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
