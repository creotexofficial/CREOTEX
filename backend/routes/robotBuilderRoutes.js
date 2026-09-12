import express from 'express';
import {
  getRobotBuilderData,
  updatePresets,
  updateSlots,
  updateBuilderSettings
} from '../controllers/robotBuilderController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getRobotBuilderData);
router.put('/presets', protect, adminOnly, updatePresets);
router.put('/slots', protect, adminOnly, updateSlots);
router.put('/settings', protect, adminOnly, updateBuilderSettings);

export default router;
