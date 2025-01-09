import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

function Home() {
  const { isAuthenticated, isAdmin } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Vòng Quay May Mắn</h1>

        <div className="space-y-4">
          {!isAuthenticated && !isAdmin && (
            <>
              <Link to="/login" className="btn btn-primary w-full">
                Đăng nhập
              </Link>
              <Link to="/register" className="btn btn-outline w-full">
                Đăng ký
              </Link>
            </>
          )}

          {isAuthenticated && (
            <Link to="/wheel" className="btn btn-primary w-full">
              Quay Thưởng
            </Link>
          )}

          {isAdmin && (
            <Link to="/admin/dashboard" className="btn btn-primary w-full">
              Quản lý
            </Link>
          )}
        </div>

        <div className="mt-8 prose prose-sm mx-auto">
          <h2>Hướng dẫn</h2>
          <ol className="text-left">
            <li>Đăng ký tài khoản mới hoặc đăng nhập nếu đã có tài khoản</li>
            <li>Nhập mã bí mật được cung cấp</li>
            <li>Bắt đầu quay thưởng</li>
            <li>Nhận thưởng ngay khi trúng</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default Home;
