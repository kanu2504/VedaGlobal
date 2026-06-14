import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../api/axios';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestsellerProducts, setBestsellerProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const fetchProductsData = async () => {
      try {
        const { data } = await axios.get('/products');
        setFeaturedProducts(data.filter(p => (p.isFeatured === true || p.featured === true) && (p.isBestSeller !== true && p.bestseller !== true)).slice(0, 4));
        setBestsellerProducts(data.filter(p => p.isBestSeller === true || p.bestseller === true).slice(0, 4));
      } catch (err) {
        console.error('Error fetching products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductsData();
  }, []);

  const slides = [
    {
      category: "Rice",
      heading: "Indian Rice\nWorld-class quality",
      description: "Supplying premium Basmati and Non-Basmati varieties that cater to your diverse market needs.",
      image: "/images/product-slider/rice.png",
      link: "/products?category=Rice"
    },
    {
      category: "Spices",
      heading: "Premium Spices for Global\nKitchens.",
      description: "Our spice selection offers a rich variety of flavors for chefs and culinary enthusiasts worldwide. We specialize in exporting top-quality spices, ensuring freshness, authenticity, and consistency to elevate every dish, from traditional to modern cuisines.",
      image: "/images/product-slider/spices.png",
      link: "/products?category=Spices"
    },
    {
      category: "Fenugreek Leaf",
      heading: "Aromatic, dried herb with\nbitter flavor.",
      description: "Fenugreek leaves are aromatic, nutrient-rich greens used in culinary and medicinal applications, known for their slightly bitter taste and health benefits.",
      image: "/images/product-slider/fenugreek-leaf.png",
      link: "/products?category=Herbal Products"
    },
    {
      category: "Millets",
      heading: "Nutritious, gluten-free,\nancient, sustainable, fiber-\nrich, versatile.",
      description: "Millets are nutrient-rich, gluten-free grains that support digestion and provide sustained energy. They are versatile and can be used in dishes like porridge, rotis, and dosas.",
      image: "/images/product-slider/millets.png",
      link: "/products?category=Millets"
    },
    {
      category: "Cold Pressed Oil",
      heading: "Pure & Natural Cold-Pressed\nOils",
      description: "Discover the purest cold-pressed oils—nature's best, bottled for your health!",
      image: "/images/product-slider/cold-pressed-oil.png",
      link: "/products?category=Cold Pressed Oil"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="home-page">

      {/* 2. Welcome Intro block immediately below slider */}
      <motion.section 
        className="welcome-cta-block text-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container welcome-content-inner">
          <h1 className="welcome-title-large">
            Veda <span>Global</span>
          </h1>
          <p className="welcome-desc-para" style={{ fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'center', width: '100%', display: 'flex', justifyContent: 'center', marginInline: 'auto' }}>
            “Delivering India’s Natural Goodness Globally”
          </p>
          <p className="welcome-desc-para">
            Sourcing premium-grade agricultural products directly from native farming cooperatives in India to international trade terminals with 100% trace verification.
          </p>
          <div className="welcome-buttons">
            <Link to="/products" className="btn-primary">
              Explore Products
            </Link>
            <Link to="/contact" className="btn-secondary">
              Contact Us
            </Link>
          </div>
        </div>
      </motion.section>

      {/* 3. Product Showcase Slider */}
      <section className="showcase-slider-section">
        <div className="showcase-slider-container">
          <div className="showcase-slide-wrapper">
            {/* Left text column */}
            <div className="showcase-text-col">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                  <span className="showcase-category">{slides[currentSlide].category}</span>
                  <h2 className="showcase-heading">
                    {slides[currentSlide].heading.split('\n').map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))}
                  </h2>
                  <p className="showcase-description">{slides[currentSlide].description}</p>
                  <div className="showcase-actions">
                    <Link to={slides[currentSlide].link} className="showcase-see-more">
                      SEE MORE <span className="arrow-icon">↗</span>
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right image column */}
            <div className="showcase-image-col">
              <AnimatePresence>
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="showcase-main-image-wrapper"
                  style={{ position: 'absolute' }}
                >
                  <img 
                    src={slides[currentSlide].image} 
                    alt={slides[currentSlide].category} 
                    className="showcase-main-image"
                  />
                </motion.div>
              </AnimatePresence>

              <AnimatePresence>
                <motion.div
                  key={(currentSlide + 1) % slides.length}
                  initial={{ opacity: 0, x: 100, scale: 0.7 }}
                  animate={{ opacity: 0.35, x: 0, scale: 0.9 }}
                  exit={{ opacity: 0, x: -100, scale: 0.7 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="showcase-blurred-image-wrapper"
                  style={{ position: 'absolute' }}
                >
                  <img 
                    src={slides[(currentSlide + 1) % slides.length].image} 
                    alt="" 
                    className="showcase-blurred-image"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation Arrows positioned absolute relative to container/section */}
          <button className="showcase-arrow showcase-arrow-left" onClick={prevSlide} aria-label="Previous Slide">
            ←
          </button>
          <button className="showcase-arrow showcase-arrow-right" onClick={nextSlide} aria-label="Next Slide">
            →
          </button>
        </div>
      </section>

      {/* 4. Refined Premium About Us Section (Pinterest Style) */}
      <section id="about-section" className="about-section">
        <div className="container">
          <h2 className="about-title">About Company</h2>
          
          <div className="about-wrapper">
            <motion.div 
              className="about-image-box"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <img 
                src="/images/about-us.png" 
                alt="About Veda Global" 
              />
            </motion.div>
            
            <motion.div 
              className="about-content"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2>Delivering India's Natural Goodness to Global Markets</h2>
              
              <p>
                Veda Global is a trusted agricultural export brand bringing India’s finest farm products to global markets. We specialize in premium rice, spices, seeds, millets, cold-pressed oils, and natural agricultural goods sourced directly from reliable farming communities.
              </p>
              <p>
                Our focus is quality, purity, sustainability, and transparent sourcing. From farms to international buyers, we ensure every product reflects India’s rich agricultural heritage.
              </p>
              
              <ul className="about-points">
                <li><span>✓</span> Premium Quality Products</li>
                <li><span>✓</span> Direct Farm Sourcing</li>
                <li><span>✓</span> Global Export Network</li>
              </ul>
              
              <div className="about-buttons-row">
                <Link to="/products" className="about-btn-primary">
                  Explore Products
                </Link>
                <Link to="/contact" className="about-btn-secondary">
                  Contact Us
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. Featured Products */}
      <section className="section featured-section">
        <div className="container">
          <motion.div 
            className="section-header text-center"
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="section-subtitle">EXCLUSIVE SELECTION</span>
            <h2 className="section-title">Featured Products</h2>
            <div className="section-divider"></div>
          </motion.div>

          {loading ? (
            <div className="loader-container"><div className="loader"></div></div>
          ) : featuredProducts.length === 0 ? (
            <div className="empty-state text-center" style={{ padding: '2rem' }}>
              <p>No featured products available at the moment. Please check back later.</p>
            </div>
          ) : (
            <div className="products-grid">
              {featuredProducts.map((prod, idx) => (
                <motion.div 
                  key={prod._id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                >
                  <ProductCard product={prod} />
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center view-all-container">
            <Link to="/products" className="btn-primary">View All Products</Link>
          </div>
        </div>
      </section>

      {/* 5.5 Bestsellers */}
      <section className="section bestseller-section" style={{ paddingTop: 0 }}>
        <div className="container">
          <motion.div 
            className="section-header text-center"
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="section-subtitle">MOST POPULAR CHOICE</span>
            <h2 className="section-title">Bestsellers</h2>
            <div className="section-divider"></div>
          </motion.div>

          {loading ? (
            <div className="loader-container"><div className="loader"></div></div>
          ) : bestsellerProducts.length === 0 ? (
            <div className="empty-state text-center" style={{ padding: '2rem' }}>
              <p>No bestseller products available.</p>
            </div>
          ) : (
            <div className="products-grid">
              {bestsellerProducts.map((prod, idx) => (
                <motion.div 
                  key={prod._id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                >
                  <ProductCard product={prod} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 6. Why Choose Us - Matcha Green gradient theme background */}
      <section className="section why-choose-section section-matcha-green">
        <div className="container">
          <motion.div 
            className="section-header text-center"
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="section-subtitle">OUR ADVANTAGE</span>
            <h2 className="section-title">Why Global Importers Choose Us</h2>
            <div className="section-divider"></div>
          </motion.div>

          <div className="advantages-grid feature-grid">
            <motion.div 
              className="adv-card feature-card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="adv-icon feature-icon">🌍</div>
              <div className="feature-content">
                <h3 style={{ color: 'var(--vanilla)' }}>Global Logistics Network</h3>
                <p>Timely delivery across Europe, Americas, Middle East, and Asia with complete shipping tracking and documentation.</p>
              </div>
            </motion.div>
            <motion.div 
              className="adv-card feature-card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="adv-icon feature-icon">🛡️</div>
              <div className="feature-content">
                <h3 style={{ color: 'var(--vanilla)' }}>Certified Compliance</h3>
                <p>Strict alignment with USDA Organic, FSSAI, APEDA, and ISO standards to assure zero export rejections.</p>
              </div>
            </motion.div>
            <motion.div 
              className="adv-card feature-card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="adv-icon feature-icon">📦</div>
              <div className="feature-content">
                <h3 style={{ color: 'var(--vanilla)' }}>Customized Packaging</h3>
                <p>Flexible packaging options ranging from 100g retail bags to bulk 25kg PP/Jute sacks under white-label options.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 6.5 Brand Values Section */}
      <section className="values-section">
        <motion.div 
          className="values-container"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="values-grid">
            <motion.div 
              className="value-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="value-icon">
                <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="m9 11 2 2 4-4" />
                </svg>
              </div>
              <h3>Quality Without Compromise</h3>
              <p>We prioritize quality from sourcing to export, ensuring every product meets international standards.</p>
            </motion.div>

            <motion.div 
              className="value-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="value-icon">
                <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="3" width="15" height="13" rx="2" ry="2" />
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
              </div>
              <h3>Reliable Supply Chain</h3>
              <p>On-time deliveries backed by efficient logistics and trusted partnerships with Indian farmers.</p>
            </motion.div>

            <motion.div 
              className="value-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="value-icon">
                <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  <path d="M2 12h20" />
                </svg>
              </div>
              <h3>Tailored for Global Needs</h3>
              <p>Our diverse product range and packaging options cater to the unique demands of worldwide markets.</p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* 7.5 Testimonials Section */}
      <section className="section testimonials-section" style={{ padding: '60px 0', backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid rgba(6, 78, 59, 0.1)' }}>
        <div className="container">
          <motion.div 
            className="section-header text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            style={{ marginBottom: '40px' }}
          >
            <span className="section-subtitle">CLIENT FEEDBACK</span>
            <h2 className="section-title" style={{ color: 'var(--heading-color)' }}>What Our Partners Say</h2>
            <div className="section-divider" style={{ backgroundColor: 'var(--accent-gold)' }}></div>
          </motion.div>

          <div className="testimonials-home-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            marginBottom: '40px'
          }}>
            {[
              {
                name: "Sophia Martinez",
                location: "Madrid, Spain",
                review: "The Basmati rice we sourced from Veda Global has exceptional aroma and grain length. Our customers in Spain absolutely love it.",
                rating: 5,
                product: "Premium Basmati Rice"
              },
              {
                name: "David Chen",
                location: "Vancouver, Canada",
                review: "Outstanding quality of organic seeds. Their flax and sesame seeds met all our compliance standards with zero hassle.",
                rating: 5,
                product: "Organic Seeds"
              },
              {
                name: "Amina Al-Mansoor",
                location: "Dubai, UAE",
                review: "Excellent response times and client support. The cold-pressed oils are pure and aromatic, matching our premium gourmet retail standards.",
                rating: 5,
                product: "Cold Pressed Oils"
              }
            ].map((t, idx) => (
              <motion.div
                key={idx}
                className="testimonial-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(6, 78, 59, 0.1)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'box-shadow 0.3s ease'
                }}
              >
                <div>
                  <p style={{ color: 'var(--secondary-text)', fontSize: '0.9rem', fontStyle: 'italic', lineHeight: '1.6', marginBottom: '16px' }}>
                    "{t.review}"
                  </p>
                </div>
                <div>
                  <h4 style={{ color: 'var(--heading-color)', margin: '0 0 2px 0', fontSize: '1rem', fontWeight: '750' }}>{t.name}</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                    <span style={{ color: 'var(--primary-text)', fontWeight: '600' }}>{t.location}</span>
                    <span style={{ backgroundColor: 'rgba(6, 78, 59, 0.08)', color: 'var(--heading-color)', padding: '2px 6px', borderRadius: '4px', fontWeight: '600', fontSize: '0.7rem' }}>
                      {t.product}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/testimonials" className="btn-primary" style={{ padding: '12px 28px', fontSize: '0.9rem' }}>
              View All Testimonials
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Contact CTA */}
      <motion.section 
        className="section cta-section text-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container cta-box">
          <h2>Ready to Import India's Purest Harvest?</h2>
          <p>Contact our global trade desk today for customized quotations, product certificates, and sample shipments.</p>
          <Link to="/contact" className="btn-secondary" style={{ backgroundColor: 'var(--vanilla)', color: 'var(--dark-green)' }}>
            Request a Quote
          </Link>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;
