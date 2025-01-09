import express from 'express';
import { uploadPrizeImage } from '../controllers/uploadController.js';
import { authenticateAdmin } from '../middleware/auth.js';
import { handleUploadError, uploadImage } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/prizes', authenticateAdmin, uploadImage, handleUploadError, uploadPrizeImage);

export default router;
