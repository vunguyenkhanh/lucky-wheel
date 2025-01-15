import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { createAdmin, deleteAdmin, getAdmins, updateAdmin } from '../../api/adminApi';
import Modal from '../../components/common/Modal';
import { Spinner } from '../../components/common/Spinner';

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await getAdmins();
      setAdmins(response);
    } catch (err) {
      toast.error(err.message || 'Lỗi khi lấy danh sách admin');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (selectedAdmin) {
        // Cập nhật admin
        await updateAdmin(selectedAdmin.id, formData);
        toast.success('Cập nhật admin thành công');
      } else {
        // Thêm admin mới
        await createAdmin(formData);
        toast.success('Thêm admin thành công');
      }
      setShowModal(false);
      fetchAdmins();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (adminId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa admin này?')) return;

    try {
      setLoading(true);
      await deleteAdmin(adminId);
      toast.success('Xóa admin thành công');
      fetchAdmins();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (admin = null) => {
    setSelectedAdmin(admin);
    if (admin) {
      setFormData({
        username: admin.username,
        password: '', // Không hiển thị mật khẩu cũ
      });
    } else {
      setFormData({
        username: '',
        password: '',
      });
    }
    setShowModal(true);
  };

  if (loading && !admins.length) return <Spinner />;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Quản Lý Admin</h2>
          <p className="mt-1 text-sm text-gray-500">Quản lý tài khoản quản trị viên hệ thống</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          disabled={loading}
        >
          Thêm Admin
        </button>
      </div>

      {/* Thống kê */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="text-lg font-semibold">Tổng số admin: {admins.length}</div>
      </div>

      {/* Bảng danh sách admin */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                STT
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên đăng nhập
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày tạo
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {admins.map((admin, index) => (
              <tr key={admin.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {admin.username}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(admin.createdAt).toLocaleDateString('vi-VN')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => openModal(admin)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                    disabled={loading}
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(admin.id)}
                    className="text-red-600 hover:text-red-900"
                    disabled={loading}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal thêm/sửa admin */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedAdmin ? 'Sửa Admin' : 'Thêm Admin Mới'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tên đăng nhập</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {selectedAdmin ? 'Mật khẩu mới (để trống nếu không đổi)' : 'Mật khẩu'}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required={!selectedAdmin}
            />
          </div>
          <div className="flex justify-end space-x-3 mt-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? 'Đang xử lý...' : selectedAdmin ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminManagement;
