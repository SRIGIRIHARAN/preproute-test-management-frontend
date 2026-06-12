import { useAuthStore } from '../store/authStore';

export function useAuth() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const setAuth = useAuthStore((s) => s.setAuth);
  const logout = useAuthStore((s) => s.logout);

  return { token, user, setAuth, logout, isAuthenticated: !!token };
}
