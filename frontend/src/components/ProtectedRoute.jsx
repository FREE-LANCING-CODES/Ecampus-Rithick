import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuthStore();
  const location = useLocation();
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" />;
  }

  // Role-based redirects
  const path = location.pathname;
  
  // Admin trying to access student/faculty routes
  if (user?.role === 'admin' && !path.startsWith('/admin')) {
    return <Navigate to="/admin/dashboard" />;
  }
  
  // Faculty trying to access student/admin routes
  if (user?.role === 'faculty' && !path.startsWith('/faculty')) {
    return <Navigate to="/faculty/dashboard" />;
  }
  
  // Student trying to access admin/faculty routes
  if (user?.role === 'student' && (path.startsWith('/admin') || path.startsWith('/faculty'))) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default ProtectedRoute;