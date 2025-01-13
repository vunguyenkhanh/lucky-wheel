import express from 'express';
import {
  createSecretCode,
  deleteSecretCode,
  getSecretCode,
  getSecretCodes,
  updateSecretCode,
} from '../controllers/secretCodeController.js';
import { verifyAdminToken } from '../middleware/auth.js';

const router = express.Router();

router.use(verifyAdminToken); // Tất cả routes cần xác thực admin

router.post('/', createSecretCode);
router.get('/', getSecretCodes);
router.get('/:id', getSecretCode);
router.put('/:id', updateSecretCode);
router.delete('/:id', deleteSecretCode);

export default router;
