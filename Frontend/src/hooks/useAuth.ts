// src/hooks/useAuth.ts
// wrapper حوالين الـ authStore. بيرجّع زي ما الـ README واصف:
// { user, token, isAuthenticated, role, login, logout }

import { useAuthStore } from "@/store/authStore";

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);

  return {
    user,
    token,
    isAuthenticated,
    role: user?.role ?? null,
    login,
    logout,
  };
}