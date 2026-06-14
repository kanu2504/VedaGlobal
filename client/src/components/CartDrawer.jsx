import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const CartDrawer = ({ isOpen, onClose }) => {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="cart-drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer Panel */}
          <motion.div
            className="cart-drawer-container"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            <div className="cart-drawer-header">
              <h2>Shopping Cart</h2>
              <button className="cart-close-btn" onClick={onClose}>&times;</button>
            </div>

            <div className="cart-drawer-body">
              {cart.length === 0 ? (
                <div className="empty-cart-message">
                  <span className="cart-icon-empty">🛒</span>
                  <p>Your cart is empty</p>
                  <button className="btn-primary" onClick={onClose}>Continue Shopping</button>
                </div>
              ) : (
                <div className="cart-items-list">
                  {cart.map((item) => (
                    <div className="cart-item-card" key={item.productId}>
                      <img src={item.image} alt={item.productName} className="cart-item-img" />
                      <div className="cart-item-info">
                        <h4>{item.productName}</h4>
                        <p className="cart-item-price">₹{item.price}</p>
                        <div className="cart-quantity-controls">
                          <button onClick={() => updateQuantity(item.productId, item.quantity - 1)}>-</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</button>
                        </div>
                      </div>
                      <button className="cart-remove-item-btn" onClick={() => removeFromCart(item.productId)}>
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="cart-drawer-footer">
                <div className="cart-summary-row">
                  <span>Subtotal:</span>
                  <span className="cart-summary-total">₹{cartTotal}</span>
                </div>
                <button className="btn-primary checkout-action-btn" onClick={handleCheckout}>
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
