import React from 'react';
import { motion } from 'framer-motion';
import Logo from '../components/Logo';

const About = () => {
  const teamMembers = [
    {
      name: "Arjun Mehta",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300"
    },
    {
      name: "Vikram Singh",
      role: "Marketing Head",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300"
    },
    {
      name: "Michael Brown",
      role: "Operations Manager",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=300"
    },
    {
      name: "Rohan Sharma",
      role: "Export Manager",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=300"
    },
    {
      name: "Priya Mehta",
      role: "Quality Manager",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=300"
    },
    {
      name: "John Doe",
      role: "Business Development",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300"
    }
  ];

  return (
    <div className="about-page">

      <div className="about-sections-wrapper">
        
        {/* 2. Section 1: Get To Know Us */}
        <section className="about-section">
          <div className="about-container about-row image-right">
            <motion.div 
              className="about-logo-card"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <Logo light={false} />
            </motion.div>

            <motion.div 
              className="about-content"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <span className="get-to-know">GET TO KNOW US</span>
              <h2>Veda Global – Cultivating Excellence, Delivering Globally</h2>
              <p>
                Veda Global is a Rajasthan-based export company specializing in high-quality rice, spices, millets, seeds, and cold-pressed organic oils. With a deep-rooted commitment to authenticity and excellence, we bring the finest agricultural products from India to global markets. Our range includes premium Basmati and Non-Basmati rice, flavorful Indian spices, nutrient-rich millets, quality seeds, and natural cold-pressed oils.
              </p>
              <p>
                At Veda Global, we prioritize quality, sustainability, and customer satisfaction, ensuring that every product meets international standards. By sourcing directly from trusted farmers and employing eco-friendly practices, we guarantee purity and freshness in every shipment.
              </p>
            </motion.div>
          </div>
        </section>

        {/* 3. Section 2: From Farm to Global Markets */}
        <section className="about-section bg-light-section">
          <div className="about-container about-row image-left">
            <motion.div 
              className="about-story-image"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <img 
                src="/images/farm-global-3d.png" 
                alt="From Farm to Global Markets" 
              />
            </motion.div>

            <motion.div 
              className="about-content"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <h2>From Farm to Global Markets</h2>
              <p>
                Our journey began with a simple yet powerful belief: that the world deserves to experience the authentic flavors and natural goodness of India. We started by cultivating strong relationships with trusted farming communities, nurturing crops with care and respect for nature.
              </p>
              <p>
                We work closely with farmers, providing them with support and guidance to ensure that their products meet our stringent standards. This direct connection allows us to trace the origins of our products, guaranteeing purity and authenticity.
              </p>
            </motion.div>
          </div>
        </section>

        {/* 4. Section 3: Our Vision for the Future */}
        <section className="about-section">
          <div className="about-container about-row image-right">
            <motion.div 
              className="about-vision-image"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <img 
                src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800" 
                alt="Indian Spices Market and Agriculture" 
              />
            </motion.div>

            <motion.div 
              className="about-content"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <h2>Our Vision for the Future</h2>
              <p>
                We envision a world where everyone has access to the authentic flavors and natural products of India. We are committed to expanding our reach, bringing our high-quality products to more people around the globe.
              </p>
              <p>
                But our vision goes beyond just exporting products. We are also committed to promoting sustainable agriculture and supporting the communities that we work with. We believe that by working together, we can create a better future for all.
              </p>
            </motion.div>
          </div>
        </section>

        {/* 5. Section 4: Meet Our Team */}
        <section className="about-page-section team-section bg-light-section">
          <div className="container">
            <motion.div 
              className="section-header text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="team-main-title">Meet Our Team</h2>
              <div className="section-divider"></div>
            </motion.div>

            <div className="team-grid">
              {teamMembers.map((member, idx) => (
                <motion.div 
                  className="team-card"
                  key={idx}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.08 }}
                  viewport={{ once: true }}
                >
                  <div className="team-avatar-wrapper">
                    <img src={member.image} alt={member.name} className="team-avatar" />
                  </div>
                  <h3>{member.name}</h3>
                  <p className="team-role">{member.role}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default About;
