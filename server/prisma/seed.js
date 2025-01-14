import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();

async function main() {
  // Xóa dữ liệu cũ
  await prisma.prizeHistory.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.prize.deleteMany();
  await prisma.secretCode.deleteMany();
  await prisma.admin.deleteMany();

  // Tạo admin mặc định
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.admin.create({
    data: {
      username: 'admin',
      password: hashedPassword,
    },
  });

  // Tạo các mã bí mật
  const secretCodes = [
    {
      code: 'SH0001',
      status: 'Chưa dùng',
      expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 ngày sau
      usageCount: 0,
    },
    {
      code: 'SH0002',
      status: 'Đã dùng',
      expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      usageCount: 1,
    },
    {
      code: 'SH0003',
      status: 'Hết hạn',
      expirationDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 ngày trước
      usageCount: 0,
    },
  ];

  for (const code of secretCodes) {
    await prisma.secretCode.create({
      data: code,
    });
  }

  // Tạo các giải thưởng
  const prizes = [
    {
      name: 'Tai nghe Soundhub Pro',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
      quantity: 5,
      winRate: 0.1, // 10%
    },
    {
      name: 'Loa Bluetooth Mini',
      imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500',
      quantity: 10,
      winRate: 0.2, // 20%
    },
    {
      name: 'Voucher giảm giá 50%',
      imageUrl: 'https://images.unsplash.com/photo-1574887427561-d3d5d58c9273?w=500',
      quantity: 20,
      winRate: 0.3, // 30%
    },
    {
      name: 'Voucher giảm giá 20%',
      imageUrl: 'https://images.unsplash.com/photo-1634733988138-bf2c3a2a13fa?w=500',
      quantity: 30,
      winRate: 0.4, // 40%
    },
  ];

  for (const prize of prizes) {
    await prisma.prize.create({
      data: prize,
    });
  }

  // Tạo khách hàng mẫu và lịch sử quay thưởng
  const usedSecretCode = await prisma.secretCode.findFirst({
    where: { status: 'Đã dùng' },
  });

  const customer = await prisma.customer.create({
    data: {
      name: 'Nguyễn Văn A',
      phoneNumber: '0123456789',
      secretCodeId: usedSecretCode.id,
    },
  });

  // Tạo lịch sử quay thưởng cho khách hàng mẫu
  const randomPrize = await prisma.prize.findFirst();
  await prisma.prizeHistory.create({
    data: {
      customerId: customer.id,
      prizeId: randomPrize.id,
    },
  });

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
