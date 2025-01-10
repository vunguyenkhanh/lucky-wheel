import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { usePrizeStore } from '../../store/prizeStore';

function PrizeManagement() {
  const { prizes, loading, error, fetchPrizes, deletePrize } = usePrizeStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPrizes();
  }, [fetchPrizes]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  const filteredPrizes = prizes?.filter((prize) =>
    prize.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản Lý Giải Thưởng</h2>
          <p className="mt-1 text-sm text-gray-500">
            Thêm, sửa, xóa các giải thưởng trong hệ thống
          </p>
        </div>
        <Link
          to="/admin/prizes/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Thêm Giải Thưởng
        </Link>
      </div>

      {/* Search */}
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
        <input
          type="text"
          placeholder="Tìm kiếm giải thưởng..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Prize List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên giải thưởng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số lượng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tỷ lệ trúng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPrizes?.map((prize) => (
              <tr key={prize.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">🎁</span>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{prize.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{prize.quantity}</div>
                  <div className="text-sm text-gray-500">/ {prize.initialQuantity}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{(prize.winRate * 100).toFixed(1)}%</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      prize.quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {prize.quantity > 0 ? 'Còn quà' : 'Hết quà'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    to={`/admin/prizes/${prize.id}/edit`}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Sửa
                  </Link>
                  <button
                    onClick={() => deletePrize(prize.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PrizeManagement;
