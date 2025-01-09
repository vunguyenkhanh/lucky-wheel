import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  try {
    // Tạo tài khoản admin mặc định
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.admin.create({
      data: {
        username: 'admin',
        password: hashedPassword,
      },
    });
    console.log('Created admin:', admin);

    // Tạo các giải thưởng mẫu
    const prizes = await prisma.prize.createMany({
      data: [
        {
          name: 'Iphone 15 Pro Max',
          imageUrl: '/prizes/iphone.jpg',
          quantity: 1,
          winRate: 0.01, // 1%
        },
        {
          name: 'Tai nghe Airpods Pro',
          imageUrl: '/prizes/airpods.jpg',
          quantity: 3,
          winRate: 0.03, // 3%
        },
        {
          name: 'Voucher 500k',
          imageUrl: '/prizes/voucher-500k.jpg',
          quantity: 10,
          winRate: 0.1, // 10%
        },
        {
          name: 'Voucher 200k',
          imageUrl: '/prizes/voucher-200k.jpg',
          quantity: 20,
          winRate: 0.2, // 20%
        },
        {
          name: 'Chúc may mắn lần sau',
          imageUrl: '/prizes/better-luck.jpg',
          quantity: 1000,
          winRate: 0.66, // 66%
        },
      ],
    });
    console.log('Created prizes:', prizes);

    // Tạo các mã bí mật mẫu
    const secretCodes = await prisma.secretCode.createMany({
      data: Array(10)
        .fill(null)
        .map((_, index) => ({
          code: `SH${String(1001 + index).padStart(4, '0')}`,
          status: 'Chưa dùng',
          expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 ngày
          maxUsage: 1,
        })),
    });
    console.log('Created secret codes:', secretCodes);

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
