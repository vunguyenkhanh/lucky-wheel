import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';

// Load biến môi trường trước khi import các routes
dotenv.config();

// Import các routes và middleware sau khi load biến môi trường
import { requestLogger } from './middleware/logging.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import authRoutes from './routes/auth.js';
import prizeRoutes from './routes/prize.js';
import secretCodeRoutes from './routes/secretCode.js';
import wheelRoutes from './routes/wheel.js';

const app = express();

// Middleware
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      sameSite: 'strict',
    },
  }),
);

// Apply rate limiting to all routes
app.use('/api', apiLimiter);

app.use(requestLogger);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin/prizes', prizeRoutes);
app.use('/api/prizes', prizeRoutes);
app.use('/api/wheel', wheelRoutes);
app.use('/api/admin/secret-codes', secretCodeRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
