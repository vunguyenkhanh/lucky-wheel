import { PlusIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { useAdminStore } from '../../store/adminStore';
import SecretCodeForm from './forms/SecretCodeForm';

function SecretCodeManagement() {
  const { secretCodes, fetchSecretCodes, deactivateSecretCode } = useAdminStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchSecretCodes({ page: currentPage });
  }, [fetchSecretCodes, currentPage]);

  const handleDeactivate = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn vô hiệu hóa mã này?')) {
      try {
        await deactivateSecretCode(id);
      } catch (error) {
        console.error('Error deactivating code:', error);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Chưa dùng':
        return 'bg-green-100 text-green-800';
      case 'Đã dùng':
        return 'bg-yellow-100 text-yellow-800';
      case 'Hết hạn':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Quản Lý Mã Bí Mật</h2>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary flex items-center">
          <PlusIcon className="h-5 w-5 mr-2" />
          Tạo Mã Mới
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Mã
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Thời gian hết hạn
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Đã sử dụng
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {secretCodes.map((code) => (
              <tr key={code.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {code.code}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                      code.status,
                    )}`}
                  >
                    {code.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(code.expirationDate).toLocaleDateString('vi-VN')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {code._count?.spinResults || 0} / {code.maxUsage}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {code.status === 'Chưa dùng' && (
                    <button
                      onClick={() => handleDeactivate(code.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Vô hiệu hóa
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && <SecretCodeForm onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}

export default SecretCodeManagement;
