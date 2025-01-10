import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { apiLimiter } from './middleware/rateLimiter.js';
import authRoutes from './routes/auth.js';
import prizeRoutes from './routes/prize.js';
import wheelRoutes from './routes/wheel.js';

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  }),
);
app.use(express.json());

// Apply rate limiting to all routes
app.use('/api', apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin/prizes', prizeRoutes);
app.use('/api/prizes', prizeRoutes);
app.use('/api/wheel', wheelRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
