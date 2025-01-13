import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        error: 'Vui lòng nhập đầy đủ thông tin đăng nhập',
      });
    }

    // Kiểm tra admin trong database
    const admin = await prisma.admin.findUnique({
      where: { username },
    });

    if (!admin) {
      return res.status(401).json({
        error: 'Tài khoản admin không tồn tại',
      });
    }

    // Kiểm tra mật khẩu
    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Mật khẩu không chính xác',
      });
    }

    // Xóa session customer nếu có
    if (req.session) {
      req.session.destroy();
    }

    const token = jwt.sign(
      {
        id: admin.id,
        username: admin.username,
        role: 'admin',
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' },
    );

    // Set token cho admin
    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      token,
      message: 'Đăng nhập thành công',
      user: {
        id: admin.id,
        username: admin.username,
        role: 'admin',
      },
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({
      error: 'Hệ thống đang gặp sự cố. Vui lòng thử lại sau.',
    });
  }
};

export const adminLogout = async (req, res) => {
  try {
    // Xóa cookie nếu có
    res.clearCookie('admin_token');

    return res.status(200).json({
      message: 'Đăng xuất thành công',
    });
  } catch (error) {
    console.error('Admin logout error:', error);
    return res.status(500).json({
      error: 'Có lỗi xảy ra khi đăng xuất',
    });
  }
};

export const customerLogout = async (req, res) => {
  try {
    res.clearCookie('token');
    return res.status(200).json({
      message: 'Đăng xuất thành công',
    });
  } catch (error) {
    console.error('Customer logout error:', error);
    return res.status(500).json({
      error: 'Có lỗi xảy ra khi đăng xuất',
    });
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

    // Xóa token admin nếu có
    res.clearCookie('admin_token');

    // Set session cho customer
    req.session.customerId = customer.id;
    req.session.role = 'customer';

    return res.status(200).json({
      message: 'Xác thực thành công',
      user: {
        id: customer.id,
        phoneNumber: customer.phoneNumber,
        role: 'customer',
      },
    });
  } catch (error) {
    console.error('Customer auth error:', error);
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
