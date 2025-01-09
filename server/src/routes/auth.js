import express from 'express';
import {
  adminLogin,
  checkSecretCode,
  customerAuth,
  customerLogout,
} from '../controllers/authController.js';
import { authenticateCustomer } from '../middleware/auth.js';
import { loginLimiter, sanitizeInput } from '../middleware/security.js';

const router = express.Router();

router.post('/admin/login', loginLimiter, sanitizeInput, adminLogin);
router.post('/customer/auth', loginLimiter, sanitizeInput, customerAuth);
router.get('/secret-codes/check/:code', checkSecretCode);
router.post('/customer/logout', authenticateCustomer, customerLogout);

export default router;
