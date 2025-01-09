import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormField from '../../components/common/FormField';
import LoadingOverlay from '../../components/common/LoadingOverlay';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../hooks/useAuth';
import { useAuthStore } from '../../store/authStore';
import { validateAdminLoginForm } from '../../utils/validation';

function AdminLogin() {
  const navigate = useNavigate();
  const { loading } = useAuth(false, true);
  const { showToast } = useToast();
  const adminLogin = useAuthStore((state) => state.adminLogin);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const validationErrors = validateAdminLoginForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await adminLogin(formData);
      showToast('Đăng nhập thành công', 'success');
      navigate('/admin/dashboard');
    } catch (error) {
      showToast(error.response?.data?.error || 'Đăng nhập thất bại', 'error');
    }
  };

  return (
    <LoadingOverlay loading={loading}>
      <div className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Admin Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Tên đăng nhập"
            error={errors.username}
            required
            helpText="Tối thiểu 3 ký tự"
          >
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`input ${errors.username ? 'border-red-500' : ''}`}
              placeholder="Nhập tên đăng nhập"
              autoComplete="username"
            />
          </FormField>

          <FormField label="Mật khẩu" error={errors.password} required helpText="Tối thiểu 6 ký tự">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`input ${errors.password ? 'border-red-500' : ''}`}
              placeholder="Nhập mật khẩu"
              autoComplete="current-password"
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

export default AdminLogin;
