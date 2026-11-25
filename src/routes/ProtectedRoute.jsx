import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <p className="auth-loading">Validando sesión...</p>;
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;