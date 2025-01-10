import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormField from '../../components/common/FormField';
import LoadingButton from '../../components/common/LoadingButton';
import { useToast } from '../../contexts/ToastContext';
import { useAuthStore } from '../../store/authStore';

function AdminLogin() {
  const navigate = useNavigate();
  const { loading, adminLogin } = useAuthStore();
  const { showToast } = useToast();

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
    try {
      await adminLogin(formData);
      navigate('/admin/dashboard');
    } catch (error) {
      let message = error.response?.data?.error || error.message || 'Đăng nhập thất bại';
      showToast(message, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">Đăng nhập Admin</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField label="Tên đăng nhập" error={errors.username} required>
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

            <FormField label="Mật khẩu" error={errors.password} required>
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

            <LoadingButton type="submit" loading={loading} className="btn-primary w-full">
              Đăng nhập
            </LoadingButton>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
