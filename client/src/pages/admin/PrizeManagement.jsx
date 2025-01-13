import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import PrizeForm from '../../components/admin/PrizeForm';
import Modal from '../../components/common/Modal';
import { useAdminStore } from '../../store/adminStore';

const PrizeManagement = () => {
  const { prizes, loading, loadPrizes, deletePrize } = useAdminStore();
  const [showModal, setShowModal] = useState(false);
  const [selectedPrize, setSelectedPrize] = useState(null);

  useEffect(() => {
    loadPrizes();
  }, [loadPrizes]);

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa giải thưởng này?')) {
      try {
        await deletePrize(id);
        toast.success('Xóa giải thưởng thành công');
      } catch (error) {
        toast.error(error.response?.data?.error || 'Có lỗi xảy ra khi xóa');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý giải thưởng</h1>
          <p className="mt-1 text-sm text-gray-500">
            Quản lý danh sách giải thưởng và tỷ lệ trúng thưởng
          </p>
        </div>
        <button
          onClick={() => {
            setShowModal(true);
            setSelectedPrize(null);
          }}
          className="btn btn-primary flex items-center gap-2"
          disabled={loading}
        >
          <FaPlus /> Thêm giải thưởng
        </button>
      </div>

      {/* Thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-green-800">Tổng giải thưởng</h3>
          <p className="text-2xl font-semibold text-green-900">{prizes.length}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800">Tổng số lượng</h3>
          <p className="text-2xl font-semibold text-blue-900">
            {prizes.reduce((sum, prize) => sum + prize.quantity, 0)}
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-yellow-800">Đã trúng thưởng</h3>
          <p className="text-2xl font-semibold text-yellow-900">
            {prizes.reduce((sum, prize) => sum + (prize.spinCount || 0), 0)}
          </p>
        </div>
      </div>

      {/* Danh sách giải thưởng */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  STT
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên giải thưởng
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hình ảnh
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số lượng
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tỷ lệ trúng
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Đã trúng
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {prizes.map((prize, index) => (
                <tr key={prize.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                    {prize.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex justify-center">
                      <img
                        src={prize.imageUrl}
                        alt={prize.name}
                        className="h-10 w-10 object-cover rounded"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    {prize.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    {(prize.winRate * 100).toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    {prize.spinCount || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => {
                          setShowModal(true);
                          setSelectedPrize(prize);
                        }}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(prize.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedPrize(null);
        }}
        title={selectedPrize ? 'Sửa giải thưởng' : 'Thêm giải thưởng'}
      >
        <PrizeForm
          prize={selectedPrize}
          onClose={() => {
            setShowModal(false);
            setSelectedPrize(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default PrizeManagement;
