import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/admin/Header';
import Sidebar from '../components/admin/Sidebar';
import { useAuthStore } from '../store/authStore';

function AdminLayout() {
  const { isAdmin } = useAuthStore();
  const location = useLocation();
  const isLoginPage = location.pathname === '/admin/login';

  const menuItems = [
    {
      path: '/admin/dashboard',
      label: 'Dashboard',
      icon: '📊',
    },
    {
      path: '/admin/secret-codes',
      label: 'Quản lý mã bí mật',
      icon: '🔑',
    },
    {
      path: '/admin/admins',
      label: 'Quản lý Admin',
      icon: '👥',
    },
  ];

  if (isLoginPage) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {isAdmin && (
        <div className="flex">
          <Sidebar />
          <div className="flex-1">
            <Header />
            <main className="p-8">
              <Outlet />
            </main>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminLayout;
