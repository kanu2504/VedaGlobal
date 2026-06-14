import express from 'express';
import {
  getCategories,
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getCategories)
  .post(protectAdmin, createCategory);

router.route('/admin')
  .get(protectAdmin, getAdminCategories);

router.route('/:id')
  .put(protectAdmin, updateCategory)
  .delete(protectAdmin, deleteCategory);

export default router;
