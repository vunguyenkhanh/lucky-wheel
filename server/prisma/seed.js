import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Xóa dữ liệu cũ
  await prisma.$transaction([
    prisma.prizeHistory.deleteMany(),
    prisma.prize.deleteMany(),
    prisma.customer.deleteMany(),
    prisma.secretCode.deleteMany(),
    prisma.admin.deleteMany(),
  ]);

  // Tạo admin mặc định
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.admin.create({
    data: {
      username: 'admin',
      password: hashedPassword,
    },
  });

  // Tạo một số mã bí mật mẫu
  const now = new Date();
  const secretCodes = [
    {
      code: 'SH1234',
      status: 'Chưa dùng',
      expirationDate: new Date(now.getTime() + 24 * 60 * 60 * 1000), // 1 ngày sau
    },
    {
      code: 'SH5678',
      status: 'Đã dùng',
      expirationDate: new Date(now.getTime() + 12 * 60 * 60 * 1000), // 12 giờ sau
      usageCount: 1,
    },
    {
      code: 'SH9012',
      status: 'Hết hạn',
      expirationDate: new Date(now.getTime() - 1 * 60 * 60 * 1000), // 1 giờ trước
    },
  ];

  for (const code of secretCodes) {
    await prisma.secretCode.create({
      data: code,
    });
  }

  // Tạo một số giải thưởng mẫu
  const prizes = [
    {
      name: 'Iphone 15 Pro Max',
      imageUrl: '/images/prizes/iphone.jpg',
      quantity: 1,
      winRate: 0.01, // 1%
    },
    {
      name: 'Voucher 500k',
      imageUrl: '/images/prizes/voucher-500k.jpg',
      quantity: 10,
      winRate: 0.1, // 10%
    },
    {
      name: 'Voucher 200k',
      imageUrl: '/images/prizes/voucher-200k.jpg',
      quantity: 20,
      winRate: 0.2, // 20%
    },
  ];

  for (const prize of prizes) {
    await prisma.prize.create({
      data: prize,
    });
  }

  // Tạo một khách hàng mẫu đã sử dụng mã
  const usedCode = await prisma.secretCode.findUnique({
    where: { code: 'SH5678' },
  });

  await prisma.customer.create({
    data: {
      name: 'Nguyễn Văn A',
      phoneNumber: '0123456789',
      secretCodeId: usedCode.id,
    },
  });

  console.log('Seeding completed successfully');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
