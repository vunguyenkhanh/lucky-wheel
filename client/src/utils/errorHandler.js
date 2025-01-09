// Tạo file xử lý lỗi chung
export const handleApiError = (error) => {
  if (error.response) {
    // Lỗi từ server (status code không phải 2xx)
    const { status, data } = error.response;
    switch (status) {
      case 400:
        return {
          type: 'VALIDATION_ERROR',
          message: data.error || 'Dữ liệu không hợp lệ',
          errors: data.errors,
        };
      case 401:
        return {
          type: 'AUTH_ERROR',
          message: 'Vui lòng đăng nhập lại',
        };
      case 403:
        return {
          type: 'PERMISSION_ERROR',
          message: 'Bạn không có quyền thực hiện',
        };
      case 404:
        return {
          type: 'NOT_FOUND',
          message: data.error || 'Không tìm thấy dữ liệu',
        };
      case 429:
        return {
          type: 'RATE_LIMIT',
          message: 'Quá nhiều yêu cầu, vui lòng thử lại sau',
        };
      default:
        return {
          type: 'SERVER_ERROR',
          message: 'Đã có lỗi xảy ra',
        };
    }
  }

  if (error.request) {
    // Lỗi network
    return {
      type: 'NETWORK_ERROR',
      message: 'Không thể kết nối đến server',
    };
  }

  // Lỗi khác
  return {
    type: 'UNKNOWN_ERROR',
    message: error.message,
  };
};
