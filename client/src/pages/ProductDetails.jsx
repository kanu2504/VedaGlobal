import React, { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from '../api/axios';
import EnquiryModal from '../components/EnquiryModal';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useMode } from '../context/ModeContext';
import { getImageUrl } from '../utils/imageHelper';

const ProductDetails = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Enquiry modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { customer } = useAuth();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { mode } = useMode();
  const navigate = useNavigate();

  // B2B state
  const [selectedPackSize, setSelectedPackSize] = useState('1kg');
  const [quantity, setQuantity] = useState(1);



  useEffect(() => {
    if (!customer) {
      navigate(`/login?redirect=/products/${id}`);
    }
  }, [customer, navigate, id]);

  useEffect(() => {
    if (!customer) return;
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/products/${id}`);
        setProduct(data);
        if (data) {
          setSelectedPackSize(data.packSizes || '1kg');
          setQuantity(data.minOrderQuantity || 1);
        }
        if (searchParams.get('enquiry') === 'true') {
          setIsModalOpen(true);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load product details. It may not exist.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, searchParams, customer]);

  if (!customer) {
    return null; // Don't render while redirecting
  }

  if (loading) {
    return <div className="loader-container"><div className="loader"></div></div>;
  }

  if (error || !product) {
    return (
      <div className="container section text-center">
        <h2>Product Not Found</h2>
        <p>{error || 'Product information is missing.'}</p>
        <Link to="/products" className="btn-primary" style={{ marginTop: '20px' }}>Back to Catalog</Link>
      </div>
    );
  }

  const handleBuyNow = () => {
    addToCart({ ...product, selectedPackSize }, quantity);
    navigate('/cart');
  };

  return (
    <div className="product-details-page">
      <section className="section detail-section">
        <div className="container" style={{ marginBottom: '20px' }}>
          <Link to="/products" className="back-link" style={{ color: 'var(--matcha)', textDecoration: 'none', fontWeight: '600' }}>
            ← Back to Catalog
          </Link>
        </div>
        
        <motion.div 
          className="container"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Main layout: Image left, details right */}
          <div className="premium-detail-container">
            {/* Left side: large product image box */}
            <div className="premium-detail-image-box">
              <motion.img 
                src={getImageUrl(product.image)} 
                alt={product.name} 
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=600';
                }}
              />
            </div>

            {/* Right side: product content details */}
            <div className="premium-detail-info">
              <span className="premium-detail-category">{product.category}</span>
              <h1 className="premium-detail-title">{product.name}</h1>
              <p className="premium-detail-short-desc">{product.shortDescription}</p>

              {/* Specs Grid */}
              <div className="premium-specs-grid">
                <div className="premium-spec-card">
                  <span className="label">Origin</span>
                  <span className="val">{product.origin || 'India'}</span>
                </div>
                <div className="premium-spec-card">
                  <span className="label">MOQ</span>
                  <span className="val">{product.minOrderQuantity ? `${product.minOrderQuantity} ${product.units || 'Piece'}` : (product.moq || '25kg+')}</span>
                </div>
                <div className="premium-spec-card">
                  <span className="label">Packaging</span>
                  <span className="val">{product.packaging || 'Custom Available'}</span>
                </div>
                <div className="premium-spec-card">
                  <span className="label">Price</span>
                  <span className="val" style={{ color: 'var(--matcha)' }}>
                    {mode === 'B2C' 
                      ? (product.retailPrice || product.price ? `₹${product.retailPrice || product.price} (Retail)` : 'Quote-based')
                      : (product.wholesalePrice ? `₹${product.wholesalePrice} (Wholesale)` : 'Quote-based')
                    }
                  </span>
                </div>
              </div>

              {/* B2C Pack Size & Quantity Selectors */}
              {mode === 'B2C' && (
                <div style={{ display: 'flex', gap: '16px', margin: '25px 0', flexWrap: 'wrap' }}>
                  <div className="detail-option-group" style={{ flex: '1', minWidth: '150px' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: 'var(--text-main)' }}>Pack Size</label>
                    <select 
                      value={selectedPackSize} 
                      onChange={(e) => setSelectedPackSize(e.target.value)}
                      style={{ width: '100%', padding: '10px 16px', borderRadius: '6px', background: 'var(--bg-soft)', color: 'var(--text-main)', border: '1px solid var(--border-color)', outline: 'none' }}
                    >
                      {['100g', '250g', '500g', '1kg', '5kg', '10kg', '25kg', '50kg', 'Custom'].map(sz => (
                        <option key={sz} value={sz}>{sz}</option>
                      ))}
                    </select>
                  </div>
                  <div className="detail-option-group" style={{ flex: '1', minWidth: '150px' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: 'var(--text-main)' }}>Quantity</label>
                    <input 
                      type="number" 
                      min={product.minOrderQuantity || 1} 
                      value={quantity} 
                      onChange={(e) => setQuantity(Math.max(product.minOrderQuantity || 1, Number(e.target.value)))}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', background: 'var(--bg-soft)', color: 'var(--text-main)', border: '1px solid var(--border-color)', outline: 'none' }}
                    />
                  </div>
                </div>
              )}

              {/* CTAs */}
              <div style={{ marginTop: '30px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                {mode === 'B2B' && (
                  <button 
                    className="premium-enquiry-btn hover-lift" 
                    onClick={() => setIsModalOpen(true)}
                    style={{ padding: '12px 28px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    Send Enquiry
                  </button>
                )}

                {mode === 'B2C' && (
                  <>
                    <button 
                      className="btn-primary hover-lift" 
                      onClick={() => {
                        addToCart({ ...product, selectedPackSize }, quantity);
                        alert(`${product.name} added to cart!`);
                      }}
                      style={{ padding: '12px 28px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', border: 'none' }}
                    >
                      Add to Cart
                    </button>

                    <button 
                      className="btn-secondary hover-lift" 
                      onClick={handleBuyNow}
                      style={{ padding: '12px 28px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', border: 'none', backgroundColor: '#D4AF37', color: '#064E3B' }}
                    >
                      Buy Now
                    </button>

                    <button 
                      className="hover-lift" 
                      onClick={() => toggleWishlist(product)}
                      style={{
                        background: isInWishlist(product._id) ? '#FCFBF7' : '#ffffff',
                        border: '1.5px solid rgba(6, 78, 59, 0.2)',
                        borderRadius: '8px',
                        width: '46px',
                        height: '46px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: isInWishlist(product._id) ? '#D4AF37' : 'var(--dark-green)'
                      }}
                      title={isInWishlist(product._id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill={isInWishlist(product._id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.5">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Info boxes below: slide-up animation */}
          <div className="premium-info-grid">
            {/* Box 1: About This Product */}
            <motion.div 
              className="premium-info-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h3>About This Product</h3>
              <p>{product.description}</p>
            </motion.div>

            {/* Box 2: Key Benefits */}
            {product.benefits && product.benefits.length > 0 && (
              <motion.div 
                className="premium-info-card"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h3>Key Benefits</h3>
                <ul style={{ paddingLeft: '18px', margin: 0 }}>
                  {product.benefits.map((benefit, index) => (
                    <li key={index} style={{ marginBottom: '8px' }}>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Box 3: Specifications */}
            {product.specifications && product.specifications.length > 0 && (
              <motion.div 
                className="premium-info-card"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h3>Specifications</h3>
                <table className="specs-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    {product.specifications.map((spec, index) => (
                      <tr key={index}>
                        <td className="spec-key" style={{ padding: '8px 0', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>{spec.key}</td>
                        <td className="spec-val" style={{ padding: '8px 0', borderBottom: '1px solid rgba(0,0,0,0.06)', fontWeight: 'bold', textAlign: 'right' }}>{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}

            {/* Box 4: Packaging Options */}
            <motion.div 
              className="premium-info-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3>Packaging Options</h3>
              <p>We provide versatile and premium packaging formats tailored to international standards. Retail branding, customized bags, vacuum packs, and wholesale bulk bags (PP/Jute sacks ranging from 1kg to 50kg) are available upon request.</p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Enquiry Modal */}
      <EnquiryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        productName={product.name}
        productId={product._id}
      />
    </div>
  );
};

export default ProductDetails;
