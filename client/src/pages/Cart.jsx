import React from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getImageUrl } from '../utils/imageHelper';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();
  const navigate = useNavigate();

  return (
    <div className="cart-page container section" style={{ minHeight: '75vh', marginTop: '60px' }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ marginBottom: '40px' }}
      >
        <span className="showcase-category" style={{ fontSize: '0.85rem', color: 'var(--matcha)', fontWeight: '800', letterSpacing: '3px', textTransform: 'uppercase' }}>
          Your Selections
        </span>
        <h1 style={{ fontFamily: 'var(--font-serif)', color: 'var(--dark-green)', fontSize: 'clamp(28px, 4vw, 42px)', margin: '8px 0 0 0' }}>
          Shopping Cart
        </h1>
      </motion.div>

      {cart.length === 0 ? (
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
          <span style={{ fontSize: '5rem', display: 'block', marginBottom: '24px' }}>🛒</span>
          <h2 style={{ color: 'var(--dark-green)', fontFamily: 'var(--font-serif)', fontSize: '1.8rem', marginBottom: '12px' }}>Your Cart is Empty</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '450px', margin: '0 auto 30px auto', lineHeight: '1.6' }}>
            Looks like you haven't added any products to your cart yet. Explore our wholesale agricultural catalogs today!
          </p>
          <Link to="/products" className="btn-primary hover-lift" style={{ display: 'inline-block', padding: '12px 32px', borderRadius: '30px', fontWeight: 'bold', textDecoration: 'none' }}>
            Browse Products
          </Link>
        </motion.div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(300px, 1fr)', gap: '30px', alignItems: 'start' }}>
          
          {/* Cart Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <AnimatePresence mode="popLayout">
              {cart.map((item, idx) => (
                <motion.div
                  key={item.productId}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    background: 'rgba(255, 255, 255, 0.85)',
                    padding: '16px 20px',
                    borderRadius: '20px',
                    border: '1px solid rgba(79, 95, 58, 0.08)',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
                    backdropFilter: 'blur(10px)',
                    flexWrap: 'wrap'
                  }}
                >
                  <img 
                    src={getImageUrl(item.image)} 
                    alt={item.productName} 
                    style={{
                      width: '80px',
                      height: '80px',
                      objectFit: 'cover',
                      borderRadius: '12px',
                      border: '1px solid rgba(79, 95, 58, 0.06)'
                    }}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=600';
                    }}
                  />
                  
                  <div style={{ flex: '1', minWidth: '150px' }}>
                    <h3 style={{ margin: '0 0 4px 0', fontFamily: 'var(--font-serif)', color: 'var(--dark-green)', fontSize: '1.15rem' }}>
                      {item.productName}
                    </h3>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '500' }}>
                      Price: ₹{item.price}
                    </div>
                  </div>

                  {/* Quantity Adjustment */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(79, 95, 58, 0.15)', borderRadius: '20px', padding: '4px 8px', background: '#ffffff' }}>
                    <button 
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      style={{ border: 'none', background: 'none', width: '24px', height: '24px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold', color: 'var(--dark-green)' }}
                    >
                      -
                    </button>
                    <span style={{ fontWeight: '700', fontSize: '0.95rem', minWidth: '24px', textAlign: 'center', color: 'var(--dark-green)' }}>
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      style={{ border: 'none', background: 'none', width: '24px', height: '24px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold', color: 'var(--dark-green)' }}
                    >
                      +
                    </button>
                  </div>

                  <div style={{ fontWeight: '700', color: 'var(--dark-green)', fontSize: '1.1rem', minWidth: '80px', textAlign: 'right' }}>
                    ₹{item.price * item.quantity}
                  </div>

                  <button 
                    onClick={() => removeFromCart(item.productId)}
                    style={{
                      border: 'none',
                      background: 'none',
                      color: '#C9A24A',
                      fontSize: '1.5rem',
                      cursor: 'pointer',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Remove item"
                  >
                    &times;
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary Box */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              background: 'rgba(255, 255, 255, 0.85)',
              padding: '30px',
              borderRadius: '24px',
              border: '1px solid rgba(79, 95, 58, 0.1)',
              boxShadow: '0 8px 32px rgba(79, 95, 58, 0.05)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <h3 style={{ fontFamily: 'var(--font-serif)', color: 'var(--dark-green)', fontSize: '1.4rem', margin: '0 0 20px 0', borderBottom: '1px solid rgba(79, 95, 58, 0.08)', paddingBottom: '12px' }}>
              Order Summary
            </h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '1rem', color: 'var(--text-muted)' }}>
              <span>Subtotal:</span>
              <span style={{ fontWeight: '600', color: 'var(--dark-green)' }}>₹{cartTotal}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '1rem', color: 'var(--text-muted)' }}>
              <span>Shipping Charge:</span>
              <span style={{ fontWeight: '600', color: '#C9A24A' }}>FREE</span>
            </div>

            <hr style={{ border: '0', height: '1px', background: 'rgba(79, 95, 58, 0.08)', margin: '20px 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', alignItems: 'center' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--dark-green)' }}>Grand Total:</span>
              <span style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--dark-green)' }}>₹{cartTotal}</span>
            </div>

            <button 
              className="btn-primary hover-lift" 
              onClick={() => navigate('/checkout')}
              style={{ width: '100%', padding: '14px', borderRadius: '30px', fontWeight: 'bold', fontSize: '1rem', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}
            >
              Proceed to Checkout
            </button>
            
            <Link 
              to="/products" 
              style={{ display: 'block', textAlign: 'center', marginTop: '16px', color: 'var(--matcha)', fontWeight: '600', textDecoration: 'none', fontSize: '0.95rem' }}
            >
              Continue Shopping
            </Link>
          </motion.div>

        </div>
      )}
    </div>
  );
};

export default Cart;
