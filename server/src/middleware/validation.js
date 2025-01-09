// Validation helpers
const isValidPhoneNumber = (phone) => {
  const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;
  return phoneRegex.test(phone);
};

const isValidDate = (date) => {
  return !isNaN(new Date(date).getTime());
};

// Validation rules
export const validateCustomerRegistration = (req, res, next) => {
  const { fullName, phoneNumber, address } = req.body;

  const errors = [];

  if (!fullName?.trim()) {
    errors.push('Họ tên không được để trống');
  } else if (fullName.length < 2 || fullName.length > 50) {
    errors.push('Họ tên phải từ 2 đến 50 ký tự');
  }

  if (!phoneNumber) {
    errors.push('Số điện thoại không được để trống');
  } else if (!isValidPhoneNumber(phoneNumber)) {
    errors.push('Số điện thoại không hợp lệ');
  }

  if (!address?.trim()) {
    errors.push('Địa chỉ không được để trống');
  } else if (address.length < 5 || address.length > 200) {
    errors.push('Địa chỉ phải từ 5 đến 200 ký tự');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

export const validateSecretCode = (req, res, next) => {
  const { expirationDate, maxUsage, quantity } = req.body;

  const errors = [];

  if (!expirationDate) {
    errors.push('Ngày hết hạn không được để trống');
  } else if (!isValidDate(expirationDate)) {
    errors.push('Ngày hết hạn không hợp lệ');
  } else if (new Date(expirationDate) <= new Date()) {
    errors.push('Ngày hết hạn phải lớn hơn ngày hiện tại');
  }

  if (maxUsage !== undefined) {
    if (typeof maxUsage !== 'number' || maxUsage < 1) {
      errors.push('Số lần sử dụng phải là số dương');
    }
  }

  if (quantity !== undefined) {
    if (typeof quantity !== 'number' || quantity < 1 || quantity > 100) {
      errors.push('Số lượng mã phải từ 1 đến 100');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

export const validatePrize = (req, res, next) => {
  const { name, imageUrl, quantity, winRate } = req.body;

  const errors = [];

  if (!name?.trim()) {
    errors.push('Tên giải thưởng không được để trống');
  } else if (name.length < 2 || name.length > 100) {
    errors.push('Tên giải thưởng phải từ 2 đến 100 ký tự');
  }

  if (!imageUrl?.trim()) {
    errors.push('URL hình ảnh không được để trống');
  } else {
    try {
      new URL(imageUrl);
    } catch {
      errors.push('URL hình ảnh không hợp lệ');
    }
  }

  if (typeof quantity !== 'number' || quantity < 0) {
    errors.push('Số lượng phải là số dương');
  }

  if (typeof winRate !== 'number' || winRate < 0 || winRate > 1) {
    errors.push('Tỷ lệ trúng phải từ 0 đến 1');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

export const validatePagination = (req, res, next) => {
  const { page, limit } = req.query;

  if (page !== undefined) {
    const pageNum = parseInt(page);
    if (isNaN(pageNum) || pageNum < 1) {
      return res.status(400).json({ error: 'Số trang không hợp lệ' });
    }
    req.query.page = pageNum;
  }

  if (limit !== undefined) {
    const limitNum = parseInt(limit);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      return res.status(400).json({ error: 'Giới hạn không hợp lệ (1-100)' });
    }
    req.query.limit = limitNum;
  }

  next();
};

export const validateDateRange = (req, res, next) => {
  const { startDate, endDate } = req.query;

  const errors = [];

  if (startDate && !isValidDate(startDate)) {
    errors.push('Ngày bắt đầu không hợp lệ');
  }

  if (endDate && !isValidDate(endDate)) {
    errors.push('Ngày kết thúc không hợp lệ');
  }

  if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
    errors.push('Ngày bắt đầu phải nhỏ hơn ngày kết thúc');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};
