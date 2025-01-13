import jwt from 'jsonwebtoken';

export const verifyAdminToken = (req, res, next) => {
  const token = req.cookies.admin_token;

  if (!token) {
    return res.status(401).json({ error: 'Không có quyền truy cập' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Không có quyền admin' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token không hợp lệ' });
  }
};

export const verifyCustomerSession = (req, res, next) => {
  if (!req.session || !req.session.customerId || req.session.role !== 'customer') {
    return res.status(401).json({ error: 'Vui lòng đăng nhập' });
  }
  next();
};
