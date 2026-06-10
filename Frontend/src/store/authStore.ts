// src/store/authStore.ts
// بيمسك المستخدم الحالي + الـ token. زي ما الـ README واصف:
// state: user, token, isAuthenticated — actions: login(user, token), logout()

import { create } from "zustand";
import type { User, UserRole, ServerRole } from "@/types/user";
import { getToken, setToken, removeToken } from "@/lib/auth/token";

const USER_KEY = "auth-user";

/**
 * الـ backend بيرجّع الـ role بالحروف الكبيرة (STUDENT...). بنحوّلها
 * لشكل الـ frontend اللي الـ router بيفهمه.
 */
export function normalizeRole(role: ServerRole | UserRole): UserRole {
  switch (String(role).toUpperCase()) {
    case "TEACHER":
      return "teacher";
    case "SUPPORT":
      return "support_agent";
    case "ADMIN":
    case "SUPER_ADMIN":
      return "super_admin";
    default:
      return "student";
  }
}

/** الصفحة اللي كل role بيتوجّه ليها بعد الدخول. */
export const dashboardPathByRole: Record<UserRole, string> = {
  student: "/student/dashboard",
  teacher: "/teacher/dashboard",
  support_agent: "/support/promo-codes",
  super_admin: "/admin/tenants",
};

function readStoredUser(): User | null {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) ?? "null");
  } catch {
    return null;
  }
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  /** بيتنادى بعد نجاح login/register. */
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  const storedToken = getToken();
  const storedUser = readStoredUser();

  return {
    user: storedUser,
    token: storedToken,
    isAuthenticated: Boolean(storedToken && storedUser),

    login: (user, token) => {
      const normalized: User = { ...user, role: normalizeRole(user.role) };
      setToken(token);
      localStorage.setItem(USER_KEY, JSON.stringify(normalized));
      set({ user: normalized, token, isAuthenticated: true });
    },

    logout: () => {
      removeToken();
      localStorage.removeItem(USER_KEY);
      set({ user: null, token: null, isAuthenticated: false });
    },
  };
});