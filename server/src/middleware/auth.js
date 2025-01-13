import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const authenticateAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Không tìm thấy token' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Không có quyền truy cập' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token không hợp lệ' });
  }
};

export const authenticateCustomer = (req, res, next) => {
  if (!req.session || !req.session.customerId) {
    return res.status(401).json({ error: 'Vui lòng đăng nhập' });
  }

  if (req.session.role !== 'customer') {
    return res.status(403).json({ error: 'Không có quyền truy cập' });
  }

  next();
};
