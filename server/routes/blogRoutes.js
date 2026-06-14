import express from 'express';
import {
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  toggleBlogVisibility
} from '../controllers/blogController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getBlogs)
  .post(protectAdmin, createBlog);

router.route('/:id/toggle-visibility')
  .patch(protectAdmin, toggleBlogVisibility);

router.route('/:id')
  .put(protectAdmin, updateBlog)
  .delete(protectAdmin, deleteBlog);

router.route('/slug/:slug')
  .get(getBlogBySlug);

export default router;
