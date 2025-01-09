import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { useAdminStore } from '../../store/adminStore';
import { formatPercent } from '../../utils/format';
import PrizeForm from './forms/PrizeForm';

function PrizeManagement() {
  const { prizes, fetchPrizes, deletePrize } = useAdminStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPrize, setSelectedPrize] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPrizes();
  }, [fetchPrizes]);

  const handleEdit = (prize) => {
    setSelectedPrize(prize);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa giải thưởng này?')) {
      try {
        await deletePrize(id);
      } catch (error) {
        setError(error.response?.data?.error || 'Lỗi xóa giải thưởng');
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPrize(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Quản Lý Giải Thưởng</h2>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary flex items-center">
          <PlusIcon className="h-5 w-5 mr-2" />
          Thêm Giải Thưởng
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Tên giải thưởng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Số lượng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Tỷ lệ trúng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Đã phát
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {prizes.map((prize) => (
              <tr key={prize.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      src={`/assets/images/prizes/${prize.imageUrl}`}
                      alt={prize.name}
                      className="h-10 w-10 rounded-full object-contain"
                    />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{prize.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {prize.quantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatPercent(prize.winRate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {prize._count?.spinResults || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(prize)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(prize.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && <PrizeForm prize={selectedPrize} onClose={handleCloseModal} />}
    </div>
  );
}

export default PrizeManagement;
