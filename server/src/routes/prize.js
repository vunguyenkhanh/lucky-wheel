import express from 'express';
import { getPrizes, spin } from '../controllers/prizeController.js';
import { authenticateCustomer } from '../middleware/auth.js';
import { spinLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.get('/', getPrizes);
router.post('/spin', authenticateCustomer, spinLimiter, spin);

export default router;
