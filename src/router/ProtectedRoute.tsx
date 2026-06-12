import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LOGIN_PAGE_URL } from '../constants/routes';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token);
  if (!token) return <Navigate to={LOGIN_PAGE_URL} replace />;
  return <>{children}</>;
}
