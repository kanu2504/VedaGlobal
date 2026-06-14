import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from '../api/axios';
import EnquiryModal from '../components/EnquiryModal';
import ProductDetailsModal from '../components/ProductDetailsModal';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All', 'Basmati Rice', 'Organic Seeds', 'Indian Spices', 'Millets & Grains', 'Cold Pressed Oils', 'Herbal Products']);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Enquiry modal state
  const [selectedProductEnquiry, setSelectedProductEnquiry] = useState(null);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

  // Product details modal state
  const [selectedProductDetails, setSelectedProductDetails] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const currentCategory = searchParams.get('category') || 'All';
  const { customer } = useAuth();
  const navigate = useNavigate();

  // Fetch Products based on Category & Search
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = `/products?category=${encodeURIComponent(currentCategory)}`;
        if (searchTerm) {
          url += `&search=${encodeURIComponent(searchTerm)}`;
        }
        const { data } = await axios.get(url);
        // Ensure we only show products that are Active
        setProducts(data.filter(p => p.status === 'Active'));
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [currentCategory, searchTerm]);

  const handleCategorySelect = (category) => {
    if (category === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  const openEnquiry = (product) => {
    if (!customer) {
      navigate(`/login?redirect=/products/${product.slug}`);
      return;
    }
    setSelectedProductEnquiry(product);
    setIsEnquiryOpen(true);
  };

  const openDetails = (product) => {
    if (!customer) {
      navigate(`/login?redirect=/products/${product.slug}`);
      return;
    }
    setSelectedProductDetails(product);
    setIsDetailsOpen(true);
  };

  return (
    <div className="products-page">

      {/* Catalog Section */}
      <section className="section catalog-section">
        <div className="container">
          
          {/* Search & Filters Bar */}
          <motion.div 
            className="catalog-filters-bar"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Search Input */}
            <div className="search-wrapper">
              <input
                type="text"
                className="form-input"
                placeholder="Search premium catalog (e.g. Basmati, Cumin)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button className="clear-search-btn" onClick={() => setSearchTerm('')}>×</button>
              )}
            </div>

            {/* Category Pills */}
            <div className="category-pills">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`pill-btn ${currentCategory === cat ? 'active' : ''}`}
                  onClick={() => handleCategorySelect(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Catalog Grid */}
          {loading ? (
            <div className="loader-container">
              <div className="loader"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="empty-state text-center">
              <span className="empty-icon">🌱</span>
              <h2>No Products Found</h2>
              <p>We couldn't find any products matching your search criteria. Try choosing a different category or search term.</p>
              <button 
                className="btn-primary" 
                onClick={() => {
                  setSearchTerm('');
                  setSearchParams({});
                }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {products.map((product, idx) => (
                <motion.div 
                  key={product._id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: (idx % 4) * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* Product Details Modal */}
      <ProductDetailsModal 
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        product={selectedProductDetails}
        onOpenEnquiry={openEnquiry}
      />

      {/* Enquiry Modal */}
      <EnquiryModal 
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        productName={selectedProductEnquiry ? selectedProductEnquiry.name : ''}
        productId={selectedProductEnquiry ? selectedProductEnquiry._id : null}
      />
    </div>
  );
};

export default Products;
