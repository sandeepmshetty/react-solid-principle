import { ReactNode } from 'react';

// Interface Segregation Principle (ISP) - Focused, specific interfaces

// ✅ Good: Small, focused interfaces
export interface Readable<T> {
  read(id: string): Promise<T>;
}

export interface Writable<T> {
  create(data: Omit<T, 'id'>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
}

export interface Deletable {
  delete(id: string): Promise<void>;
}

export interface Searchable<T> {
  search(query: string): Promise<T[]>;
  filter(criteria: Record<string, unknown>): Promise<T[]>;
}

// ✅ Compose interfaces for specific needs
export interface Repository<T> extends Readable<T>, Writable<T>, Deletable {}

export interface SearchableRepository<T> extends Repository<T>, Searchable<T> {}

// Domain interfaces
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'admin' | 'user' | 'moderator';

export interface CreateUserRequest {
  email: string;
  name: string;
  role?: UserRole;
}

export interface UpdateUserRequest {
  name?: string;
  role?: UserRole;
}

// Authentication interfaces
export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

// API Response interfaces
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, unknown>;
}

// Component interfaces
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
}

export interface LoadingState {
  isLoading: boolean;
}

export interface ErrorState {
  error: Error | null;
}

export interface AsyncState<T> extends LoadingState, ErrorState {
  data: T | null;
}
