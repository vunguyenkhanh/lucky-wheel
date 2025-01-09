import express from 'express';
import { getCustomerProfile, registerCustomer } from '../controllers/customerController.js';
import { authenticateCustomer } from '../middleware/auth.js';
import { validateCustomerRegistration } from '../middleware/validation.js';

const router = express.Router();

router.post('/register', validateCustomerRegistration, registerCustomer);
router.get('/profile', authenticateCustomer, getCustomerProfile);

export default router;
