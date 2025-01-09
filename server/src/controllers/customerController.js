import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const registerCustomer = async (req, res) => {
  try {
    const { fullName, phoneNumber, address } = req.body;

    // Kiểm tra số điện thoại đã tồn tại
    const existingCustomer = await prisma.customer.findUnique({
      where: { phoneNumber },
    });

    if (existingCustomer) {
      return res.status(400).json({ error: 'Số điện thoại đã được đăng ký' });
    }

    const customer = await prisma.customer.create({
      data: {
        fullName,
        phoneNumber,
        address,
      },
    });

    res.status(201).json({
      message: 'Đăng ký thành công',
      customer: {
        id: customer.id,
        fullName: customer.fullName,
        phoneNumber: customer.phoneNumber,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi đăng ký khách hàng' });
  }
};

export const getCustomerProfile = async (req, res) => {
  try {
    const customerId = req.session.customerId;

    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
      include: {
        spinResults: {
          include: {
            prize: true,
          },
        },
      },
    });

    if (!customer) {
      return res.status(404).json({ error: 'Không tìm thấy thông tin khách hàng' });
    }

    res.json({ customer });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi lấy thông tin khách hàng' });
  }
};
