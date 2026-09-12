import express from 'express';
import {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer
} from '../controllers/customerController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(protect, adminOnly, getAllCustomers)
  .post(protect, adminOnly, createCustomer);

router
  .route('/:id')
  .get(protect, adminOnly, getCustomerById)
  .put(protect, adminOnly, updateCustomer)
  .delete(protect, adminOnly, deleteCustomer);

export default router;
