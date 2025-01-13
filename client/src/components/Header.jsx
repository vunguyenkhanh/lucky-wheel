import { useToast } from '../contexts/ToastContext';

function Header() {
  const { showToast } = useToast();
  const { adminLogout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await adminLogout(showToast);
      // Redirect sau khi logout thành công
      navigate('/admin/login');
    } catch (error) {
      // Toast đã được xử lý trong adminLogout
      console.error('Logout error:', error);
    }
  };
  // ... rest of the component
}
