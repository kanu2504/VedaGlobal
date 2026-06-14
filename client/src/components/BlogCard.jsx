import React from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/imageHelper';

const BlogCard = ({ blog }) => {
  const formattedDate = new Date(blog.createdAt).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <article className="blog-card">
      <div className="blog-card-image">
        <img 
          src={getImageUrl(blog.image)} 
          alt={blog.title} 
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1593113630400-ea4288922497?q=80&w=600&auto=format&fit=crop';
          }}
        />
      </div>
      <div className="blog-card-details">
        <span className="blog-card-meta">{formattedDate} | Veda Global Trade Desk</span>
        <h3 className="blog-card-title">{blog.title}</h3>
        <p className="blog-card-desc">{blog.shortDescription}</p>
        <Link to={`/blog/${blog.slug}`} className="blog-card-link">
          Read Article →
        </Link>
      </div>
    </article>
  );
};

export default BlogCard;
