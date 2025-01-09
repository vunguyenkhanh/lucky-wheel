import { XMarkIcon } from '@heroicons/react/24/outline';
import { useEffect } from 'react';

function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500',
  }[type];

  return (
    <div
      className={`fixed bottom-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg
        flex items-center space-x-2 animate-slide-up z-50`}
    >
      <span>{message}</span>
      <button onClick={onClose} className="hover:opacity-80">
        <XMarkIcon className="h-5 w-5" />
      </button>
    </div>
  );
}

export default Toast;
