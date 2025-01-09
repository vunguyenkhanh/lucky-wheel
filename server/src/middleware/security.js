import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100, // Giới hạn mỗi IP tối đa 100 request trong 15 phút
  message: { error: 'Quá nhiều yêu cầu, vui lòng thử lại sau.' },
});

export const loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 giờ
  max: 5, // Giới hạn 5 lần đăng nhập thất bại/IP/giờ
  message: { error: 'Quá nhiều lần đăng nhập thất bại, vui lòng thử lại sau.' },
});

export const sanitizeInput = (req, res, next) => {
  // Làm sạch body
  if (req.body) {
    Object.keys(req.body).forEach((key) => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].trim();
      }
    });
  }
  next();
};
