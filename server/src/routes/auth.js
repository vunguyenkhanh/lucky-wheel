import { Router } from 'express';
import { adminLogin, adminLogout, customerLogout } from '../controllers/authController.js';
import { authenticateAdmin, authenticateToken } from '../middleware/auth.js';
import { loginLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Admin routes
router.post('/admin/login', loginLimiter, adminLogin);
router.post('/admin/logout', authenticateAdmin, adminLogout);

// Customer routes
router.post('/customer/logout', authenticateToken, customerLogout);

export default router;
