import express from 'express';
import {
  getActiveTestimonials,
  getAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial
} from '../controllers/testimonialController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getActiveTestimonials)
  .post(protectAdmin, createTestimonial);

router.route('/admin')
  .get(protectAdmin, getAllTestimonials);

router.route('/:id')
  .put(protectAdmin, updateTestimonial)
  .delete(protectAdmin, deleteTestimonial);

export default router;
