import express from 'express';
import {
  getAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  changeAdminRole,
  resetAdminPassword
} from '../controllers/userController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protectAdmin, getAdmins)
  .post(protectAdmin, createAdmin);

router.route('/:id')
  .put(protectAdmin, updateAdmin)
  .delete(protectAdmin, deleteAdmin);

router.patch('/:id/role', protectAdmin, changeAdminRole);
router.patch('/:id/reset-password', protectAdmin, resetAdminPassword);

export default router;
