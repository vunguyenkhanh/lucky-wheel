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

    const token = jwt.sign(
      {
        id: admin.id,
        username: admin.username,
        role: 'admin',
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' },
    );

    // Xóa session customer nếu có
    if (req.session) {
      req.session.destroy((err) => {
        if (err) console.error('Error destroying session:', err);
      });
    }

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
    // Xóa session
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        return res.status(500).json({
          error: 'Có lỗi xảy ra khi đăng xuất',
        });
      }
      return res.status(200).json({
        message: 'Đăng xuất thành công',
      });
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

    // Validate input
    if (!phoneNumber || !secretCode) {
      return res.status(400).json({
        error: 'Vui lòng nhập đầy đủ số điện thoại và mã bí mật',
      });
    }

    // Kiểm tra customer
    const customer = await prisma.customer.findUnique({
      where: { phoneNumber },
    });

    if (!customer) {
      return res.status(401).json({
        error: 'Số điện thoại chưa được đăng ký. Vui lòng đăng ký trước khi đăng nhập.',
      });
    }

    // Kiểm tra mã bí mật
    const validCode = await prisma.secretCode.findFirst({
      where: {
        code: secretCode,
        status: 'Chưa dùng',
        expirationDate: { gt: new Date() },
      },
    });

    if (!validCode) {
      return res.status(401).json({
        error: 'Mã bí mật không hợp lệ hoặc đã hết hạn. Vui lòng liên hệ Admin để được cấp mã mới.',
      });
    }

    // Cập nhật trạng thái mã
    await prisma.secretCode.update({
      where: { id: validCode.id },
      data: {
        status: 'Đã dùng',
        customerId: customer.id,
      },
    });

    // Xóa admin token nếu có
    res.clearCookie('admin_token');

    // Set session cho customer
    req.session.customerId = customer.id;
    req.session.role = 'customer';

    return res.status(200).json({
      message: 'Đăng nhập thành công',
      user: {
        id: customer.id,
        name: customer.name,
        phoneNumber: customer.phoneNumber,
        role: 'customer',
      },
    });
  } catch (error) {
    console.error('Customer auth error:', error);
    return res.status(500).json({
      error: 'Hệ thống đang gặp sự cố. Vui lòng thử lại sau.',
    });
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

export const customerRegister = async (req, res) => {
  try {
    console.log('Register request body:', req.body); // Log request data

    const { name, phoneNumber, address } = req.body;

    // Log validation
    console.log('Validating input:', { name, phoneNumber, address });

    // Validate input
    if (!name || !phoneNumber || !address) {
      return res.status(400).json({
        error: 'Vui lòng nhập đầy đủ thông tin',
      });
    }

    // Kiểm tra số điện thoại đã tồn tại
    const existingCustomer = await prisma.customer.findUnique({
      where: { phoneNumber },
    });

    if (existingCustomer) {
      return res.status(400).json({
        error: 'Số điện thoại đã được đăng ký',
      });
    }

    // Log before creating customer
    console.log('Creating customer with data:', {
      name: name.trim(),
      phoneNumber: phoneNumber.trim(),
      address: address.trim(),
    });

    const customer = await prisma.customer.create({
      data: {
        name: name.trim(),
        phoneNumber: phoneNumber.trim(),
        address: address.trim(),
      },
    });

    // Log created customer
    console.log('Created customer:', customer);

    return res.status(201).json({
      message: 'Đăng ký thành công',
      customer,
    });
  } catch (error) {
    console.error('Customer register error:', error);
    // Log detailed error
    if (error.code === 'P2002') {
      console.log('Unique constraint violation:', error.meta);
    }
    return res.status(500).json({
      error: 'Có lỗi xảy ra khi đăng ký. Vui lòng thử lại sau.',
    });
  }
};
