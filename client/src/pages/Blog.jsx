import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from '../api/axios';
import BlogCard from '../components/BlogCard';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data } = await axios.get('/blogs');
        setBlogs(data);
      } catch (err) {
        console.error('Error fetching blogs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="blog-page">

      <section className="section blog-feed-section">
        <div className="container">
          {loading ? (
            <div className="loader-container">
              <div className="loader"></div>
            </div>
          ) : blogs.length === 0 ? (
            <div className="empty-state text-center">
              <span className="empty-icon">📖</span>
              <h2>No Articles Found</h2>
              <p>Check back later for fresh updates and export news.</p>
            </div>
          ) : (
            <div className="blogs-grid">
              {blogs.map((blog, idx) => (
                <motion.div 
                  key={blog._id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: (idx % 3) * 0.1 }}
                  viewport={{ once: true }}
                >
                  <BlogCard blog={blog} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog;
