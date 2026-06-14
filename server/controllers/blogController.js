import Blog from '../models/Blog.js';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

// Helper to generate a URL slug from title
const generateSlug = (title) => {
  return title
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')       // Replace spaces with -
    .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
    .replace(/\-\-+/g, '-')     // Replace multiple - with single -
    .replace(/^-+/, '')         // Trim - from start of text
    .replace(/-+$/, '');        // Trim - from end of text
};

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
export const getBlogs = async (req, res) => {
  try {
    let filter = { isVisible: true, status: 'Published' };

    // Check if token exists and is valid admin token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'vedaglobalsecret123');
        const admin = await Admin.findById(decoded.id);
        if (admin) {
          filter = {}; // Return all blogs (drafts and hidden) for admin
        }
      } catch (err) {
        // Ignore token error, proceed with public filter
      }
    }

    const blogs = await Blog.find(filter).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get blog by slug
// @route   GET /api/blogs/:slug
// @access  Public
export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) {
      return res.status(404).json({ message: 'Blog article not found' });
    }

    // Check visibility if not admin
    let isAdmin = false;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'vedaglobalsecret123');
        const admin = await Admin.findById(decoded.id);
        if (admin) {
          isAdmin = true;
        }
      } catch (err) {
        // Ignore token error, treat as public
      }
    }

    if (!isAdmin && (!blog.isVisible || blog.status !== 'Published')) {
      return res.status(404).json({ message: 'Blog article is hidden or draft' });
    }

    res.json(blog);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new blog post
// @route   POST /api/blogs
// @access  Private (Admin)
export const createBlog = async (req, res) => {
  const { title, image, shortDescription, content, author, category, publishedDate, status, isVisible, isFeatured } = req.body;

  try {
    if (!title || !shortDescription || !content) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const slug = generateSlug(title);
    
    // Check if slug is unique
    const existing = await Blog.findOne({ slug });
    let finalSlug = slug;
    if (existing) {
      finalSlug = `${slug}-${Date.now()}`;
    }

    const blog = new Blog({
      title,
      slug: finalSlug,
      image,
      shortDescription,
      content,
      author,
      category,
      publishedDate: publishedDate || Date.now(),
      status: status || 'Published',
      isVisible: isVisible !== undefined ? isVisible : true,
      isFeatured: isFeatured !== undefined ? isFeatured : false
    });

    const createdBlog = await blog.save();
    res.status(201).json(createdBlog);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a blog post
// @route   PUT /api/blogs/:id
// @access  Private (Admin)
export const updateBlog = async (req, res) => {
  const { title, image, shortDescription, content, author, category, publishedDate, status, isVisible, isFeatured } = req.body;

  try {
    const blog = await Blog.findById(req.params.id);

    if (blog) {
      blog.title = title || blog.title;
      if (title) {
        blog.slug = generateSlug(title);
      }
      blog.image = image || blog.image;
      blog.shortDescription = shortDescription || blog.shortDescription;
      blog.content = content || blog.content;
      blog.author = author !== undefined ? author : blog.author;
      blog.category = category !== undefined ? category : blog.category;
      blog.publishedDate = publishedDate || blog.publishedDate;
      blog.status = status !== undefined ? status : blog.status;
      blog.isVisible = isVisible !== undefined ? isVisible : blog.isVisible;
      blog.isFeatured = isFeatured !== undefined ? isFeatured : blog.isFeatured;

      const updatedBlog = await blog.save();
      res.json(updatedBlog);
    } else {
      res.status(404).json({ message: 'Blog post not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a blog post
// @route   DELETE /api/blogs/:id
// @access  Private (Admin)
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (blog) {
      await Blog.deleteOne({ _id: blog._id });
      res.json({ message: 'Blog post removed successfully' });
    } else {
      res.status(404).json({ message: 'Blog post not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle blog visibility
// @route   PATCH /api/blogs/:id/toggle-visibility
// @access  Private (Admin)
export const toggleBlogVisibility = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (blog) {
      blog.isVisible = !blog.isVisible;
      const updatedBlog = await blog.save();
      res.json(updatedBlog);
    } else {
      res.status(404).json({ message: 'Blog post not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
