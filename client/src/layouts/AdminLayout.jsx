import { Navigate, Outlet } from 'react-router-dom';
import AdminHeader from '../components/admin/Header';
import AdminSidebar from '../components/admin/Sidebar';
import { useAuthStore } from '../store/authStore';

function AdminLayout() {
  const { isAdmin } = useAuthStore();

  // Redirect to admin login if not authenticated
  if (!isAdmin && window.location.pathname !== '/admin/login') {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen flex">
      {isAdmin && <AdminSidebar />}
      <div className="flex-1 flex flex-col">
        {isAdmin && <AdminHeader />}
        <main className="flex-1 p-8 bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
