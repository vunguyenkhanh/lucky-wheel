import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export function ProtectedRoute({ children }) {
  const { isAdmin } = useAuthStore();
  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}

export function PublicRoute({ children }) {
  const { isAdmin } = useAuthStore();
  if (isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return children;
}
