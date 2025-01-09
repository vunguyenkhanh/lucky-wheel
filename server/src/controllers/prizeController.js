import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const spin = async (req, res) => {
  try {
    const customerId = req.session.customerId;

    // Kiểm tra xem khách hàng đã quay chưa
    const existingSpin = await prisma.spinResult.findFirst({
      where: { customerId },
    });

    if (existingSpin) {
      return res.status(400).json({ error: 'Bạn đã sử dụng lượt quay' });
    }

    // Lấy danh sách giải thưởng còn số lượng
    const availablePrizes = await prisma.prize.findMany({
      where: {
        quantity: { gt: 0 },
      },
    });

    if (availablePrizes.length === 0) {
      return res.status(400).json({ error: 'Hiện không có giải thưởng khả dụng' });
    }

    // Random giải thưởng dựa trên tỷ lệ
    const totalRate = availablePrizes.reduce((sum, prize) => sum + prize.winRate, 0);
    let random = Math.random() * totalRate;
    let selectedPrize;

    for (const prize of availablePrizes) {
      random -= prize.winRate;
      if (random <= 0) {
        selectedPrize = prize;
        break;
      }
    }

    // Lưu kết quả và cập nhật số lượng giải thưởng
    const spinResult = await prisma.$transaction([
      prisma.spinResult.create({
        data: {
          customerId,
          prizeId: selectedPrize.id,
        },
      }),
      prisma.prize.update({
        where: { id: selectedPrize.id },
        data: { quantity: { decrement: 1 } },
      }),
    ]);

    res.json({
      message: 'Quay thưởng thành công',
      prize: selectedPrize,
    });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi quay thưởng' });
  }
};

export const getPrizes = async (req, res) => {
  try {
    const prizes = await prisma.prize.findMany();
    res.json({ prizes });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi lấy danh sách giải thưởng' });
  }
};
