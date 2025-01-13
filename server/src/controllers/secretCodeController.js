import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Tạo mã bí mật mới
export const createSecretCode = async (req, res) => {
  try {
    const { expirationDate } = req.body;

    // Tạo mã ngẫu nhiên theo format SHxxxx
    const generateCode = () => {
      const random = Math.floor(1000 + Math.random() * 9000);
      return `SH${random}`;
    };

    // Đảm bảo mã không trùng
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
        expirationDate: new Date(expirationDate),
      },
    });

    return res.status(201).json({
      message: 'Tạo mã bí mật thành công',
      secretCode,
    });
  } catch (error) {
    console.error('Create secret code error:', error);
    return res.status(500).json({
      error: 'Có lỗi xảy ra khi tạo mã bí mật',
    });
  }
};

// Lấy danh sách mã bí mật
export const getSecretCodes = async (req, res) => {
  try {
    const secretCodes = await prisma.secretCode.findMany({
      include: {
        customer: {
          select: {
            name: true,
            phoneNumber: true,
          },
        },
      },
      orderBy: {
        expirationDate: 'desc',
      },
    });

    return res.json(secretCodes);
  } catch (error) {
    console.error('Get secret codes error:', error);
    return res.status(500).json({
      error: 'Có lỗi xảy ra khi lấy danh sách mã bí mật',
    });
  }
};

// Cập nhật trạng thái mã
export const updateSecretCode = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, expirationDate } = req.body;

    // Kiểm tra mã tồn tại
    const existingCode = await prisma.secretCode.findUnique({
      where: { id },
    });

    if (!existingCode) {
      return res.status(404).json({
        error: 'Không tìm thấy mã bí mật',
      });
    }

    // Không cho phép cập nhật mã đã sử dụng
    if (existingCode.status === 'Đã dùng') {
      return res.status(400).json({
        error: 'Không thể cập nhật mã đã sử dụng',
      });
    }

    // Validate thời gian hết hạn
    const newExpirationDate = new Date(expirationDate);
    if (isNaN(newExpirationDate.getTime())) {
      return res.status(400).json({
        error: 'Thời gian hết hạn không hợp lệ',
      });
    }

    // Cập nhật trong database
    const updatedCode = await prisma.secretCode.update({
      where: { id },
      data: {
        status: status || existingCode.status,
        expirationDate: newExpirationDate,
      },
    });

    // Log để debug
    console.log('Updated secret code:', {
      id,
      oldExpiration: existingCode.expirationDate,
      newExpiration: updatedCode.expirationDate,
      status: updatedCode.status,
    });

    return res.json({
      message: 'Cập nhật mã bí mật thành công',
      secretCode: updatedCode,
    });
  } catch (error) {
    console.error('Update secret code error:', error);
    return res.status(500).json({
      error: 'Có lỗi xảy ra khi cập nhật mã bí mật',
    });
  }
};

// Xóa mã bí mật
export const deleteSecretCode = async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra mã đã được sử dụng chưa
    const secretCode = await prisma.secretCode.findUnique({
      where: { id },
      include: { customer: true },
    });

    if (!secretCode) {
      return res.status(404).json({
        error: 'Không tìm thấy mã bí mật',
      });
    }

    if (secretCode.customer) {
      return res.status(400).json({
        error: 'Không thể xóa mã đã được sử dụng',
      });
    }

    await prisma.secretCode.delete({
      where: { id },
    });

    return res.json({
      message: 'Xóa mã bí mật thành công',
    });
  } catch (error) {
    console.error('Delete secret code error:', error);
    return res.status(500).json({
      error: 'Có lỗi xảy ra khi xóa mã bí mật',
    });
  }
};
