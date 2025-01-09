export const validatePhone = (phone) => {
  const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
  return phoneRegex.test(phone);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateName = (name) => {
  return name.length >= 2;
};

export const validateSecretCode = (code) => {
  const codeRegex = /^[A-Z0-9]{8}$/;
  return codeRegex.test(code);
};

export const validatePrize = (prize) => {
  const errors = {};

  if (!prize.name?.trim()) {
    errors.name = 'Tên giải thưởng không được để trống';
  }

  if (!prize.imageUrl?.trim()) {
    errors.imageUrl = 'URL hình ảnh không được để trống';
  }

  if (prize.quantity == null || prize.quantity < 0) {
    errors.quantity = 'Số lượng phải lớn hơn hoặc bằng 0';
  }

  if (prize.winRate == null || prize.winRate < 0 || prize.winRate > 1) {
    errors.winRate = 'Tỷ lệ trúng phải từ 0 đến 1';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
