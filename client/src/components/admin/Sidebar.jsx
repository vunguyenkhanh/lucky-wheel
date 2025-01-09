import { ChartPieIcon, HomeIcon, KeyIcon, TicketIcon } from '@heroicons/react/24/outline';
import { Link, useLocation } from 'react-router-dom';

function Sidebar() {
  const location = useLocation();

  const navigation = [
    { name: 'Trang Chủ', href: '/admin', icon: HomeIcon },
    { name: 'Giải Thưởng', href: '/admin/prizes', icon: TicketIcon },
    { name: 'Mã Bí Mật', href: '/admin/secret-codes', icon: KeyIcon },
    { name: 'Thống Kê', href: '/admin/analytics', icon: ChartPieIcon },
  ];

  return (
    <div className="w-64 bg-indigo-800 text-white min-h-screen">
      <div className="p-4">
        <h2 className="text-xl font-bold">SoundHub Admin</h2>
      </div>
      <nav className="mt-4">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center px-4 py-3 text-sm ${
                isActive ? 'bg-indigo-900 text-white' : 'text-indigo-100 hover:bg-indigo-700'
              }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default Sidebar;
