import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const useErrorHandler = () => {
  const navigate = useNavigate();
  const reset = useAuthStore((state) => state.reset);

  const handleError = useCallback(
    (error) => {
      if (error.response) {
        // Xử lý HTTP errors
        switch (error.response.status) {
          case 401:
            reset();
            navigate('/login');
            break;
          case 403:
            navigate('/403');
            break;
          case 404:
            navigate('/404');
            break;
          case 429:
            // Rate limit error
            return {
              error: 'Quá nhiều yêu cầu, vui lòng thử lại sau',
              details: error.response.data.error,
            };
          case 500:
            return {
              error: 'Lỗi hệ thống',
              details: process.env.NODE_ENV === 'development' ? error.response.data : null,
            };
          default:
            return {
              error: error.response.data.error || 'Đã có lỗi xảy ra',
              details: process.env.NODE_ENV === 'development' ? error.response.data : null,
            };
        }
      }
      // Network errors
      return {
        error: 'Không thể kết nối đến server',
        details: error.message,
      };
    },
    [navigate, reset],
  );

  return { handleError };
};
