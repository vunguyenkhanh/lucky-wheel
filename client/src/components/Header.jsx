import { useToast } from '../contexts/ToastContext';

function Header() {
  const { showToast } = useToast();
  const { adminLogout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await adminLogout(showToast);
      navigate('/admin/login');
    } catch (error) {
      navigate('/admin/login');
    }
  };
  // ... rest of the component
}
