export type UserRole = 'admin' | 'content_manager' | 'instructor' | 'student';

export interface StrapiRole {
  id: number;
  name: string;
  type: string;
}

export interface StrapiUser {
  id: number;
  documentId?: string;
  username: string;
  email: string;
  role?: StrapiRole | StrapiRole[];
  blocked?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  jwt: string;
  user: StrapiUser;
}

export interface SessionUser {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  rawRole?: string;
}
