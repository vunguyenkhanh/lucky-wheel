import express from 'express';
import {
  createAdmin,
  deactivateSecretCode,
  deleteAdmin,
  deletePrize,
  generateSecretCode,
  getAdmins,
  getAnalytics,
  getPrizeById,
  getPrizes,
  getSecretCodes,
  managePrize,
  updateAdmin,
} from '../controllers/adminController.js';
import { authenticateAdmin, verifyAdminToken } from '../middleware/auth.js';
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

// Route để lấy danh sách admin
router.get('/', getAdmins);

// Thêm routes cho quản lý admin
router.post('/', verifyAdminToken, createAdmin);
router.put('/:id', verifyAdminToken, updateAdmin);
router.delete('/:id', verifyAdminToken, deleteAdmin);

export default router;
