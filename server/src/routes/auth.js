import { Router } from 'express';
import {
  adminLogin,
  adminLogout,
  customerAuth,
  customerLogout,
} from '../controllers/authController.js';
import { authenticateAdmin, authenticateCustomer } from '../middleware/auth.js';
import { loginLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Admin routes (sử dụng JWT)
router.post('/admin/login', loginLimiter, adminLogin);
router.post('/admin/logout', authenticateAdmin, adminLogout);

// Customer routes (sử dụng session)
router.post('/customer/auth', customerAuth);
router.post('/customer/logout', authenticateCustomer, customerLogout);

export default router;
