import { create } from 'zustand';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  loginAsStudent: () => void;
  loginAsTeacher: () => void;
  loginAsSupportAgent: () => void;
  loginAsSuperAdmin: () => void;
}

const AUTH_TOKEN_KEY = 'auth-token';

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  login: (user, token) => {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    set({ user: null, token: null, isAuthenticated: false });
  },

  loginAsStudent: () => {
    get().login(
      {
        id: 'user-1',
        name: 'يوسف أحمد',
        email: 'youssef@test.com',
        role: 'student',
        tenantId: 'tenant-1',
        createdAt: new Date().toISOString(),
      },
      'mock-jwt-student',
    );
  },

  loginAsTeacher: () => {
    get().login(
      {
        id: 'user-2',
        name: 'أ. أحمد محمد',
        email: 'ahmed@test.com',
        role: 'teacher',
        tenantId: 'tenant-1',
        createdAt: new Date().toISOString(),
      },
      'mock-jwt-teacher',
    );
  },

  loginAsSupportAgent: () => {
    get().login(
      {
        id: 'user-3',
        name: 'نادية حسن',
        email: 'nadia@test.com',
        role: 'support_agent',
        tenantId: 'tenant-1',
        createdAt: new Date().toISOString(),
      },
      'mock-jwt-support_agent',
    );
  },

  loginAsSuperAdmin: () => {
    get().login(
      {
        id: 'user-4',
        name: 'المدير العام',
        email: 'admin@test.com',
        role: 'super_admin',
        tenantId: 'tenant-1',
        createdAt: new Date().toISOString(),
      },
      'mock-jwt-super_admin',
    );
  },
}));
