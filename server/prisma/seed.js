import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Deleting old data...');

    // Xóa dữ liệu theo thứ tự (để tránh lỗi foreign key)
    await prisma.$transaction([
      // Xóa theo thứ tự từ bảng con đến bảng cha
      prisma.prizeHistory.deleteMany(),
      prisma.secretCode.deleteMany(),
      prisma.prize.deleteMany(),
      prisma.customer.deleteMany(),
      prisma.admin.deleteMany(),
    ]);

    console.log('Creating admin account...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.admin.create({
      data: {
        username: 'admin',
        password: hashedPassword,
      },
    });

    console.log('Creating sample prizes...');
    await prisma.prize.createMany({
      data: [
        {
          name: 'Giải Nhất',
          imageUrl: '/prizes/first.png',
          quantity: 1,
          winRate: 0.01,
        },
        {
          name: 'Giải Nhì',
          imageUrl: '/prizes/second.png',
          quantity: 2,
          winRate: 0.02,
        },
        {
          name: 'Giải Ba',
          imageUrl: '/prizes/third.png',
          quantity: 3,
          winRate: 0.03,
        },
      ],
    });

    console.log('Seeding completed.');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error('Error seeding database:', error);
  process.exit(1);
});
