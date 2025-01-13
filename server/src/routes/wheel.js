import express from 'express';
import { getWheelConfig, spin, updateWheelConfig } from '../controllers/wheelController.js';
import { verifyAdminToken, verifyCustomerSession } from '../middleware/auth.js';

const router = express.Router();

// Admin routes
router.get('/config', verifyAdminToken, getWheelConfig);
router.put('/config', verifyAdminToken, updateWheelConfig);

// Customer routes
router.post('/spin', verifyCustomerSession, spin);

export default router;
