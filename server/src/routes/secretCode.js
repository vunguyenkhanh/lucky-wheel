import { Router } from 'express';
import {
  createSecretCode,
  deleteSecretCode,
  getSecretCodes,
  updateSecretCode,
} from '../controllers/secretCodeController.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = Router();

// Tất cả routes đều yêu cầu đăng nhập admin
router.use(authenticateAdmin);

router.post('/', createSecretCode);
router.get('/', getSecretCodes);
router.put('/:id', updateSecretCode);
router.delete('/:id', deleteSecretCode);

export default router;
