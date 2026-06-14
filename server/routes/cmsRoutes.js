import express from 'express';
import {
  getCMSContent,
  getAllCMSContent,
  updateCMSContent
} from '../controllers/cmsController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getAllCMSContent);

router.route('/:key')
  .get(getCMSContent)
  .put(protectAdmin, updateCMSContent);

export default router;
