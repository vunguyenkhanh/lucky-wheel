import express from 'express';
import {
  deactivateSecretCode,
  deletePrize,
  generateSecretCode,
  getAnalytics,
  getPrizeById,
  getPrizes,
  getSecretCodes,
  managePrize,
} from '../controllers/adminController.js';
import { authenticateAdmin } from '../middleware/auth.js';
import { apiLimiter } from '../middleware/rateLimiter.js';
import { sanitizeInput } from '../middleware/security.js';
import {
  validateDateRange,
  validatePagination,
  validatePrize,
  validateSecretCode,
} from '../middleware/validation.js';

const router = express.Router();

// Middleware xác thực admin cho tất cả routes
router.use(authenticateAdmin, apiLimiter);

// Quản lý mã bí mật
router.post('/secret-codes', sanitizeInput, validateSecretCode, generateSecretCode);
router.get('/secret-codes', validatePagination, getSecretCodes);
router.patch('/secret-codes/:id/deactivate', deactivateSecretCode);

// Quản lý giải thưởng
router.get('/prizes', getPrizes);
router.get('/prizes/:id', getPrizeById);
router.post('/prizes', sanitizeInput, validatePrize, managePrize);
router.put('/prizes/:id', sanitizeInput, validatePrize, managePrize);
router.delete('/prizes/:id', deletePrize);

// Thống kê
router.get('/analytics', validateDateRange, getAnalytics);

export default router;
