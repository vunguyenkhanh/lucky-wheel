import { useState } from 'react';
import FormField from '../components/common/FormField';
import LoadingOverlay from '../components/common/LoadingOverlay';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../hooks/useAuth';
import { useAuthStore } from '../store/authStore';
import { validateRegisterForm } from '../utils/validation';

function Register() {
  const { loading } = useAuth(false);
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    address: '',
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
    setErrors({}); // Clear all errors when submitting

    // Validate form
    const validationErrors = validateRegisterForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await useAuthStore.getState().register(formData);
      showToast('Đăng ký thành công', 'success');
    } catch (err) {
      const errorInfo = handleError(err);
      setErrors({ submit: errorInfo.error });
      showToast(errorInfo.error, 'error');
    }
  };

  return (
    <LoadingOverlay loading={loading}>
      <div className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Đăng Ký Tài Khoản</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.submit && (
            <div className="bg-red-50 text-red-500 p-4 rounded-md">{errors.submit}</div>
          )}

          <FormField
            label="Họ và tên"
            error={errors.fullName}
            required
            helpText="Tối thiểu 2 ký tự"
          >
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={`input ${errors.fullName ? 'border-red-500' : ''}`}
              placeholder="Nhập họ và tên"
              autoComplete="name"
            />
          </FormField>

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
              autoComplete="tel"
            />
          </FormField>

          <FormField label="Địa chỉ" error={errors.address} required>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={`input min-h-[80px] ${errors.address ? 'border-red-500' : ''}`}
              placeholder="Nhập địa chỉ"
              autoComplete="street-address"
            />
          </FormField>

          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Đăng ký'}
          </button>
        </form>
      </div>
    </LoadingOverlay>
  );
}

export default Register;
