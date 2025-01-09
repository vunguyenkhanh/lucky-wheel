import { useEffect } from 'react';
import PrizeForm from '../../components/admin/forms/PrizeForm';
import PrizeList from '../../components/admin/lists/PrizeList';
import LoadingOverlay from '../../components/common/LoadingOverlay';
import { useToast } from '../../contexts/ToastContext';
import { usePrizeStore } from '../../store/prizeStore';

function PrizeManagement() {
  const { showToast } = useToast();
  const {
    prizes,
    loading,
    error,
    fetchPrizes,
    createPrize,
    updatePrize,
    deletePrize,
    uploadImage,
  } = usePrizeStore();

  useEffect(() => {
    fetchPrizes();
  }, [fetchPrizes]);

  const handleCreate = async (data) => {
    try {
      await createPrize(data);
      showToast('Tạo giải thưởng thành công', 'success');
    } catch (error) {
      showToast(error.response?.data?.error || 'Lỗi tạo giải thưởng', 'error');
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      await updatePrize(id, data);
      showToast('Cập nhật giải thưởng thành công', 'success');
    } catch (error) {
      showToast(error.response?.data?.error || 'Lỗi cập nhật giải thưởng', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePrize(id);
      showToast('Xóa giải thưởng thành công', 'success');
    } catch (error) {
      showToast(error.response?.data?.error || 'Lỗi xóa giải thưởng', 'error');
    }
  };

  const handleImageUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      const imageUrl = await uploadImage(formData);
      return imageUrl;
    } catch (error) {
      showToast(error.response?.data?.error || 'Lỗi upload hình ảnh', 'error');
      throw error;
    }
  };

  return (
    <LoadingOverlay loading={loading}>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Quản lý giải thưởng</h1>

        {error && <div className="bg-red-50 text-red-500 p-4 rounded mb-4">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PrizeForm onSubmit={handleCreate} onImageUpload={handleImageUpload} />
          <PrizeList
            prizes={prizes}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onImageUpload={handleImageUpload}
          />
        </div>
      </div>
    </LoadingOverlay>
  );
}
