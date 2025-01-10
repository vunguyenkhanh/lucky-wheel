import { PrismaClient } from '@prisma/client';
import express from 'express';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get all prizes
router.get('/', async (req, res) => {
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
});

// Admin routes
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const { name, imageUrl, quantity, winRate } = req.body;
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
});

router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, imageUrl, quantity, winRate } = req.body;
    const prize = await prisma.prize.update({
      where: { id },
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
});

router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.prize.delete({
      where: { id },
    });
    res.json({ message: 'Xóa giải thưởng thành công' });
  } catch (error) {
    console.error('Delete prize error:', error);
    res.status(500).json({ error: 'Lỗi xóa giải thưởng' });
  }
});

export default router;
