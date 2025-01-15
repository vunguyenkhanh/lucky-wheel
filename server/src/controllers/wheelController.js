import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Lấy cấu hình vòng quay
export const getWheelConfig = async (req, res) => {
  try {
    const config = await prisma.wheelConfig.findFirst();
    if (!config) {
      return res.status(404).json({ error: 'Cấu hình vòng quay không tồn tại' });
    }
    const prizes = await prisma.prize.findMany({
      where: {
        quantity: { gt: 0 }, // Chỉ lấy giải thưởng còn số lượng
      },
      orderBy: {
        winRate: 'desc',
      },
    });

    return res.json({
      config,
      prizes,
    });
  } catch (error) {
    console.error('Get wheel config error:', error);
    return res.status(500).json({ error: 'Lỗi lấy cấu hình vòng quay' });
  }
};

// Cập nhật cấu hình vòng quay
export const updateWheelConfig = async (req, res) => {
  try {
    const { colors, fontFamily } = req.body;

    const config = await prisma.wheelConfig.upsert({
      where: { id: 1 }, // Luôn chỉ có 1 config
      update: {
        colors,
        fontFamily,
      },
      create: {
        colors,
        fontFamily,
      },
    });

    return res.json(config);
  } catch (error) {
    console.error('Update wheel config error:', error);
    return res.status(500).json({ error: 'Lỗi cập nhật cấu hình vòng quay' });
  }
};

// Quay thưởng
export const spin = async (req, res) => {
  try {
    const customerId = req.session.customerId;

    // Kiểm tra xem khách hàng đã quay chưa
    if (!customerId) {
      return res.status(401).json({ error: 'Bạn cần đăng nhập để quay thưởng' });
    }

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
      return res.status(400).json({ error: 'Đã hết giải thưởng' });
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

    // Nếu không trúng giải nào, chọn giải cuối cùng
    if (!selectedPrize) {
      selectedPrize = availablePrizes[availablePrizes.length - 1];
    }

    // Cập nhật trong transaction để đảm bảo tính nhất quán
    const result = await prisma.$transaction(async (tx) => {
      // Giảm số lượng giải thưởng
      const updatedPrize = await tx.prize.update({
        where: { id: selectedPrize.id },
        data: { quantity: { decrement: 1 } },
      });

      // Lưu kết quả quay
      const spinResult = await tx.spinResult.create({
        data: {
          customerId,
          prizeId: selectedPrize.id,
        },
        include: {
          prize: true,
        },
      });

      return {
        prize: updatedPrize,
        spinResult,
      };
    });

    // Tính index của giải thưởng để animation quay đến đúng vị trí
    const prizeIndex = availablePrizes.findIndex((p) => p.id === selectedPrize.id);

    return res.json({
      message: 'Quay thưởng thành công',
      prize: result.prize,
      spinResult: result.spinResult,
      prizeIndex,
    });
  } catch (error) {
    console.error('Spin error:', error);
    return res.status(500).json({ error: 'Lỗi quay thưởng' });
  }
};

// Lấy lịch sử quay thưởng
export const getSpinHistory = async (req, res) => {
  try {
    const customerId = req.session.customerId;

    const history = await prisma.spinResult.findMany({
      where: { customerId },
      include: {
        prize: true,
      },
      orderBy: {
        spinTime: 'desc',
      },
    });

    return res.json(history);
  } catch (error) {
    console.error('Get spin history error:', error);
    return res.status(500).json({ error: 'Lỗi lấy lịch sử quay thưởng' });
  }
};
