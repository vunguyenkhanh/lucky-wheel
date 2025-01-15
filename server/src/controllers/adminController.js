import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Quản lý mã bí mật
export const generateSecretCode = async (req, res) => {
  try {
    const { expirationDate, maxUsage = 1, quantity = 1 } = req.body;

    // Validation
    if (!expirationDate) {
      return res.status(400).json({ error: 'Ngày hết hạn không được để trống' });
    }

    const expDate = new Date(expirationDate);
    if (expDate <= new Date()) {
      return res.status(400).json({ error: 'Ngày hết hạn phải lớn hơn ngày hiện tại' });
    }

    if (typeof maxUsage !== 'number' || maxUsage < 1) {
      return res.status(400).json({ error: 'Số lần sử dụng phải là số dương' });
    }

    if (typeof quantity !== 'number' || quantity < 1 || quantity > 100) {
      return res.status(400).json({ error: 'Số lượng mã phải từ 1 đến 100' });
    }

    // Tạo mã ngẫu nhiên format "SHxxxx"
    const generateUniqueCode = async () => {
      let code;
      let existingCode;
      do {
        // Random 4 chữ số, đảm bảo luôn đủ 4 số
        const random = String(Math.floor(1000 + Math.random() * 9000)).padStart(4, '0');
        code = `SH${random}`;
        existingCode = await prisma.secretCode.findUnique({
          where: { code },
        });
      } while (existingCode);
      return code;
    };

    // Tạo nhiều mã cùng lúc
    const secretCodes = await prisma.$transaction(
      Array(quantity)
        .fill(null)
        .map(async () => {
          const code = await generateUniqueCode();
          return prisma.secretCode.create({
            data: {
              code,
              status: 'Chưa dùng',
              expirationDate: expDate,
              maxUsage,
            },
          });
        }),
    );

    res.status(201).json({
      message: `Đã tạo ${quantity} mã bí mật thành công`,
      secretCodes,
    });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi tạo mã bí mật' });
  }
};

// Quản lý giải thưởng
export const managePrize = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, imageUrl, quantity, winRate } = req.body;

    // Validation
    if (!name?.trim()) {
      return res.status(400).json({ error: 'Tên giải thưởng không được để trống' });
    }

    if (!imageUrl?.trim()) {
      return res.status(400).json({ error: 'URL hình ảnh không được để trống' });
    }

    if (typeof quantity !== 'number' || quantity < 0) {
      return res.status(400).json({ error: 'Số lượng phải là số dương' });
    }

    if (typeof winRate !== 'number' || winRate < 0 || winRate > 1) {
      return res.status(400).json({ error: 'Tỷ lệ trúng phải từ 0 đến 1' });
    }

    // Kiểm tra tổng tỷ lệ của tất cả giải thưởng
    const existingPrizes = await prisma.prize.findMany({
      where: {
        id: { not: id ? parseInt(id) : undefined },
      },
    });

    const totalRate = existingPrizes.reduce((sum, prize) => sum + prize.winRate, 0) + winRate;
    if (totalRate > 1) {
      return res
        .status(400)
        .json({ error: 'Tổng tỷ lệ trúng của các giải thưởng không được vượt quá 100%' });
    }

    if (id) {
      // Cập nhật giải thưởng
      const prize = await prisma.prize.update({
        where: { id: parseInt(id) },
        data: {
          name,
          imageUrl,
          quantity,
          winRate,
        },
      });
      res.json({ message: 'Cập nhật giải thưởng thành công', prize });
    } else {
      // Tạo giải thưởng mới
      const prize = await prisma.prize.create({
        data: {
          name,
          imageUrl,
          quantity,
          winRate,
        },
      });
      res.status(201).json({ message: 'Tạo giải thưởng thành công', prize });
    }
  } catch (error) {
    res.status(500).json({ error: 'Lỗi quản lý giải thưởng' });
  }
};

// Thống kê
export const getAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Thống kê giải thưởng
    const prizeStats = await prisma.spinResult.groupBy({
      by: ['prizeId'],
      _count: true,
      where: {
        spinTime: {
          gte: startDate ? new Date(startDate) : undefined,
          lte: endDate ? new Date(endDate) : undefined,
        },
      },
    });

    // Thống kê lượt chơi theo ngày
    const dailyStats = await prisma.spinResult.groupBy({
      by: ['spinTime'],
      _count: true,
      where: {
        spinTime: {
          gte: startDate ? new Date(startDate) : undefined,
          lte: endDate ? new Date(endDate) : undefined,
        },
      },
    });

    res.json({
      prizeStats,
      dailyStats,
    });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi lấy thống kê' });
  }
};

// Lấy danh sách giải thưởng
export const getPrizes = async (req, res) => {
  try {
    const prizes = await prisma.prize.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { spinResults: true },
        },
      },
    });

    res.json({ prizes });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi lấy danh sách giải thưởng' });
  }
};

