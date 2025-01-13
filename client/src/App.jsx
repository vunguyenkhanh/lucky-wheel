import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AsyncErrorBoundary from './components/error/AsyncErrorBoundary';
import { ToastProvider } from './contexts/ToastContext';
import AdminLayout from './layouts/AdminLayout';
import MainLayout from './layouts/MainLayout';
import AdminManagement from './pages/admin/AdminManagement';
import AdminDashboard from './pages/admin/Dashboard';
import AdminLogin from './pages/admin/Login';
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Register from './pages/Register';
import Wheel from './pages/Wheel';
import { useAuthStore } from './store/authStore';

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isAdmin } = useAuthStore();

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

// Public Route Component (redirect to dashboard if already logged in)
function PublicRoute({ children }) {
  const { isAdmin } = useAuthStore();

  if (isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AsyncErrorBoundary>
          <Routes>
            {/* Public Routes */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/wheel" element={<Wheel />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route
                path="login"
                element={
                  <PublicRoute>
                    <AdminLogin />
                  </PublicRoute>
                }
              />
              <Route
                path="dashboard"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="admins"
                element={
                  <ProtectedRoute>
                    <AdminManagement />
                  </ProtectedRoute>
                }
              />
              <Route index element={<Navigate to="dashboard" replace />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AsyncErrorBoundary>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
