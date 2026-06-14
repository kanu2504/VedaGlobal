import express from 'express';
import { loginAdmin, getDashboardStats, updateAdminProfile } from '../controllers/adminController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', loginAdmin);
router.get('/dashboard', protectAdmin, getDashboardStats);
router.put('/profile', protectAdmin, updateAdminProfile);

export default router;
