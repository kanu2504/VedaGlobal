import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  image: {
    type: String,
    required: true,
    default: 'https://images.unsplash.com/photo-1593113630400-ea4288922497?q=80&w=600&auto=format&fit=crop'
  },
  shortDescription: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    default: 'Veda Global Trade Desk'
  },
  category: {
    type: String,
    default: 'Export Insights'
  },
  publishedDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Published', 'Draft'],
    default: 'Published'
  },
  isVisible: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: { createdAt: true, updatedAt: true }
});

const Blog = mongoose.model('Blog', blogSchema);
export default Blog;
