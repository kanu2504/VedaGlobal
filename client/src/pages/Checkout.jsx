import React from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import CheckoutForm from '../components/CheckoutForm';
import { motion } from 'framer-motion';
import { getImageUrl } from '../utils/imageHelper';

const Checkout = () => {
  const { cart, cartTotal } = useCart();
  const navigate = useNavigate();

  const handleOrderSuccess = (order) => {
    // Navigate back to products or show custom order success view
    setTimeout(() => {
      navigate('/products');
    }, 4000);
  };

  if (cart.length === 0) {
    return (
      <div className="container section text-center">
        <h2>Your Cart is Empty</h2>
        <p>Add some products to your cart before checking out.</p>
        <Link to="/products" className="btn-primary" style={{ marginTop: '20px' }}>Back to Catalog</Link>
      </div>
    );
  }

  return (
    <div className="checkout-page container section">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Secure Checkout
      </motion.h1>
      
      <div className="checkout-grid">
        {/* Left Side: Shipping Form - slides from left */}
        <motion.div 
          className="checkout-form-panel"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <CheckoutForm onSuccess={handleOrderSuccess} />
        </motion.div>

        {/* Right Side: Order Review - slides from right */}
        <motion.div 
          className="checkout-review-panel"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
        >
          <h3>Review Your Order</h3>
          <div className="review-items-list">
            {cart.map((item) => (
              <div className="review-item" key={item.productId}>
                <div className="item-left">
                  <img src={getImageUrl(item.image)} alt={item.productName} className="review-item-thumb" />
                  <div>
                    <h4>{item.productName}</h4>
                    <p className="review-item-qty">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="review-item-price">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="review-totals">
            <div className="review-row">
              <span>Subtotal:</span>
              <span>₹{cartTotal}</span>
            </div>
            <div className="review-row">
              <span>Shipping:</span>
              <span className="text-success">FREE</span>
            </div>
            <hr />
            <div className="review-row total">
              <span>Grand Total:</span>
              <strong>₹{cartTotal}</strong>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Checkout;
