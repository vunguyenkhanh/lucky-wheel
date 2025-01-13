import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormField from '../components/common/FormField';
import LoadingButton from '../components/common/LoadingButton';
import { useToast } from '../contexts/ToastContext';
import { useAuthStore } from '../store/authStore';

function Login() {
  const navigate = useNavigate();
  const { loading, customerLogin } = useAuthStore();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    phoneNumber: '',
    secretCode: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({
    phoneNumber: false,
    secretCode: false,
  });

  const validateForm = (data) => {
    const errors = {};

    if (!data.phoneNumber.trim()) {
      errors.phoneNumber = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{10}$/.test(data.phoneNumber)) {
      errors.phoneNumber = 'Số điện thoại không hợp lệ';
    }

    if (!data.secretCode.trim()) {
      errors.secretCode = 'Vui lòng nhập mã bí mật';
    } else if (!/^SH\d{4}$/.test(data.secretCode)) {
      errors.secretCode = 'Mã bí mật không đúng định dạng (SHxxxx)';
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
      phoneNumber: true,
      secretCode: true,
    });

    if (Object.keys(validationErrors).length > 0) {
      showToast('Vui lòng kiểm tra lại thông tin', 'error');
      return;
    }

    try {
      await customerLogin(formData, showToast);
      navigate('/wheel');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const isSubmitDisabled =
    loading ||
    (touched.phoneNumber && errors.phoneNumber) ||
    (touched.secretCode && errors.secretCode);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">Đăng nhập</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                placeholder="Nhập số điện thoại đã đăng ký"
                autoComplete="tel"
              />
            </FormField>

            <FormField
              label="Mã bí mật"
              error={touched.secretCode ? errors.secretCode : ''}
              required
            >
              <input
                type="text"
                name="secretCode"
                value={formData.secretCode}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`input ${
                  touched.secretCode && errors.secretCode ? 'border-red-500' : ''
                }`}
                placeholder="Nhập mã bí mật (SHxxxx)"
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

          <div className="mt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Chưa có tài khoản?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Đăng ký tài khoản mới
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
