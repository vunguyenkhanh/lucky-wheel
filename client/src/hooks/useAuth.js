import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const useAuth = (requireAuth = true, requireAdmin = false) => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, loading } = useAuthStore();

  useEffect(() => {
    if (loading) return;

    if (requireAuth && !isAuthenticated) {
      navigate('/login');
      return;
    }

    if (requireAdmin && !isAdmin) {
      navigate('/admin/login');
      return;
    }

    if (!requireAuth && isAuthenticated) {
      navigate('/wheel');
      return;
    }
  }, [isAuthenticated, isAdmin, loading, navigate, requireAuth, requireAdmin]);

  return { isAuthenticated, isAdmin, loading };
};
