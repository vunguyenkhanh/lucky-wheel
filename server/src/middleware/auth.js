import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Không tìm thấy token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Kiểm tra xem có adminId trong decoded token không
    if (decoded.adminId) {
      // Kiểm tra admin trong database
      const admin = await prisma.admin.findUnique({
        where: { id: decoded.adminId },
      });

      if (!admin) {
        return res.status(401).json({ error: 'Admin không tồn tại' });
      }

      req.admin = admin;
      next();
      return;
    }

    // Kiểm tra user trong database nếu không phải admin
    if (decoded.userId) {
      const user = await prisma.customer.findUnique({
        where: { id: decoded.userId },
      });

      if (!user) {
        return res.status(401).json({ error: 'User không tồn tại' });
      }

      req.user = user;
      next();
      return;
    }

    return res.status(401).json({ error: 'Token không hợp lệ' });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token hết hạn' });
    }
    return res.status(401).json({ error: 'Token không hợp lệ' });
  }
};

export const authenticateAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Không tìm thấy token' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token không hợp lệ' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ error: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};

export const authenticateCustomer = (req, res, next) => {
  const customerId = req.session.customerId;

  if (!customerId) {
    return res.status(401).json({ error: 'Vui lòng đăng nhập' });
  }

  next();
};
