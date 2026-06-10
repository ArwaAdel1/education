// src/lib/api/client.ts
// الـ axios instance الموحّد. كل API بيعدّي من هنا.

import axios, { AxiosError } from "axios";
import { getToken, removeToken } from "@/lib/auth/token";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

/* ----------------------------- request ------------------------------- */
// بنحقن الـ Bearer token + الـ tenant id في كل request.
apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // لو عندك tenantStore، تقدري تقري الـ slug منه بدل الـ localStorage.
  const tenantId = localStorage.getItem("tenant-id");
  if (tenantId) {
    config.headers["X-Tenant-ID"] = tenantId;
  }
  return config;
});

/* ----------------------------- response ------------------------------ */
// على 401: نمسح الـ session ونرجّع المستخدم لـ /auth. باقي الأخطاء بنرجّعها
// بشكل ثابت عشان الـ UI يتعامل معاها بسهولة.
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      removeToken();
      // lazy import عشان نكسر الـ circular dependency مع الـ store.
      const { useAuthStore } = await import("@/store/authStore");
      useAuthStore.getState().logout();
      if (window.location.pathname !== "/auth") {
        window.location.assign("/auth");
      }
    }
    return Promise.reject(normalizeError(error));
  }
);

export interface ApiError {
  statusCode: number;
  message: string;
}

function normalizeError(error: AxiosError): ApiError {
  const data = error.response?.data as { message?: string | string[] } | undefined;
  const raw = data?.message;
  // NestJS بيرجّع message كـ string أو array.
  const message = Array.isArray(raw) ? raw[0] : raw ?? "حصل خطأ، حاول تاني.";
  return { statusCode: error.response?.status ?? 0, message };
}