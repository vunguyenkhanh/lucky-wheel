import { useState } from 'react';
import LoadingOverlay from '../components/common/LoadingOverlay';
import { useAuth } from '../hooks/useAuth';
import { useErrorHandler } from '../hooks/useErrorHandler';
import { validatePhone, validateSecretCode } from '../utils/validation';

function Login() {
  const { loading: authLoading } = useAuth(false);
  const { handleError } = useErrorHandler();
  const [formData, setFormData] = useState({
    phoneNumber: '',
    secretCode: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      // Validate
      const newErrors = {};
      if (!validatePhone(formData.phoneNumber)) {
        newErrors.phoneNumber = 'Số điện thoại không hợp lệ';
      }
      if (!validateSecretCode(formData.secretCode)) {
        newErrors.secretCode = 'Mã bí mật không hợp lệ';
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setLoading(false);
        return;
      }

      await useAuthStore.getState().login(formData);
    } catch (err) {
      const errorInfo = handleError(err);
      setErrors({ submit: errorInfo.error });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <Loading />;

  return (
    <LoadingOverlay loading={loading}>
      <div className="max-w-md mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Đăng Nhập</h2>
        {errors.submit && (
          <div className="bg-red-50 text-red-500 p-4 rounded-md mb-4">{errors.submit}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Số Điện Thoại
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={`input ${errors.phoneNumber ? 'border-red-500' : ''}`}
              required
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>
            )}
          </div>
          <div>
            <label htmlFor="secretCode" className="block text-sm font-medium text-gray-700 mb-1">
              Mã Bí Mật
            </label>
            <input
              type="text"
              id="secretCode"
              name="secretCode"
              value={formData.secretCode}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-full">
            Đăng Nhập
          </button>
        </form>
      </div>
    </LoadingOverlay>
  );
}

export default Login;
