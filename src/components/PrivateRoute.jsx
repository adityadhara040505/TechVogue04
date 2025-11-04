import { Navigate, useLocation } from 'react-router-dom';
import { getCurrentUser } from '../lib/session';

export default function PrivateRoute({ children, requiredRole }) {
  const location = useLocation();
  const currentUser = getCurrentUser();

  if (!currentUser) {
    // Redirect to auth page with role and return URL
    const params = new URLSearchParams();
    if (requiredRole) params.set('role', requiredRole);
    params.set('returnUrl', location.pathname);
    return <Navigate to={`/auth?${params.toString()}`} replace />;
  }

  if (requiredRole && currentUser.role !== requiredRole) {
    // If user is logged in but doesn't have the required role
    const params = new URLSearchParams();
    params.set('role', requiredRole);
    params.set('returnUrl', location.pathname);
    return <Navigate to={`/auth?${params.toString()}`} replace />;
  }

  return children;
}