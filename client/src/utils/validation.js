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
  const codeRegex = /^SH\d{4}$/;
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

export const validateLoginForm = (values) => {
  const errors = {};

  // Phone validation
  if (!values.phoneNumber) {
    errors.phoneNumber = 'Vui lòng nhập số điện thoại';
  } else if (!/^(0|84)[3|5|7|8|9][0-9]{8}$/.test(values.phoneNumber)) {
    errors.phoneNumber = 'Số điện thoại không hợp lệ';
  }

  // Secret code validation
  if (!values.secretCode) {
    errors.secretCode = 'Vui lòng nhập mã bí mật';
  } else if (!/^SH\d{4}$/.test(values.secretCode)) {
    errors.secretCode = 'Mã bí mật phải có dạng SHxxxx (x là số)';
  }

  return errors;
};

export const validateRegisterForm = (values) => {
  const errors = {};

  // Full name validation
  if (!values.fullName) {
    errors.fullName = 'Vui lòng nhập họ tên';
  } else if (values.fullName.length < 2) {
    errors.fullName = 'Họ tên phải có ít nhất 2 ký tự';
  }

  // Phone validation
  if (!values.phoneNumber) {
    errors.phoneNumber = 'Vui lòng nhập số điện thoại';
  } else if (!/^(0|84)[3|5|7|8|9][0-9]{8}$/.test(values.phoneNumber)) {
    errors.phoneNumber = 'Số điện thoại không hợp lệ';
  }

  // Address validation
  if (!values.address?.trim()) {
    errors.address = 'Vui lòng nhập địa chỉ';
  }

  return errors;
};

export const validateAdminLoginForm = (values) => {
  const errors = {};

  // Username validation
  if (!values.username) {
    errors.username = 'Vui lòng nhập tên đăng nhập';
  } else if (values.username.length < 3) {
    errors.username = 'Tên đăng nhập phải có ít nhất 3 ký tự';
  }

  // Password validation
  if (!values.password) {
    errors.password = 'Vui lòng nhập mật khẩu';
  } else if (values.password.length < 6) {
    errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
  }

  return errors;
};
