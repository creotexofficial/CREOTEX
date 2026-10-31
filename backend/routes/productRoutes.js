import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteProductsBySubcategory,
  getCategories
} from '../controllers/productController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/categories/all', getCategories);

router
  .route('/')
  .get(getProducts)
  .post(protect, adminOnly, createProduct);

router.delete('/subcategory/:subCategory', protect, adminOnly, deleteProductsBySubcategory);

router
  .route('/:id')
  .get(getProductById)
  .put(protect, adminOnly, updateProduct)
  .delete(protect, adminOnly, deleteProduct);

export default router;
