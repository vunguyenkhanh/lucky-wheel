import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormField from '../components/common/FormField';
import LoadingButton from '../components/common/LoadingButton';
import { useToast } from '../contexts/ToastContext';
import { useAuthStore } from '../store/authStore';

function Register() {
  const navigate = useNavigate();
  const { loading } = useAuthStore();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    address: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({
    name: false,
    phoneNumber: false,
    address: false,
  });

  const validateForm = (data) => {
    const errors = {};

    // Validate họ tên
    if (!data.name.trim()) {
      errors.name = 'Vui lòng nhập họ và tên';
    } else if (data.name.trim().length < 2) {
      errors.name = 'Họ và tên phải có ít nhất 2 ký tự';
    } else if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(data.name)) {
      errors.name = 'Họ và tên chỉ được chứa chữ cái và khoảng trắng';
    }

    // Validate số điện thoại
    if (!data.phoneNumber.trim()) {
      errors.phoneNumber = 'Vui lòng nhập số điện thoại';
    } else if (!/^(0[3|5|7|8|9])+([0-9]{8})\b/.test(data.phoneNumber)) {
      errors.phoneNumber = 'Số điện thoại không hợp lệ (VD: 0912345678)';
    }

    // Validate địa chỉ
    if (!data.address.trim()) {
      errors.address = 'Vui lòng nhập địa chỉ';
    } else if (data.address.trim().length < 10) {
      errors.address = 'Địa chỉ phải có ít nhất 10 ký tự';
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (touched[name]) {
      const validationErrors = validateForm({
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

    const validationErrors = validateForm(formData);
    setErrors((prev) => ({
      ...prev,
      [name]: validationErrors[name],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    setTouched({
      name: true,
      phoneNumber: true,
      address: true,
    });

    if (Object.keys(validationErrors).length > 0) {
      showToast('Vui lòng kiểm tra lại thông tin', 'error');
      return;
    }

    try {
      await authService.customerRegister(formData);
      showToast(
        'Đăng ký thành công! Vui lòng liên hệ Admin để nhận mã bí mật và đăng nhập.',
        'success',
      );
      navigate('/login');
    } catch (error) {
      if (error.response?.status === 400) {
        showToast(error.response.data.error, 'error');
      } else {
        showToast('Có lỗi xảy ra khi đăng ký. Vui lòng thử lại sau.', 'error');
      }
    }
  };

  const isSubmitDisabled =
    loading ||
    (touched.name && errors.name) ||
    (touched.phoneNumber && errors.phoneNumber) ||
    (touched.address && errors.address);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">Đăng ký tài khoản</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Vui lòng điền đầy đủ thông tin để đăng ký tài khoản
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField label="Họ và tên" error={touched.name ? errors.name : ''} required>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`input ${touched.name && errors.name ? 'border-red-500' : ''}`}
                placeholder="Nhập họ và tên"
                autoComplete="name"
              />
            </FormField>

            <FormField
              label="Số điện thoại"
              error={touched.phoneNumber ? errors.phoneNumber : ''}
              required
            >
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`input ${
                  touched.phoneNumber && errors.phoneNumber ? 'border-red-500' : ''
                }`}
                placeholder="Nhập số điện thoại (VD: 0912345678)"
                autoComplete="tel"
              />
            </FormField>

            <FormField label="Địa chỉ" error={touched.address ? errors.address : ''} required>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                onBlur={handleBlur}
                rows={3}
                className={`input resize-none ${
                  touched.address && errors.address ? 'border-red-500' : ''
                }`}
                placeholder="Nhập địa chỉ đầy đủ"
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
              Đăng ký
            </LoadingButton>
          </form>

          <div className="mt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Đã có tài khoản?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Đăng nhập ngay
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
