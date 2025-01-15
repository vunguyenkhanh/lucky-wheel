import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Lấy danh sách mã bí mật
export const getSecretCodes = async (req, res) => {
  try {
    const secretCodes = await prisma.secretCode.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.json(secretCodes);
  } catch (error) {
    console.error('Get secret codes error:', error);
    res.status(500).json({ error: 'Lỗi lấy danh sách mã bí mật' });
  }
};

// Lấy chi tiết một mã bí mật
export const getSecretCode = async (req, res) => {
  try {
    const { id } = req.params;
    const secretCode = await prisma.secretCode.findUnique({
      where: { id },
    });

    if (!secretCode) {
      return res.status(404).json({ error: 'Không tìm thấy mã bí mật' });
    }

    res.json(secretCode);
  } catch (error) {
    console.error('Get secret code error:', error);
    return res.status(500).json({ error: 'Lỗi lấy thông tin mã bí mật' });
  }
};

// Tạo mã bí mật mới
export const createSecretCode = async (req, res) => {
  try {
    const { expirationDate } = req.body;

    // Validate input
    if (!expirationDate) {
      return res.status(400).json({
        error: 'Vui lòng nhập thời gian hết hạn',
      });
    }

    // Validate expirationDate
    const expDate = new Date(expirationDate);
    if (isNaN(expDate.getTime())) {
      return res.status(400).json({
        error: 'Thời gian hết hạn không hợp lệ',
      });
    }

    // Tạo mã ngẫu nhiên với format "SHxxxx"
    const generateCode = () => {
      const random = Math.floor(1000 + Math.random() * 9000);
      return `SH${random}`;
    };

    // Đảm bảo mã không trùng lặp
    let code;
    let existingCode;
    do {
      code = generateCode();
      existingCode = await prisma.secretCode.findUnique({
        where: { code },
      });
    } while (existingCode);

    const secretCode = await prisma.secretCode.create({
      data: {
        code,
        status: 'Chưa dùng',
        expirationDate: expDate,
        usageCount: 0,
      },
    });

    res.status(201).json(secretCode);
  } catch (error) {
    console.error('Create secret code error:', error);
    res.status(500).json({ error: 'Lỗi tạo mã bí mật' });
  }
};

// Cập nhật mã bí mật
export const updateSecretCode = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, expirationDate } = req.body;

    const secretCode = await prisma.secretCode.findUnique({
      where: { id },
    });

    if (!secretCode) {
      return res.status(404).json({ error: 'Không tìm thấy mã bí mật' });
    }

    const updateData = {};

    if (status) {
      updateData.status = status;
    }

    if (expirationDate) {
      updateData.expirationDate = new Date(expirationDate);
    }

    const updatedCode = await prisma.secretCode.update({
      where: { id },
      data: updateData,
    });

    res.json(updatedCode);
  } catch (error) {
    console.error('Update secret code error:', error);
    res.status(500).json({ error: 'Lỗi cập nhật mã bí mật' });
  }
};

// Xóa mã bí mật
export const deleteSecretCode = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.secretCode.delete({
      where: { id },
    });

    res.json({ message: 'Xóa mã bí mật thành công' });
  } catch (error) {
    console.error('Delete secret code error:', error);
    res.status(500).json({ error: 'Lỗi xóa mã bí mật' });
  }
};

// Sửa lại phần xử lý khi customer sử dụng mã
export const customerAuth = async (req, res) => {
  try {
    const { phoneNumber, secretCode } = req.body; // Giả sử bạn nhận phoneNumber từ body

    // Validate phone number format
    const phoneNumberRegex = /^[0-9]{10}$/;
    if (!phoneNumberRegex.test(phoneNumber)) {
      return res.status(400).json({
        error: 'Số điện thoại không hợp lệ',
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
        error: 'Mã bí mật không hợp lệ hoặc đã hết hạn',
      });
    }

    // Cập nhật trạng thái mã
    await prisma.secretCode.update({
      where: { id: validCode.id },
      data: {
        usageCount: { increment: 1 },
        status: 'Đã dùng',
      },
    });

    // ... phần code còn lại giữ nguyên ...
  } catch (error) {
    console.error('Customer auth error:', error);
    return res.status(500).json({
      error: 'Hệ thống đang gặp sự cố. Vui lòng thử lại sau.',
    });
  }
};
