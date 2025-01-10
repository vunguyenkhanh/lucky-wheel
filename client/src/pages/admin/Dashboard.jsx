import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { usePrizeStore } from '../../store/prizeStore';

function AdminDashboard() {
  const { prizes, loading, error, fetchPrizes } = usePrizeStore();
  const [stats, setStats] = useState({
    totalSpins: 0,
    todaySpins: 0,
    totalCustomers: 0,
    activePrizes: 0,
  });

  useEffect(() => {
    fetchPrizes();
    // Fetch thêm thống kê từ API
  }, [fetchPrizes]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  const statCards = [
    {
      label: 'Giải thưởng đang phát',
      value: prizes?.filter((p) => p.quantity > 0).length || 0,
      icon: '🎁',
      description: 'Số giải thưởng còn số lượng',
    },
    {
      label: 'Lượt quay hôm nay',
      value: stats.todaySpins,
      icon: '🎯',
      description: 'Tổng số lượt quay trong ngày',
    },
    {
      label: 'Tổng người chơi',
      value: stats.totalCustomers,
      icon: '👥',
      description: 'Số người đã đăng ký tham gia',
    },
    {
      label: 'Tổng lượt quay',
      value: stats.totalSpins,
      icon: '📊',
      description: 'Tổng số lượt quay từ trước đến nay',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tổng Quan Hệ Thống</h2>
          <p className="mt-1 text-sm text-gray-500">Thống kê và báo cáo hoạt động</p>
        </div>
        <div className="space-x-4">
          <Link
            to="/admin/prizes"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Quản lý giải thưởng
          </Link>
          <Link
            to="/admin/prizes/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Thêm giải thưởng
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">{stat.icon}</div>
              <span className="text-3xl font-semibold text-gray-900">{stat.value}</span>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">{stat.label}</h3>
              <p className="mt-1 text-xs text-gray-400">{stat.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Prizes */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Giải Thưởng Đang Phát</h3>
          </div>
          <div className="p-6">
            {prizes
              ?.filter((p) => p.quantity > 0)
              .slice(0, 5)
              .map((prize) => (
                <div
                  key={prize.id}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                      {prize.imageUrl ? (
                        <img
                          src={prize.imageUrl}
                          alt={prize.name}
                          className="w-10 h-10 object-contain"
                        />
                      ) : (
                        <span className="text-2xl">🎁</span>
                      )}
                    </div>
                    <div className="ml-4">
                      <p className="font-medium text-gray-900">{prize.name}</p>
                      <p className="text-sm text-gray-500">
                        Còn {prize.quantity}/{prize.initialQuantity} - Tỷ lệ trúng:{' '}
                        {(prize.winRate * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  <Link
                    to={`/admin/prizes/${prize.id}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Chi tiết
                  </Link>
                </div>
              ))}
          </div>
        </div>

        {/* Recent Spins */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Lịch Sử Quay Thưởng</h3>
          </div>
          <div className="p-6">
            {/* Thêm danh sách lịch sử quay gần đây */}
            <div className="text-center text-gray-500 py-8">Chức năng đang được phát triển...</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
