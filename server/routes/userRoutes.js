import express from 'express';
import {
  getCustomers,
  createCustomer,
  loginCustomer,
  deleteCustomer,
  updateCustomer,
  toggleBlockCustomer,
  getAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  changeAdminRole,
  resetAdminPassword
} from '../controllers/userController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', loginCustomer);
router.post('/register', createCustomer);
router.put('/customers/profile/:id', updateCustomer);

// /api/users routing
router.route('/')
  .get(protectAdmin, getCustomers)
  .post(protectAdmin, createCustomer);

router.route('/customers')
  .get(protectAdmin, getCustomers)
  .post(protectAdmin, createCustomer);

router.route('/:id')
  .put(protectAdmin, updateCustomer)
  .delete(protectAdmin, deleteCustomer);

router.route('/customers/:id')
  .delete(protectAdmin, deleteCustomer);

router.patch('/:id/block', protectAdmin, toggleBlockCustomer);

export default router;
