import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import { useTenantStore } from '@/store/tenantStore';

const TOKEN_KEY = 'auth-token';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Request interceptor: attach auth token and tenant id.
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const currentTenant = useTenantStore.getState().currentTenant;
  if (currentTenant) {
    config.headers['X-Tenant-ID'] = currentTenant.id;
  }

  return config;
});

// Response interceptor: handle 401 by logging out and redirecting.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  },
);
