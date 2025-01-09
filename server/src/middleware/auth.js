import jwt from 'jsonwebtoken';

export const authenticateAdmin = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ error: 'Không tìm thấy token xác thực' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.adminId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token không hợp lệ' });
  }
};

export const authenticateCustomer = (req, res, next) => {
  const customerId = req.session.customerId;

  if (!customerId) {
    return res.status(401).json({ error: 'Vui lòng đăng nhập' });
  }

  next();
};
