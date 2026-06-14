import express from 'express';
import {
  getSettings,
  updateSetting,
  updateSettingMode,
  getBlogVisibility,
  updateBlogVisibility
} from '../controllers/settingController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getSettings);

router.route('/blog-visibility')
  .get(getBlogVisibility)
  .put(protectAdmin, updateBlogVisibility);

router.route('/mode')
  .put(protectAdmin, updateSettingMode);

router.route('/:key')
  .put(protectAdmin, updateSetting);

export default router;
