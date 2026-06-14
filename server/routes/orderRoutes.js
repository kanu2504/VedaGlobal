import express from 'express';
import {
  placeOrder,
  getOrders,
  updateOrderStatus,
  deleteOrder
} from '../controllers/orderController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(placeOrder)
  .get(protectAdmin, getOrders);

router.route('/:id')
  .put(protectAdmin, updateOrderStatus)
  .delete(protectAdmin, deleteOrder);

export default router;
