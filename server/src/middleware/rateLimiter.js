import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import redis from '../config/redis.js';

// Rate limiter cho đăng nhập
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 5, // Tối đa 5 lần/IP
  message: { error: 'Quá nhiều yêu cầu đăng nhập, vui lòng thử lại sau 15 phút' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter cho quay thưởng
export const spinLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redis.call(...args),
  }),
  windowMs: 60 * 1000, // 1 phút
  max: 3, // Tối đa 3 lần quay/IP
  message: { error: 'Bạn đã quay quá nhiều lần, vui lòng đợi 1 phút' },
  keyGenerator: (req) => req.user.id, // Dùng user ID thay vì IP
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter cho API chung
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 phút
  max: 100, // Tối đa 100 requests/IP
  message: { error: 'Quá nhiều yêu cầu, vui lòng thử lại sau' },
  standardHeaders: true,
  legacyHeaders: false,
});
