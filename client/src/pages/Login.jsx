import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormField from '../components/common/FormField';
import LoadingOverlay from '../components/common/LoadingOverlay';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../hooks/useAuth';
import { useAuthStore } from '../store/authStore';
import { validateLoginForm } from '../utils/validation';

function Login() {
  const navigate = useNavigate();
  const { loading } = useAuth(false);
  const { showToast } = useToast();
  const login = useAuthStore((state) => state.login);

  const [formData, setFormData] = useState({
    phoneNumber: '',
    secretCode: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validate form
    const validationErrors = validateLoginForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await login(formData);
      showToast('Đăng nhập thành công', 'success');
      navigate('/wheel');
    } catch (error) {
      showToast(error.response?.data?.error || 'Đăng nhập thất bại', 'error');
    }
  };

  return (
    <LoadingOverlay loading={loading}>
      <div className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Đăng Nhập</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Số điện thoại"
            error={errors.phoneNumber}
            required
            helpText="Ví dụ: 0912345678"
          >
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={`input ${errors.phoneNumber ? 'border-red-500' : ''}`}
              placeholder="Nhập số điện thoại"
            />
          </FormField>

          <FormField
            label="Mã bí mật"
            error={errors.secretCode}
            required
            helpText="Mã có dạng SHxxxx (x là số, ví dụ: SH1234)"
          >
            <input
              type="text"
              name="secretCode"
              value={formData.secretCode}
              onChange={handleChange}
              className={`input ${errors.secretCode ? 'border-red-500' : ''}`}
              placeholder="Nhập mã bí mật"
              maxLength={6}
            />
          </FormField>

          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
          </button>
        </form>
      </div>
    </LoadingOverlay>
  );
}

export default Login;
