import { Navigate } from 'react-router-dom';
import LuckyWheel from './components/LuckyWheel';
import AsyncErrorBoundary from './components/error/AsyncErrorBoundary';
import { ProtectedRoute, PublicRoute } from './components/route/RouteProtection';
import { ToastProvider } from './contexts/ToastContext';
import AdminLayout from './layouts/AdminLayout';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Register from './pages/Register';
import AdminManagement from './pages/admin/AdminManagement';
import AdminDashboard from './pages/admin/Dashboard';
import AdminLogin from './pages/admin/Login';
import PrizeManagement from './pages/admin/PrizeManagement';
import SecretCodeManagement from './pages/admin/SecretCodeManagement';
import { useAuthStore } from './store/authStore';

const CustomerRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuthStore();

  if (!isAuthenticated || isAdmin) {
    return <Navigate to="/login" />;
  }

  return children;
};

export const routes = [
  {
    element: (
      <ToastProvider>
        <AsyncErrorBoundary>
          <MainLayout />
        </AsyncErrorBoundary>
      </ToastProvider>
    ),
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Register />,
      },
      {
        path: '/wheel',
        element: (
          <ProtectedRoute>
            <LuckyWheel />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/admin',
    children: [
      {
        index: true,
        element: <Navigate to="/admin/login" replace />,
      },
      {
        element: (
          <ToastProvider>
            <AsyncErrorBoundary>
              <AdminLayout />
            </AsyncErrorBoundary>
          </ToastProvider>
        ),
        children: [
          {
            path: 'login',
            element: (
              <PublicRoute>
                <AdminLogin />
              </PublicRoute>
            ),
          },
          {
            path: 'dashboard',
            element: (
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            ),
          },
          {
            path: 'admins',
            element: (
              <ProtectedRoute>
                <AdminManagement />
              </ProtectedRoute>
            ),
          },
          {
            path: 'secret-codes',
            element: (
              <ProtectedRoute>
                <SecretCodeManagement />
              </ProtectedRoute>
            ),
          },
          {
            path: 'prizes',
            element: (
              <ProtectedRoute>
                <PrizeManagement />
              </ProtectedRoute>
            ),
          },
        ],
      },
    ],
  },
  {
    path: 'secret-codes',
    element: (
      <ProtectedRoute>
        <SecretCodeManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <NotFound />,
  },
];
