import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Deleting old data...');

    // Xóa dữ liệu theo thứ tự để tránh lỗi foreign key
    await prisma.$transaction(async (tx) => {
      await tx.prizeHistory.deleteMany({});
      await tx.prize.deleteMany({});
      await tx.customer.deleteMany({});
      await tx.admin.deleteMany({});
    });

    console.log('Creating new data...');

    // Tạo admin
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.admin.create({
      data: {
        username: 'admin',
        password: adminPassword,
      },
    });
    console.log('Created admin:', admin);

    // Tạo customers
    const customerPassword = await bcrypt.hash('123456', 10);
    const customers = await Promise.all([
      prisma.customer.create({
        data: {
          phoneNumber: '0123456789',
          secretCode: 'SH1234',
          password: customerPassword,
          name: 'Nguyễn Văn A',
        },
      }),
      prisma.customer.create({
        data: {
          phoneNumber: '0987654321',
          secretCode: 'SH5678',
          password: customerPassword,
          name: 'Trần Thị B',
        },
      }),
    ]);
    console.log('Created customers:', customers);

    // Tạo prizes
    const prizes = await Promise.all([
      prisma.prize.create({
        data: {
          name: 'Iphone 15 Pro Max',
          imageUrl: 'https://example.com/iphone.jpg',
          quantity: 1,
          winRate: 0.01, // 1%
        },
      }),
      prisma.prize.create({
        data: {
          name: 'Tai nghe Airpods Pro',
          imageUrl: 'https://example.com/airpods.jpg',
          quantity: 5,
          winRate: 0.05, // 5%
        },
      }),
      prisma.prize.create({
        data: {
          name: 'Voucher 500k',
          imageUrl: 'https://example.com/voucher.jpg',
          quantity: 20,
          winRate: 0.2, // 20%
        },
      }),
      prisma.prize.create({
        data: {
          name: 'Voucher 200k',
          imageUrl: 'https://example.com/voucher.jpg',
          quantity: 50,
          winRate: 0.3, // 30%
        },
      }),
      prisma.prize.create({
        data: {
          name: 'Chúc may mắn lần sau',
          imageUrl: 'https://example.com/better-luck.jpg',
          quantity: 1000,
          winRate: 0.44, // 44%
        },
      }),
    ]);
    console.log('Created prizes:', prizes);

    // Tạo prize history
    const histories = await Promise.all([
      prisma.prizeHistory.create({
        data: {
          customerId: customers[0].id,
          prizeId: prizes[2].id, // Voucher 500k
          spinTime: new Date('2024-03-15T10:00:00Z'),
        },
      }),
      prisma.prizeHistory.create({
        data: {
          customerId: customers[1].id,
          prizeId: prizes[3].id, // Voucher 200k
          spinTime: new Date('2024-03-15T11:00:00Z'),
        },
      }),
    ]);
    console.log('Created histories:', histories);

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
