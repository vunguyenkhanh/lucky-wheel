import { PrismaClient } from '@prisma/client';
import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { spinLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();
const prisma = new PrismaClient();

// Kiểm tra điều kiện quay
router.get('/check-eligibility', authenticateToken, async (req, res) => {
  try {
    // Logic kiểm tra điều kiện quay
    return res.json({ canSpin: true });
  } catch (error) {
    console.error('Check eligibility error:', error);
    return res.status(500).json({ error: 'Lỗi kiểm tra điều kiện quay' });
  }
});

// Quay thưởng
router.post('/spin', authenticateToken, spinLimiter, async (req, res) => {
  try {
    const userId = req.user.id;

    // Lấy tất cả giải thưởng còn số lượng > 0
    const availablePrizes = await prisma.prize.findMany({
      where: {
        quantity: {
          gt: 0,
        },
      },
    });

    if (availablePrizes.length === 0) {
      return res.status(400).json({ error: 'Hết giải thưởng' });
    }

    // Tính tổng tỷ lệ trúng
    const totalRate = availablePrizes.reduce((sum, prize) => sum + prize.winRate, 0);

    // Random số từ 0 đến tổng tỷ lệ
    const random = Math.random() * totalRate;

    // Chọn giải thưởng
    let currentRate = 0;
    let selectedPrize = null;

    for (const prize of availablePrizes) {
      currentRate += prize.winRate;
      if (random <= currentRate) {
        selectedPrize = prize;
        break;
      }
    }

    if (!selectedPrize) {
      selectedPrize = availablePrizes[availablePrizes.length - 1];
    }

    // Giảm số lượng giải thưởng
    await prisma.prize.update({
      where: { id: selectedPrize.id },
      data: { quantity: selectedPrize.quantity - 1 },
    });

    // Lưu lịch sử quay
    const history = await prisma.prizeHistory.create({
      data: {
        customerId: userId,
        prizeId: selectedPrize.id,
      },
      include: {
        prize: true,
      },
    });

    return res.json({
      prize: selectedPrize,
      prizeIndex: availablePrizes.findIndex((p) => p.id === selectedPrize.id),
      history,
    });
  } catch (error) {
    console.error('Spin error:', error);
    return res.status(500).json({ error: 'Lỗi quay thưởng' });
  }
});

// Lấy lịch sử quay
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const history = await prisma.prizeHistory.findMany({
      where: {
        customerId: userId,
      },
      include: {
        prize: true,
      },
      orderBy: {
        spinTime: 'desc',
      },
    });

    return res.json(history);
  } catch (error) {
    console.error('Get history error:', error);
    return res.status(500).json({ error: 'Lỗi lấy lịch sử quay' });
  }
});

export default router;
