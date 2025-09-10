// User API Contract Types
// Single Responsibility Principle - Only defines API data structures

export interface UserApiResponse {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface UserApiRequest {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}
