// // src/lib/api/endpoints/auth.ts
// // الـ auth endpoints. التوقيعات زي ما الـ README واصف:
// // login(email, password), register(data), forgotPassword(email), resetPassword(token, password)

// import { apiClient } from "@/lib/api/client";
// import type { AuthResponse, RegisterPayload } from "@/types/user";

// export const authApi = {
//   /** POST /auth/login */
//   login(email: string, password: string): Promise<AuthResponse> {
//     return apiClient
//       .post<AuthResponse>("/auth/login", { email, password })
//       .then((res) => res.data);
//   },

//   /** POST /auth/register — fullName + email + mobile + password */
//   register(data: RegisterPayload): Promise<AuthResponse> {
//     return apiClient
//       .post<AuthResponse>("/auth/register", data)
//       .then((res) => res.data);
//   },

//   /** POST /auth/forgot-password */
//   forgotPassword(email: string): Promise<{ message: string }> {
//     return apiClient
//       .post<{ message: string }>("/auth/forgot-password", { email })
//       .then((res) => res.data);
//   },

//   /** POST /auth/reset-password */
//   resetPassword(token: string, password: string): Promise<{ message: string }> {
//     return apiClient
//       .post<{ message: string }>("/auth/reset-password", { token, password })
//       .then((res) => res.data);
//   },
// };
// src/lib/api/endpoints/auth.ts

import { apiClient } from "@/lib/api/client";
import type { AuthResponse, RegisterPayload } from "@/types/user";

/** الباك بيلف كل response في { message, data: {...} } */
interface BackendResponse<T> {
  message: string;
  data: T;
}

export const authApi = {
  /** POST /auth/login */
  login(email: string, password: string): Promise<AuthResponse> {
    return apiClient
      .post<BackendResponse<AuthResponse>>("/auth/login", { email, password })
      .then((res) => normalizeUser(res.data.data));
  },

  /** POST /auth/register */
  register(data: RegisterPayload): Promise<AuthResponse> {
    return apiClient
      .post<BackendResponse<AuthResponse>>("/auth/register", data)
      .then((res) => normalizeUser(res.data.data));
  },

  /** POST /auth/forgot-password */
  forgotPassword(mobile: string): Promise<{ message: string }> {
    return apiClient
      .post<{ message: string }>("/auth/forgot-password", { mobile })
      .then((res) => res.data);
  },

  /** POST /auth/reset-password */
  resetPassword(
    mobile: string,
    otp: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    return apiClient
      .post<{ message: string }>("/auth/reset-password", {
        mobile,
        otp,
        newPassword,
      })
      .then((res) => res.data);
  },
};

/**
 * الباك بيرجع role بـ UPPERCASE ("STUDENT", "TEACHER"...)
 * الفرونت (RoleGuard + dashboardPathByRole) بيتوقع lowercase.
 */
const roleMap: Record<string, import("@/types/user").UserRole> = {
  STUDENT: "student",
  TEACHER: "teacher",
  SUPPORT: "support_agent",
  ADMIN: "super_admin",
  OPERATION: "teacher",
};

function normalizeUser(data: AuthResponse): AuthResponse {
  return {
    ...data,
    user: {
      ...data.user,
      role: roleMap[data.user.role as unknown as string] ?? data.user.role,
    },
  };
}