import { useState } from 'react';
import { validatePrize } from '../../../utils/validation';
import FormField from '../../common/FormField';

function PrizeForm({ onSubmit, onImageUpload, initialData }) {
  const [formData, setFormData] = useState(
    initialData || {
      name: '',
      imageUrl: '',
      quantity: 0,
      winRate: 0,
    },
  );
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) || 0 : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const imageUrl = await onImageUpload(file);
      setFormData((prev) => ({ ...prev, imageUrl }));
    } catch (error) {
      setErrors((prev) => ({ ...prev, imageUrl: error.message }));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const { isValid, errors: validationErrors } = validatePrize(formData);
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    await onSubmit(formData);
    if (!initialData) {
      setFormData({
        name: '',
        imageUrl: '',
        quantity: 0,
        winRate: 0,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField label="Tên giải thưởng" error={errors.name} required>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`input ${errors.name ? 'border-red-500' : ''}`}
        />
      </FormField>

      <FormField label="Hình ảnh" error={errors.imageUrl} required>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className={`input ${errors.imageUrl ? 'border-red-500' : ''}`}
          disabled={uploading}
        />
        {formData.imageUrl && (
          <img
            src={formData.imageUrl}
            alt="Preview"
            className="mt-2 w-32 h-32 object-cover rounded"
          />
        )}
      </FormField>

      <FormField label="Số lượng" error={errors.quantity} required>
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          min="0"
          className={`input ${errors.quantity ? 'border-red-500' : ''}`}
        />
      </FormField>

      <FormField
        label="Tỷ lệ trúng"
        error={errors.winRate}
        required
        helpText="Từ 0 đến 1 (VD: 0.1 = 10%)"
      >
        <input
          type="number"
          name="winRate"
          value={formData.winRate}
          onChange={handleChange}
          step="0.01"
          min="0"
          max="1"
          className={`input ${errors.winRate ? 'border-red-500' : ''}`}
        />
      </FormField>

      <button type="submit" className="btn btn-primary w-full" disabled={uploading}>
        {uploading ? 'Đang tải lên...' : initialData ? 'Cập nhật' : 'Thêm mới'}
      </button>
    </form>
  );
}

export default PrizeForm;
