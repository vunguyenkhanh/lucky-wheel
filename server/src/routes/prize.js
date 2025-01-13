import express from 'express';
import {
  createPrize,
  deletePrize,
  getPrize,
  getPrizes,
  updatePrize,
} from '../controllers/prizeController.js';
import { verifyAdminToken } from '../middleware/auth.js';

const router = express.Router();

// Admin routes (protected)
router.post('/', verifyAdminToken, createPrize);
router.put('/:id', verifyAdminToken, updatePrize);
router.delete('/:id', verifyAdminToken, deletePrize);

// Public routes
router.get('/', getPrizes);
router.get('/:id', getPrize);

export default router;
