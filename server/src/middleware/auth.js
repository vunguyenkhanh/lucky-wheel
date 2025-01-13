import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

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

    // Kiểm tra role admin
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Không có quyền truy cập trang admin' });
    }

    // Kiểm tra admin trong database
    const admin = await prisma.admin.findUnique({
      where: { id: decoded.id },
    });

    if (!admin) {
      return res.status(401).json({ error: 'Tài khoản admin không tồn tại' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ error: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};

export const authenticateCustomer = async (req, res, next) => {
  try {
    // Kiểm tra session của customer
    if (!req.session || !req.session.customerId) {
      return res.status(401).json({ error: 'Vui lòng đăng nhập' });
    }

    // Kiểm tra customer trong database
    const customer = await prisma.customer.findUnique({
      where: { id: req.session.customerId },
    });

    if (!customer) {
      return res.status(401).json({ error: 'Tài khoản không tồn tại' });
    }

    req.customer = customer;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ error: 'Phiên đăng nhập không hợp lệ' });
  }
};
