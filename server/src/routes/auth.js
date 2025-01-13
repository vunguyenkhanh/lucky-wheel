import express from 'express';
import {
  adminLogin,
  adminLogout,
  customerAuth,
  customerLogout,
  customerRegister,
} from '../controllers/authController.js';

const router = express.Router();

// Admin routes
router.post('/admin/login', adminLogin);
router.post('/admin/logout', adminLogout);

// Customer routes
router.post('/customer/register', customerRegister);
router.post('/customer/login', customerAuth);
router.post('/customer/logout', customerLogout);

export default router;
