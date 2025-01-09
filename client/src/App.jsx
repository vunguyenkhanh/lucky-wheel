import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AsyncErrorBoundary from './components/error/AsyncErrorBoundary';
import AdminLayout from './layouts/AdminLayout';
import MainLayout from './layouts/MainLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminLogin from './pages/admin/Login';
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Register from './pages/Register';
import Wheel from './pages/Wheel';

function App() {
  return (
    <BrowserRouter>
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
            <Route path="login" element={<AdminLogin />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AsyncErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
