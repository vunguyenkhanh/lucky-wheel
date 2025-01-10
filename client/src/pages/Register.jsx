import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormField from '../components/common/FormField';
import LoadingButton from '../components/common/LoadingButton';
import { useToast } from '../contexts/ToastContext';
import { useAuthStore } from '../store/authStore';

function Register() {
  const navigate = useNavigate();
  const { loading, register } = useAuthStore();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    secretCode: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      showToast('Đăng ký thành công', 'success');
      navigate('/login');
    } catch (error) {
      showToast(error.response?.data?.error || 'Đăng ký thất bại', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">Đăng ký tài khoản</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Đã có tài khoản?{' '}
          <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Đăng nhập ngay
          </a>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField label="Họ và tên" error={errors.name} required>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`input ${errors.name ? 'border-red-500' : ''}`}
                placeholder="Nhập họ và tên"
              />
            </FormField>

            <FormField label="Số điện thoại" error={errors.phoneNumber} required>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={`input ${errors.phoneNumber ? 'border-red-500' : ''}`}
                placeholder="Nhập số điện thoại"
              />
            </FormField>

            <FormField label="Mã bí mật" error={errors.secretCode} required>
              <input
                type="text"
                name="secretCode"
                value={formData.secretCode}
                onChange={handleChange}
                className={`input ${errors.secretCode ? 'border-red-500' : ''}`}
                placeholder="Nhập mã bí mật"
              />
            </FormField>

            <LoadingButton type="submit" loading={loading} className="btn-primary w-full">
              Đăng ký
            </LoadingButton>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
