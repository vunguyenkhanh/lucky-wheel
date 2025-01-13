import { useEffect, useState } from 'react';
import { useToast } from '../../../contexts/ToastContext';
import { useAdminStore } from '../../../store/adminStore';
import { validateAdminForm } from '../../../utils/validation';

function AdminForm({ admin, onClose }) {
  const { showToast } = useToast();
  const { createAdmin, updateAdmin } = useAdminStore();

  const [formData, setFormData] = useState({
    username: admin?.username || '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Validate realtime khi formData thay đổi
  useEffect(() => {
    const validationErrors = validateAdminForm(formData);
    setErrors(validationErrors);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra nếu còn lỗi
    if (Object.keys(errors).length > 0) {
      showToast('Vui lòng kiểm tra lại thông tin', 'error');
      return;
    }

    setLoading(true);
    try {
      if (admin) {
        await updateAdmin(admin.id, formData, showToast);
      } else {
        await createAdmin(formData, showToast);
      }
      onClose();
    } catch (error) {
      console.error('Submit admin error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Kiểm tra nút submit có disable không
  const isSubmitDisabled = loading || Object.keys(errors).length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Username</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
            errors.username ? 'border-red-500' : ''
          }`}
        />
        {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
            errors.password ? 'border-red-500' : ''
          }`}
        />
        {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Xác nhận mật khẩu</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
            errors.confirmPassword ? 'border-red-500' : ''
          }`}
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
        )}
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={isSubmitDisabled}
          className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
            ${
              isSubmitDisabled
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
        >
          {loading ? 'Đang xử lý...' : admin ? 'Cập nhật' : 'Tạo mới'}
        </button>
      </div>
    </form>
  );
}

export default AdminForm;
