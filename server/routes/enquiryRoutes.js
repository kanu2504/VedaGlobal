import express from 'express';
import { createEnquiry, getEnquiries, updateEnquiryStatus, deleteEnquiry } from '../controllers/enquiryController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(createEnquiry)
  .get(protectAdmin, getEnquiries);

router.route('/:id')
  .put(protectAdmin, updateEnquiryStatus)
  .delete(protectAdmin, deleteEnquiry);

export default router;
