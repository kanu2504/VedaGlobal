import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../api/axios';
import { getImageUrl } from '../utils/imageHelper';

const BlogDetails = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlogDetails = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/blogs/slug/${slug}`);
        setBlog(data);
      } catch (err) {
        console.error(err);
        setError('Article not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchBlogDetails();
  }, [slug]);

  if (loading) {
    return <div className="loader-container"><div className="loader"></div></div>;
  }

  if (error || !blog) {
    return (
      <div className="container section text-center" style={{ minHeight: '60vh', paddingTop: '120px' }}>
        <h2>Article Not Found</h2>
        <p>{error || 'The requested article could not be loaded.'}</p>
        <Link to="/blog" className="btn-primary" style={{ marginTop: '20px' }}>Back to Blog Insights</Link>
      </div>
    );
  }

  const formattedDate = new Date(blog.createdAt).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="blog-details-page">
      <div className="blog-details-header">
        <div className="container">
          <Link to="/blog" className="back-link">
            ← Back to Insights
          </Link>
          <h1 style={{ marginTop: '20px' }}>{blog.title}</h1>
          <div className="blog-meta-bar">
            <span>Published on {formattedDate}</span> | <span>By {blog.author || 'Veda Global Export Desk'}</span>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="blog-details-wrapper">
          <img 
            src={getImageUrl(blog.image)} 
            alt={blog.title} 
            className="blog-details-image"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1593113630400-ea4288922497?q=80&w=800&auto=format&fit=crop';
            }}
          />
          
          <div className="blog-content-body">
            {/* Split content by double newlines to render as separate paragraphs */}
            {blog.content.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
