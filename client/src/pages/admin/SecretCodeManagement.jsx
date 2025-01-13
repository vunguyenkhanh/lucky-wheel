import { useEffect, useState } from 'react';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { secretCodeApi } from '../../api/secretCodeApi';
import CountdownTimer from '../../components/common/CountdownTimer';
import LoadingButton from '../../components/common/LoadingButton';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useToast } from '../../contexts/ToastContext';

// Hàm format thời gian theo định dạng DD/MM/YYYY HH:mm:ss
const formatDateTime = (date) => {
  return {
    date: date.toLocaleDateString('en-CA'), // format YYYY-MM-DD cho input date
    time: date.toTimeString().slice(0, 8), // format HH:mm:ss cho input time
    display: date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }),
  };
};

// Thêm hàm tính thời gian tương lai
const getTimeAfterMinutes = (minutes) => {
  const date = new Date();
  date.setMinutes(date.getMinutes() + minutes);
  return formatDateTime(date);
};

// Thêm hàm tính thời gian tương lai từ một thời điểm cụ thể
const addMinutesToDate = (date, minutes) => {
  const newDate = new Date(date);
  newDate.setMinutes(newDate.getMinutes() + minutes);
  return formatDateTime(newDate);
};

function SecretCodeManagement() {
  const { showToast } = useToast();
  const [secretCodes, setSecretCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedCode, setSelectedCode] = useState(null);

  // Khởi tạo giá trị mặc định với thời gian hiện tại
  const getDefaultFormData = () => {
    const now = new Date();
    const formatted = formatDateTime(now);
    return {
      expirationDate: formatted.date,
      expirationTime: formatted.time,
      displayDateTime: formatted.display,
    };
  };

  const [formData, setFormData] = useState(getDefaultFormData());

  // Fetch danh sách mã
  const fetchSecretCodes = async () => {
    try {
      setLoading(true);
      const data = await secretCodeApi.getSecretCodes();
      setSecretCodes(data);
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSecretCodes();
  }, []);

  // Xử lý tạo mã mới
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Kết hợp ngày và giờ
      const expirationDateTime = new Date(`${formData.expirationDate}T${formData.expirationTime}`);

      await secretCodeApi.createSecretCode({
        expirationDate: expirationDateTime.toISOString(),
      });

      showToast('Tạo mã bí mật thành công', 'success');
      setShowModal(false);
      fetchSecretCodes();
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Xử lý cập nhật mã
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Kiểm tra và format thời gian
      const expirationDateTime = new Date(`${formData.expirationDate}T${formData.expirationTime}`);

      // Kiểm tra thời gian hợp lệ
      if (isNaN(expirationDateTime.getTime())) {
        throw new Error('Thời gian không hợp lệ');
      }

      // Gửi request cập nhật
      await secretCodeApi.updateSecretCode(selectedCode.id, {
        status: formData.status,
        expirationDate: expirationDateTime.toISOString(), // Đảm bảo gửi đúng format ISO
      });

      showToast('Cập nhật mã bí mật thành công', 'success');
      setShowModal(false);
      await fetchSecretCodes(); // Đợi fetch data mới
    } catch (error) {
      console.error('Update error:', error);
      showToast(error.message || 'Có lỗi xảy ra khi cập nhật', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Xử lý xóa mã
  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa mã này?')) return;
    try {
      setLoading(true);
      await secretCodeApi.deleteSecretCode(id);
      showToast('Xóa mã bí mật thành công', 'success');
      fetchSecretCodes();
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Thêm hàm xử lý khi mã hết hạn
  const handleExpired = async (code) => {
    if (code.status !== 'Hết hạn' && code.status !== 'Đã dùng') {
      try {
        await secretCodeApi.updateSecretCode(code.id, {
          status: 'Hết hạn',
        });
        await fetchSecretCodes(); // Refresh danh sách sau khi cập nhật
      } catch (error) {
        console.error('Error updating expired code:', error);
        showToast(error.message, 'error');
      }
    }
  };

  // Cập nhật lại khi chọn mã để sửa
  const handleSelectCode = (code) => {
    const dateTime = new Date(code.expirationDate);
    const formatted = formatDateTime(dateTime);

    setSelectedCode(code);
    setFormData({
      status: code.status,
      expirationDate: formatted.date,
      expirationTime: formatted.time,
      displayDateTime: formatted.display,
      originalDateTime: dateTime, // Lưu thời gian gốc để tính toán
    });
    setShowModal(true);
  };

  // Cập nhật lại hàm xử lý chọn nhanh thời gian
  const handleQuickSelect = (minutes) => {
    // Nếu đang cập nhật, tăng thời gian từ thời gian hết hạn hiện tại
    const baseDate = selectedCode ? formData.originalDateTime : new Date();

    const newDateTime = addMinutesToDate(baseDate, minutes);
    setFormData({
      ...formData,
      expirationDate: newDateTime.date,
      expirationTime: newDateTime.time,
      displayDateTime: newDateTime.display,
      originalDateTime: new Date(`${newDateTime.date}T${newDateTime.time}`),
    });
  };

  // Cập nhật lại khi thay đổi ngày
  const handleDateChange = (e) => {
    const newDate = new Date(`${e.target.value}T${formData.expirationTime || '00:00:00'}`);
    const formatted = formatDateTime(newDate);
    setFormData({
      ...formData,
      expirationDate: formatted.date,
      displayDateTime: formatted.display,
      originalDateTime: newDate,
    });
  };

  // Cập nhật lại khi thay đổi giờ
  const handleTimeChange = (e) => {
    const newDate = new Date(
      `${formData.expirationDate || new Date().toISOString().split('T')[0]}T${e.target.value}`,
    );
    const formatted = formatDateTime(newDate);
    setFormData({
      ...formData,
      expirationTime: formatted.time,
      displayDateTime: formatted.display,
      originalDateTime: newDate,
    });
  };

  if (loading && !secretCodes.length) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý mã bí mật</h1>
          <p className="mt-1 text-sm text-gray-500">
            Tạo và quản lý mã bí mật cho khách hàng đăng nhập
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedCode(null);
            setFormData(getDefaultFormData());
            setShowModal(true);
          }}
          className="btn btn-primary flex items-center gap-2"
          disabled={loading}
        >
          <FaPlus /> Tạo mã mới
        </button>
      </div>

      {/* Thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-green-800">Mã khả dụng</h3>
          <p className="text-2xl font-semibold text-green-900">
            {secretCodes.filter((code) => code.status === 'Chưa dùng').length}
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-red-800">Mã đã sử dụng</h3>
          <p className="text-2xl font-semibold text-red-900">
            {secretCodes.filter((code) => code.status === 'Đã dùng').length}
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-yellow-800">Mã hết hạn</h3>
          <p className="text-2xl font-semibold text-yellow-900">
            {secretCodes.filter((code) => code.status === 'Hết hạn').length}
          </p>
        </div>
      </div>

      {/* Danh sách mã */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  STT
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã bí mật
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thời gian hết hạn
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thời gian còn lại
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số lần sử dụng
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {secretCodes.map((code, index) => (
                <tr key={code.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-center">
                    {code.code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        code.status === 'Chưa dùng'
                          ? 'bg-green-100 text-green-800'
                          : code.status === 'Đã dùng'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {code.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {new Date(code.expirationDate).toLocaleString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit',
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex justify-center">
                      <CountdownTimer
                        expirationDate={code.expirationDate}
                        onExpired={() => handleExpired(code)}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {code.usageCount || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleSelectCode(code)}
                        className="text-indigo-600 hover:text-indigo-900 disabled:opacity-50"
                        disabled={code.status === 'Đã dùng'}
                        title={code.status === 'Đã dùng' ? 'Không thể sửa mã đã sử dụng' : ''}
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(code.id)}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        disabled={code.status === 'Đã dùng'}
                        title={code.status === 'Đã dùng' ? 'Không thể xóa mã đã sử dụng' : ''}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal tạo/cập nhật */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {selectedCode ? 'Cập nhật mã bí mật' : 'Tạo mã bí mật mới'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={selectedCode ? handleUpdate : handleCreate}>
              {selectedCode && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                  <select
                    value={formData.status || 'Chưa dùng'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="Chưa dùng">Chưa dùng</option>
                    <option value="Hết hạn">Hết hạn</option>
                  </select>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Thời gian hết hạn</label>

                {/* Thêm nút chọn nhanh thời gian */}
                <div className="mt-2 mb-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickSelect(5)}
                    className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100"
                  >
                    +5 phút
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickSelect(10)}
                    className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100"
                  >
                    +10 phút
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickSelect(20)}
                    className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100"
                  >
                    +20 phút
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickSelect(30)}
                    className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100"
                  >
                    +30 phút
                  </button>
                </div>

                {/* Input hiển thị thời gian */}
                <div className="mb-2">
                  <input
                    type="text"
                    value={formData.displayDateTime || ''}
                    readOnly
                    className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 cursor-default"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500">Ngày</label>
                    <input
                      type="date"
                      value={formData.expirationDate || ''}
                      onChange={handleDateChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500">Giờ</label>
                    <input
                      type="time"
                      step="1"
                      value={formData.expirationTime || ''}
                      onChange={handleTimeChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>
                <p className="mt-1 text-xs text-gray-500">Định dạng: DD/MM/YYYY HH:mm:ss</p>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Hủy
                </button>
                <LoadingButton
                  type="submit"
                  loading={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                  {selectedCode ? 'Cập nhật' : 'Tạo mới'}
                </LoadingButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SecretCodeManagement;
