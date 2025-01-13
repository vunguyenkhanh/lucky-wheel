import { useState } from 'react';
import { useAdminStore } from '../../../store/adminStore';

function SecretCodeForm({ onClose }) {
  const { generateSecretCodes } = useAdminStore();
  const [formData, setFormData] = useState({
    quantity: 1,
    maxUsage: 1,
    expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const value = e.target.type === 'number' ? parseInt(e.target.value) : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await generateSecretCodes(formData);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Có lỗi xảy ra');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6">Tạo mã bí mật mới</h2>

        {error && <div className="bg-red-50 text-red-500 p-4 rounded-md mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
              Số lượng mã cần tạo
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
              max="100"
              className="input"
              required
            />
          </div>

          <div>
            <label htmlFor="maxUsage" className="block text-sm font-medium text-gray-700 mb-1">
              Số lần sử dụng tối đa
            </label>
            <input
              type="number"
              id="maxUsage"
              name="maxUsage"
              value={formData.maxUsage}
              onChange={handleChange}
              min="1"
              className="input"
              required
            />
          </div>

          <div>
            <label
              htmlFor="expirationDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Thời gian hết hạn
            </label>
            <input
              type="date"
              id="expirationDate"
              name="expirationDate"
              value={formData.expirationDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className="input"
              required
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Hủy
            </button>
            <button type="submit" className="btn btn-primary">
              Tạo mã
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SecretCodeForm;
