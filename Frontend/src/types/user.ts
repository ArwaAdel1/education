export type UserRole = 'student' | 'teacher' | 'support_agent' | 'super_admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  tenantId: string;
  phone?: string;
  avatarUrl?: string;
  createdAt: string;
}