// Lấy chi tiết một giải thưởng
export const getPrizeById = async (req, res) => {
  try {
    const { id } = req.params;

    const prize = await prisma.prize.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: {
          select: { spinResults: true },
        },
      },
    });

    if (!prize) {
      return res.status(404).json({ error: 'Không tìm thấy giải thưởng' });
    }

    res.json({ prize });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi lấy thông tin giải thưởng' });
  }
};

// Xóa giải thưởng
export const deletePrize = async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra giải thưởng tồn tại
    const prize = await prisma.prize.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: {
          select: { spinResults: true },
        },
      },
    });

    if (!prize) {
      return res.status(404).json({ error: 'Không tìm thấy giải thưởng' });
    }

    // Kiểm tra giải thưởng đã được sử dụng
    if (prize._count.spinResults > 0) {
      return res.status(400).json({ error: 'Không thể xóa giải thưởng đã được sử dụng' });
    }

    await prisma.prize.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Xóa giải thưởng thành công' });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi xóa giải thưởng' });
  }
};

// Lấy danh sách mã bí mật
export const getSecretCodes = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Query với filter và pagination
    const [secretCodes, total] = await prisma.$transaction([
      prisma.secretCode.findMany({
        where: status ? { status } : undefined,
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
        include: {
          _count: {
            select: { spinResults: true },
          },
        },
      }),
      prisma.secretCode.count({
        where: status ? { status } : undefined,
      }),
    ]);

    res.json({
      secretCodes,
      pagination: {
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi lấy danh sách mã bí mật' });
  }
};

// Vô hiệu hóa mã bí mật
export const deactivateSecretCode = async (req, res) => {
  try {
    const { id } = req.params;

    const secretCode = await prisma.secretCode.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: {
          select: { spinResults: true },
        },
      },
    });

    if (!secretCode) {
      return res.status(404).json({ error: 'Không tìm thấy mã bí mật' });
    }

    if (secretCode._count.spinResults > 0) {
      return res.status(400).json({ error: 'Không thể vô hiệu hóa mã đã được sử dụng' });
    }

    await prisma.secretCode.update({
      where: { id: parseInt(id) },
      data: {
        status: 'Hết hạn',
        expirationDate: new Date(), // Set ngày hết hạn về hiện tại
      },
    });

    res.json({ message: 'Vô hiệu hóa mã bí mật thành công' });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi vô hiệu hóa mã bí mật' });
  }
};

// Lấy danh sách admin
export const getAdmins = async (req, res) => {
  try {
    const admins = await prisma.admin.findMany(); // Lấy danh sách admin từ database
    res.json(admins);
  } catch (error) {
    console.error('Get admins error:', error);
    res.status(500).json({ error: 'Lỗi lấy danh sách admin' });
  }
};

// Thêm các hàm xử lý admin
export const createAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username?.trim() || !password?.trim()) {
      return res.status(400).json({ error: 'Username và password không được để trống' });
    }

    // Kiểm tra username đã tồn tại
    const existingAdmin = await prisma.admin.findUnique({
      where: { username },
    });

    if (existingAdmin) {
      return res.status(400).json({ error: 'Username đã tồn tại' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo admin mới
    const admin = await prisma.admin.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    // Loại bỏ password trước khi trả về
    const { password: _, ...adminWithoutPassword } = admin;
    res.status(201).json(adminWithoutPassword);
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({ error: 'Lỗi tạo admin' });
  }
};

export const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password } = req.body;

    // Validate input
    if (!username?.trim()) {
      return res.status(400).json({ error: 'Username không được để trống' });
    }

    // Kiểm tra username đã tồn tại (trừ admin hiện tại)
    const existingAdmin = await prisma.admin.findFirst({
      where: {
        username,
        NOT: { id },
      },
    });

    if (existingAdmin) {
      return res.status(400).json({ error: 'Username đã tồn tại' });
    }

    // Cập nhật admin
    const updateData = { username };
    if (password?.trim()) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const admin = await prisma.admin.update({
      where: { id },
      data: updateData,
    });

    // Loại bỏ password trước khi trả về
    const { password: _, ...adminWithoutPassword } = admin;
    res.json(adminWithoutPassword);
  } catch (error) {
    console.error('Update admin error:', error);
    res.status(500).json({ error: 'Lỗi cập nhật admin' });
  }
};

export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra admin tồn tại
    const admin = await prisma.admin.findUnique({
      where: { id },
    });

    if (!admin) {
      return res.status(404).json({ error: 'Không tìm thấy admin' });
    }

    // Không cho phép xóa admin cuối cùng
    const adminCount = await prisma.admin.count();
    if (adminCount <= 1) {
      return res.status(400).json({ error: 'Không thể xóa admin cuối cùng' });
    }

    await prisma.admin.delete({
      where: { id },
    });

    res.json({ message: 'Xóa admin thành công' });
  } catch (error) {
    console.error('Delete admin error:', error);
    res.status(500).json({ error: 'Lỗi xóa admin' });
  }
};
