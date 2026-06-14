import express from 'express';
import {
  getActiveBanners,
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner
} from '../controllers/bannerController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getActiveBanners)
  .post(protectAdmin, createBanner);

router.route('/admin')
  .get(protectAdmin, getAllBanners);

router.route('/:id')
  .put(protectAdmin, updateBanner)
  .delete(protectAdmin, deleteBanner);

export default router;
