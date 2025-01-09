import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { Link } from 'react-router-dom';

function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-gray-600 hover:text-gray-900">
        {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="p-4">
            <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4">
              <XMarkIcon className="h-6 w-6" />
            </button>

            <nav className="mt-8 space-y-4">
              <Link
                to="/"
                className="block px-4 py-2 text-lg hover:bg-gray-100 rounded"
                onClick={() => setIsOpen(false)}
              >
                Trang chủ
              </Link>
              <Link
                to="/wheel"
                className="block px-4 py-2 text-lg hover:bg-gray-100 rounded"
                onClick={() => setIsOpen(false)}
              >
                Vòng quay
              </Link>
              {/* Add more links as needed */}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}

export default MobileNav;
