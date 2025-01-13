import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Lấy danh sách giải thưởng
export const getPrizes = async (req, res) => {
  try {
    const prizes = await prisma.prize.findMany({
      orderBy: {
        id: 'desc',
      },
      include: {
        _count: true,
      },
    });

    const prizesWithCount = prizes.map((prize) => ({
      ...prize,
      spinCount: prize._count.spinResults,
      _count: undefined,
    }));

    res.json(prizesWithCount);
  } catch (error) {
    console.error('Get prizes error:', error);
    res.status(500).json({ error: 'Lỗi lấy danh sách giải thưởng' });
  }
};

// Lấy chi tiết một giải thưởng
export const getPrize = async (req, res) => {
  try {
    const { id } = req.params;
    const prize = await prisma.prize.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: true,
      },
    });

    if (!prize) {
      return res.status(404).json({ error: 'Không tìm thấy giải thưởng' });
    }

    const prizeWithCount = {
      ...prize,
      spinCount: prize._count.spinResults,
      _count: undefined,
    };

    res.json(prizeWithCount);
  } catch (error) {
    console.error('Get prize error:', error);
    res.status(500).json({ error: 'Lỗi lấy thông tin giải thưởng' });
  }
};

// Tạo giải thưởng mới
export const createPrize = async (req, res) => {
  try {
    const { name, imageUrl, quantity, winRate } = req.body;

    // Validate input
    if (!name || !imageUrl || !quantity || winRate === undefined) {
      return res.status(400).json({
        error: 'Vui lòng nhập đầy đủ thông tin giải thưởng',
      });
    }

    // Validate winRate
    const rate = parseFloat(winRate);
    if (isNaN(rate) || rate < 0 || rate > 1) {
      return res.status(400).json({
        error: 'Tỷ lệ trúng phải là số từ 0 đến 1',
      });
    }

    // Validate quantity
    const qty = parseInt(quantity);
    if (isNaN(qty) || qty < 0) {
      return res.status(400).json({
        error: 'Số lượng phải là số không âm',
      });
    }

    // Kiểm tra tổng tỷ lệ trúng không vượt quá 1
    const existingPrizes = await prisma.prize.findMany();
    const totalRate = existingPrizes.reduce((sum, p) => sum + p.winRate, 0) + rate;

    if (totalRate > 1) {
      return res.status(400).json({
        error: 'Tổng tỷ lệ trúng của tất cả giải thưởng không được vượt quá 100%',
      });
    }

    const prize = await prisma.prize.create({
      data: {
        name: name.trim(),
        imageUrl: imageUrl.trim(),
        quantity: qty,
        winRate: rate,
      },
    });

    res.status(201).json(prize);
  } catch (error) {
    console.error('Create prize error:', error);
    res.status(500).json({ error: 'Lỗi tạo giải thưởng' });
  }
};

// Cập nhật giải thưởng
export const updatePrize = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, imageUrl, quantity, winRate } = req.body;

    // Validate input
    if (!name || !imageUrl || quantity === undefined || winRate === undefined) {
      return res.status(400).json({
        error: 'Vui lòng nhập đầy đủ thông tin giải thưởng',
      });
    }

    // Validate winRate
    const rate = parseFloat(winRate);
    if (isNaN(rate) || rate < 0 || rate > 1) {
      return res.status(400).json({
        error: 'Tỷ lệ trúng phải là số từ 0 đến 1',
      });
    }

    // Validate quantity
    const qty = parseInt(quantity);
    if (isNaN(qty) || qty < 0) {
      return res.status(400).json({
        error: 'Số lượng phải là số không âm',
      });
    }

    // Kiểm tra tổng tỷ lệ trúng không vượt quá 1
    const existingPrizes = await prisma.prize.findMany({
      where: {
        NOT: {
          id: parseInt(id),
        },
      },
    });
    const totalRate = existingPrizes.reduce((sum, p) => sum + p.winRate, 0) + rate;

    if (totalRate > 1) {
      return res.status(400).json({
        error: 'Tổng tỷ lệ trúng của tất cả giải thưởng không được vượt quá 100%',
      });
    }

    const prize = await prisma.prize.update({
      where: { id: parseInt(id) },
      data: {
        name: name.trim(),
        imageUrl: imageUrl.trim(),
        quantity: qty,
        winRate: rate,
      },
    });

    res.json(prize);
  } catch (error) {
    console.error('Update prize error:', error);
    res.status(500).json({ error: 'Lỗi cập nhật giải thưởng' });
  }
};

// Xóa giải thưởng
export const deletePrize = async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra xem giải thưởng đã được sử dụng chưa
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

    if (prize._count.spinResults > 0) {
      return res.status(400).json({
        error: 'Không thể xóa giải thưởng đã được sử dụng',
      });
    }

    await prisma.prize.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Xóa giải thưởng thành công' });
  } catch (error) {
    console.error('Delete prize error:', error);
    res.status(500).json({ error: 'Lỗi xóa giải thưởng' });
  }
};
