// User API Contract Types
// Single Responsibility Principle - Only defines API data structures

import type { UserRole } from '@/domain/user/entities';

export interface UserApiResponse {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface UserApiRequest {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}
