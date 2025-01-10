import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

function Home() {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 py-20">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center text-white mb-16">
          <h1 className="text-5xl font-bold mb-6">Lucky Wheel</h1>
          <p className="text-xl mb-8">Tham gia ngay để có cơ hội nhận những phần quà hấp dẫn!</p>
          {isAuthenticated ? (
            <Link
              to="/wheel"
              className="inline-block px-8 py-3 bg-white text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-colors"
            >
              Quay Ngay
            </Link>
          ) : (
            <div className="space-x-4">
              <Link
                to="/login"
                className="inline-block px-8 py-3 bg-white text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-colors"
              >
                Đăng Nhập
              </Link>
              <Link
                to="/register"
                className="inline-block px-8 py-3 border-2 border-white text-white rounded-full font-semibold hover:bg-white/10 transition-colors"
              >
                Đăng Ký
              </Link>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-white text-center">
            <div className="text-4xl mb-4">🎁</div>
            <h3 className="text-xl font-semibold mb-2">Giải Thưởng Hấp Dẫn</h3>
            <p className="text-white/80">Nhiều phần quà giá trị đang chờ đợi bạn</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-white text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-2">Cơ Hội Trúng Thưởng Cao</h3>
            <p className="text-white/80">Tỷ lệ trúng thưởng công bằng và minh bạch</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-white text-center">
            <div className="text-4xl mb-4">🎮</div>
            <h3 className="text-xl font-semibold mb-2">Dễ Dàng Tham Gia</h3>
            <p className="text-white/80">Chỉ cần đăng ký và bắt đầu quay ngay</p>
          </div>
        </div>

        {/* How to Play */}
        <div className="mt-20 text-center text-white">
          <h2 className="text-3xl font-bold mb-12">Cách Thức Tham Gia</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="relative">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                1
              </div>
              <h4 className="font-semibold mb-2">Đăng Ký</h4>
              <p className="text-white/80">Tạo tài khoản với số điện thoại</p>
            </div>

            <div className="relative">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                2
              </div>
              <h4 className="font-semibold mb-2">Nhập Mã</h4>
              <p className="text-white/80">Nhập mã bí mật để kích hoạt</p>
            </div>

            <div className="relative">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                3
              </div>
              <h4 className="font-semibold mb-2">Quay Số</h4>
              <p className="text-white/80">Bắt đầu quay vòng quay may mắn</p>
            </div>

            <div className="relative">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                4
              </div>
              <h4 className="font-semibold mb-2">Nhận Thưởng</h4>
              <p className="text-white/80">Nhận giải thưởng ngay lập tức</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-20">
          <h2 className="text-3xl font-bold text-white mb-8">Sẵn sàng thử vận may?</h2>
          {isAuthenticated ? (
            <Link
              to="/wheel"
              className="inline-block px-8 py-4 bg-white text-blue-600 rounded-full font-semibold text-lg hover:bg-blue-50 transition-colors"
            >
              Bắt Đầu Quay Ngay
            </Link>
          ) : (
            <Link
              to="/register"
              className="inline-block px-8 py-4 bg-white text-blue-600 rounded-full font-semibold text-lg hover:bg-blue-50 transition-colors"
            >
              Đăng Ký Ngay
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
