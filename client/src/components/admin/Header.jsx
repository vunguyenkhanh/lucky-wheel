import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

function AdminHeader() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.adminLogout);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
        <button onClick={handleLogout} className="btn btn-secondary">
          Đăng Xuất
        </button>
      </div>
    </header>
  );
}

export default AdminHeader;
