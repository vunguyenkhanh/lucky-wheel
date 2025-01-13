import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAdminStore } from '../../store/adminStore';

const PrizeForm = ({ prize, onClose }) => {
  const { createPrize, updatePrize } = useAdminStore();
  const [formData, setFormData] = useState({
    name: '',
    imageUrl: '',
    quantity: 0,
    winRate: 0,
  });

  useEffect(() => {
    if (prize) {
      setFormData({
        name: prize.name,
        imageUrl: prize.imageUrl,
        quantity: prize.quantity,
        winRate: prize.winRate,
      });
    }
  }, [prize]);

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Vui lòng nhập tên giải thưởng';
    }

    if (!formData.imageUrl.trim()) {
      errors.imageUrl = 'Vui lòng nhập URL hình ảnh';
    } else if (!isValidUrl(formData.imageUrl)) {
      errors.imageUrl = 'URL hình ảnh không hợp lệ';
    }

    if (formData.quantity < 0) {
      errors.quantity = 'Số lượng không được âm';
    }

    if (formData.winRate < 0 || formData.winRate > 1) {
      errors.winRate = 'Tỷ lệ trúng phải từ 0% đến 100%';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach((error) => toast.error(error));
      return;
    }

    try {
      if (prize) {
        await updatePrize(prize.id, formData);
        toast.success('Cập nhật giải thưởng thành công');
      } else {
        await createPrize(formData);
        toast.success('Thêm giải thưởng thành công');
      }
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Có lỗi xảy ra');
    }
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Tên giải thưởng</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">URL hình ảnh</label>
        <input
          type="url"
          value={formData.imageUrl}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Số lượng</label>
        <input
          type="number"
          min="0"
          value={formData.quantity}
          onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Tỷ lệ trúng (%)</label>
        <input
          type="number"
          min="0"
          max="100"
          step="0.1"
          value={formData.winRate * 100}
          onChange={(e) => setFormData({ ...formData, winRate: parseFloat(e.target.value) / 100 })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Hủy
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
        >
          {prize ? 'Cập nhật' : 'Thêm mới'}
        </button>
      </div>
    </form>
  );
};

export default PrizeForm;
