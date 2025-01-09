import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await prisma.admin.findUnique({
      where: { username },
    });

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ error: 'Thông tin đăng nhập không chính xác' });
    }

    const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.json({ message: 'Đăng nhập thành công' });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi đăng nhập' });
  }
};

export const customerAuth = async (req, res) => {
  try {
    const { phoneNumber, secretCode } = req.body;

    const customer = await prisma.customer.findUnique({
      where: { phoneNumber },
    });

    if (!customer) {
      return res.status(404).json({ error: 'Không tìm thấy khách hàng' });
    }

    const validCode = await prisma.secretCode.findFirst({
      where: {
        code: secretCode,
        status: 'Chưa dùng',
        expirationDate: { gt: new Date() },
      },
    });

    if (!validCode) {
      return res.status(401).json({ error: 'Mã bí mật không hợp lệ hoặc đã hết hạn' });
    }

    // Cập nhật trạng thái mã
    await prisma.secretCode.update({
      where: { id: validCode.id },
      data: { status: 'Đã dùng' },
    });

    // Tạo session cho khách hàng
    req.session.customerId = customer.id;

    res.json({ message: 'Xác thực thành công' });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi xác thực' });
  }
};

export const checkSecretCode = async (req, res) => {
  try {
    const { code } = req.params;

    const secretCode = await prisma.secretCode.findUnique({
      where: { code },
    });

    if (!secretCode) {
      return res.status(404).json({ error: 'Mã không tồn tại' });
    }

    if (secretCode.status !== 'Chưa dùng') {
      return res.status(400).json({ error: 'Mã đã được sử dụng hoặc hết hạn' });
    }

    if (new Date() > secretCode.expirationDate) {
      return res.status(400).json({ error: 'Mã đã hết hạn' });
    }

    res.json({ valid: true });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi kiểm tra mã' });
  }
};

export const customerLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Lỗi đăng xuất' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Đăng xuất thành công' });
  });
};
