import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormField from '../../components/common/FormField';
import LoadingButton from '../../components/common/LoadingButton';
import { useToast } from '../../contexts/ToastContext';
import { useAuthStore } from '../../store/authStore';
import { validateAdminLoginForm } from '../../utils/validation';

function AdminLogin() {
  const navigate = useNavigate();
  const { loading, adminLogin } = useAuthStore();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({
    username: false,
    password: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validate khi field đã được chạm vào
    if (touched[name]) {
      const validationErrors = validateAdminLoginForm({
        ...formData,
        [name]: value,
      });
      setErrors((prev) => ({
        ...prev,
        [name]: validationErrors[name],
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    // Validate khi blur
    const validationErrors = validateAdminLoginForm(formData);
    setErrors((prev) => ({
      ...prev,
      [name]: validationErrors[name],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate tất cả fields khi submit
    const validationErrors = validateAdminLoginForm(formData);
    setErrors(validationErrors);

    // Set tất cả fields là đã chạm vào
    setTouched({
      username: true,
      password: true,
    });

    if (Object.keys(validationErrors).length > 0) {
      showToast('Vui lòng nhập đầy đủ thông tin', 'error');
      return;
    }

    try {
      await adminLogin(formData, showToast);
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  // Chỉ disable submit khi đã chạm vào field và có lỗi
  const isSubmitDisabled =
    loading || (touched.username && errors.username) || (touched.password && errors.password);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">Đăng nhập Admin</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField
              label="Tên đăng nhập"
              error={touched.username ? errors.username : ''}
              required
            >
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`input ${touched.username && errors.username ? 'border-red-500' : ''}`}
                placeholder="Nhập tên đăng nhập"
                autoComplete="username"
              />
            </FormField>

            <FormField label="Mật khẩu" error={touched.password ? errors.password : ''} required>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`input ${touched.password && errors.password ? 'border-red-500' : ''}`}
                placeholder="Nhập mật khẩu"
                autoComplete="current-password"
              />
            </FormField>

            <LoadingButton
              type="submit"
              loading={loading}
              disabled={isSubmitDisabled}
              className={`btn w-full ${
                isSubmitDisabled ? 'bg-gray-400 cursor-not-allowed' : 'btn-primary'
              }`}
            >
              Đăng nhập
            </LoadingButton>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
