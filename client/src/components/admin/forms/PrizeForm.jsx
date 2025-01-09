import { useState } from 'react';
import { useAdminStore } from '../../../store/adminStore';

function PrizeForm({ prize, onClose }) {
  const { createPrize, updatePrize } = useAdminStore();
  const [formData, setFormData] = useState({
    name: prize?.name || '',
    imageUrl: prize?.imageUrl || '',
    quantity: prize?.quantity || 0,
    winRate: prize?.winRate || 0,
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (prize) {
        await updatePrize(prize.id, formData);
      } else {
        await createPrize(formData);
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Có lỗi xảy ra');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6">
          {prize ? 'Cập nhật giải thưởng' : 'Thêm giải thưởng mới'}
        </h2>

        {error && <div className="bg-red-50 text-red-500 p-4 rounded-md mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Tên giải thưởng
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
              URL hình ảnh
            </label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
              Số lượng
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="0"
              className="input"
              required
            />
          </div>

          <div>
            <label htmlFor="winRate" className="block text-sm font-medium text-gray-700 mb-1">
              Tỷ lệ trúng (0-1)
            </label>
            <input
              type="number"
              id="winRate"
              name="winRate"
              value={formData.winRate}
              onChange={handleChange}
              min="0"
              max="1"
              step="0.01"
              className="input"
              required
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Hủy
            </button>
            <button type="submit" className="btn btn-primary">
              {prize ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PrizeForm;
