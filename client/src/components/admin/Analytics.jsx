import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { useEffect, useState } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import { useAdminStore } from '../../store/adminStore';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

function Analytics() {
  const { analytics, fetchAnalytics } = useAdminStore();
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchAnalytics(dateRange);
  }, [fetchAnalytics, dateRange]);

  const handleDateChange = (e) => {
    setDateRange({
      ...dateRange,
      [e.target.name]: e.target.value,
    });
  };

  const lineChartData = {
    labels:
      analytics?.dailyStats?.map((stat) => new Date(stat.spinTime).toLocaleDateString('vi-VN')) ||
      [],
    datasets: [
      {
        label: 'Số lượt quay',
        data: analytics?.dailyStats?.map((stat) => stat._count) || [],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const pieChartData = {
    labels: analytics?.prizeStats?.map((stat) => stat.prize.name) || [],
    datasets: [
      {
        data: analytics?.prizeStats?.map((stat) => stat._count) || [],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
      },
    ],
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Thống Kê</h2>
        <div className="flex gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Từ ngày</label>
            <input
              type="date"
              name="startDate"
              value={dateRange.startDate}
              onChange={handleDateChange}
              className="input mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Đến ngày</label>
            <input
              type="date"
              name="endDate"
              value={dateRange.endDate}
              onChange={handleDateChange}
              className="input mt-1"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Lượt quay theo ngày</h3>
          <Line data={lineChartData} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Tỷ lệ trúng giải</h3>
          <Pie data={pieChartData} />
        </div>
      </div>
    </div>
  );
}

export default Analytics;
