import express from 'express';
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder
} from '../controllers/orderController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/', protect, adminOnly, getAllOrders);

router
  .route('/:id')
  .get(getOrderById)
  .delete(protect, adminOnly, deleteOrder);

router.put('/:id/status', protect, adminOnly, updateOrderStatus);

export default router;
