import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Lấy danh sách giải thưởng
export const getPrizes = async (req, res) => {
  try {
    const prizes = await prisma.prize.findMany({
      orderBy: {
        winRate: 'desc',
      },
    });
    res.json(prizes);
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
    });

    if (!prize) {
      return res.status(404).json({ error: 'Không tìm thấy giải thưởng' });
    }

    res.json(prize);
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

    const prize = await prisma.prize.create({
      data: {
        name,
        imageUrl,
        quantity: parseInt(quantity),
        winRate: parseFloat(winRate),
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
    if (!name || !imageUrl || !quantity || winRate === undefined) {
      return res.status(400).json({
        error: 'Vui lòng nhập đầy đủ thông tin giải thưởng',
      });
    }

    const prize = await prisma.prize.update({
      where: { id: parseInt(id) },
      data: {
        name,
        imageUrl,
        quantity: parseInt(quantity),
        winRate: parseFloat(winRate),
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

    await prisma.prize.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Xóa giải thưởng thành công' });
  } catch (error) {
    console.error('Delete prize error:', error);
    res.status(500).json({ error: 'Lỗi xóa giải thưởng' });
  }
};
