import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@/types';

const AUTH_TOKEN_KEY = 'auth-token';

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: User; token: string }>) => {
      localStorage.setItem(AUTH_TOKEN_KEY, action.payload.token);
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { login, logout } = authSlice.actions;

export const loginAsStudent = () =>
  login({
    user: {
      id: 'user-1',
      name: 'يوسف أحمد',
      email: 'youssef@test.com',
      role: 'student',
      tenantId: 'tenant-1',
      createdAt: new Date().toISOString(),
    },
    token: 'mock-jwt-student',
  });

export const loginAsTeacher = () =>
  login({
    user: {
      id: 'user-2',
      name: 'أ. أحمد محمد',
      email: 'ahmed@test.com',
      role: 'teacher',
      tenantId: 'tenant-1',
      createdAt: new Date().toISOString(),
    },
    token: 'mock-jwt-teacher',
  });

export const loginAsSupportAgent = () =>
  login({
    user: {
      id: 'user-3',
      name: 'نادية حسن',
      email: 'nadia@test.com',
      role: 'support_agent',
      tenantId: 'tenant-1',
      createdAt: new Date().toISOString(),
    },
    token: 'mock-jwt-support_agent',
  });

export const loginAsSuperAdmin = () =>
  login({
    user: {
      id: 'user-4',
      name: 'المدير العام',
      email: 'admin@test.com',
      role: 'super_admin',
      tenantId: 'tenant-1',
      createdAt: new Date().toISOString(),
    },
    token: 'mock-jwt-super_admin',
  });

export default authSlice.reducer;
