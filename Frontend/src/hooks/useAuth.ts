import { login, logout } from '@/store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

export function useAuth() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  return {
    user,
    token,
    isAuthenticated,
    role: user?.role,
    login: (userData: Parameters<typeof login>[0]['user'], authToken: string) =>
      dispatch(login({ user: userData, token: authToken })),
    logout: () => dispatch(logout()),
  };
}
