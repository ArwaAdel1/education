// src/lib/auth/token.ts
// إدارة الـ JWT في الـ localStorage. زي ما الـ README واصف بالظبط.

const TOKEN_KEY = "auth-token";

/** بيرجّع الـ JWT أو null. */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/** بيحفظ الـ token في الـ localStorage. */
export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

/** بيمسح الـ token من الـ localStorage. */
export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}