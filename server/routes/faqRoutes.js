import express from 'express';
import {
  getFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ
} from '../controllers/faqController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getFAQs)
  .post(protectAdmin, createFAQ);

router.route('/:id')
  .put(protectAdmin, updateFAQ)
  .delete(protectAdmin, deleteFAQ);

export default router;
