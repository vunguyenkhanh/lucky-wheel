import rateLimit from 'express-rate-limit';

// Giới hạn request cho API
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100, // Tăng giới hạn lên 100 request/IP
  message: {
    error: 'Quá nhiều yêu cầu, vui lòng thử lại sau.',
  },
  standardHeaders: true, // Trả về RateLimit headers
  legacyHeaders: false,
});

// Giới hạn request cho login
export const loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 giờ
  max: 10, // Tăng giới hạn lên 10 lần/IP
  message: {
    error: 'Quá nhiều lần đăng nhập thất bại, vui lòng thử lại sau.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Không tính các request thành công
});

// Giới hạn request cho wheel spin
export const spinLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 giờ
  max: 1, // Mỗi user chỉ được quay 1 lần/ngày
  message: {
    error: 'Bạn đã hết lượt quay hôm nay.',
  },
  keyGenerator: (req) => req.user?.id || req.ip, // Sử dụng user ID hoặc IP
  standardHeaders: true,
  legacyHeaders: false,
});
