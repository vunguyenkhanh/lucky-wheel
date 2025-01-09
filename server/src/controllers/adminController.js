import { PrismaClient } from '@prisma/client';

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
        const random = Math.floor(1000 + Math.random() * 9000);
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
