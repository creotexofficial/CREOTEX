import express from 'express';
import {
  getAllDatasheets,
  getDatasheetById,
  trackDownload,
  createDatasheet,
  updateDatasheet,
  deleteDatasheet
} from '../controllers/datasheetController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/:id/download', trackDownload);

router
  .route('/')
  .get(getAllDatasheets)
  .post(protect, adminOnly, createDatasheet);

router
  .route('/:id')
  .get(getDatasheetById)
  .put(protect, adminOnly, updateDatasheet)
  .delete(protect, adminOnly, deleteDatasheet);

export default router;
