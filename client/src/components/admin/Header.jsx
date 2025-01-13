import { useNavigate } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';
import { useAuthStore } from '../../store/authStore';

function Header() {
  const navigate = useNavigate();
  const { adminLogout } = useAuthStore();
  const { showToast } = useToast();

  const handleLogout = async () => {
    await adminLogout(showToast);
    navigate('/admin/login');
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Lucky Wheel Admin</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
        >
          Đăng xuất
        </button>
      </div>
    </header>
  );
}

export default Header;
