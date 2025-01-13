import express from 'express';
import {
  getSpinHistory,
  getWheelConfig,
  spin,
  updateWheelConfig,
} from '../controllers/wheelController.js';
import { verifyAdminToken, verifyCustomerSession } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/config', getWheelConfig); // Cho phép xem cấu hình mà không cần đăng nhập

// Admin routes
router.put('/config', verifyAdminToken, updateWheelConfig);

// Customer routes
router.post('/spin', verifyCustomerSession, spin);
router.get('/history', verifyCustomerSession, getSpinHistory);

export default router;
