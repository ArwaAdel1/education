// // src/types/user.ts
// // أنواع المستخدم — متظبطة على الـ Prisma User model بتاع الـ backend.

// /** الـ role بشكل الـ frontend (اللي الـ router والـ RoleGuard بيستخدموه). */
// export type UserRole = "student" | "teacher" | "support_agent" | "super_admin";

// /** نفس الـ Role enum في الـ backend — بيرجع بالحروف الكبيرة. */
// export type ServerRole = "STUDENT" | "TEACHER" | "SUPPORT" | "ADMIN";

// export type UserStatus = "ACTIVE" | "INACTIVE" | "BANNED";

// /** شكل الـ User اللي بيرجع من الـ API (من غير password). */
// export interface User {
//   id: string;
//   fullName: string;
//   email: string;
//   mobile: string;
//   role: UserRole;
//   status: UserStatus;
//   createdAt: string;
// }

// /** body بتاع POST /auth/register — لازم يطابق أعمدة الـ User model. */
// export interface RegisterPayload {
//   fullName: string;
//   email: string;
//   mobile: string;
//   password: string;
// }

// /** الـ response المتوقّع من /auth/login و /auth/register. */
// export interface AuthResponse {
//   user: User;
//   accessToken: string;
//   refreshToken?: string;
// }


// src/types/user.ts

/** الـ role بشكل الـ frontend (اللي الـ router والـ RoleGuard بيستخدموه). */
export type UserRole = "student" | "teacher" | "support_agent" | "super_admin";

/** نفس الـ Role enum في الـ backend — بيرجع بالحروف الكبيرة. */
export type ServerRole = "STUDENT" | "TEACHER" | "SUPPORT" | "ADMIN" | "OPERATION";

export type UserStatus = "ACTIVE" | "INACTIVE" | "BANNED";

/** شكل الـ User اللي بيرجع من الـ API (من غير password). */
export interface User {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}

/** body بتاع POST /auth/register */
export interface RegisterPayload {
  fullName: string;
  email: string;
  mobile: string;
  password: string;
}

/** الـ response المتوقّع من /auth/login و /auth/register */
export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
}