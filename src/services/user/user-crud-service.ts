// Core User CRUD Service
// Single Responsibility Principle - Only handles basic user operations
// Dependency Inversion Principle - Depends on abstractions (HttpClient, Logger)

import type { HttpClient, Logger, UserService } from '@/services/interfaces';
import type {
  CreateUserRequest,
  PaginatedResponse,
  UpdateUserRequest,
  User,
} from '@/types';

/**
 * Core user service implementation with basic CRUD operations
 * Focuses solely on HTTP-based user management
 */
export class UserServiceImpl implements UserService {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly logger: Logger
  ) {}

  async getUsers(page = 1, limit = 10): Promise<PaginatedResponse<User>> {
    this.logger.info('Fetching users', { page, limit });

    try {
      const response = await this.httpClient.get<PaginatedResponse<User>>(
        `/users?page=${page}&limit=${limit}`
      );

      this.logger.info('Users fetched successfully', {
        count: response.data.data.length,
        total: response.data.meta.total,
      });

      return response.data;
    } catch (error) {
      this.logger.error('Failed to fetch users', error as Error, {
        page,
        limit,
      });
      throw error;
    }
  }

  async getUserById(id: string): Promise<User> {
    this.logger.info('Fetching user by ID', { id });

    try {
      const response = await this.httpClient.get<User>(`/users/${id}`);

      this.logger.info('User fetched successfully', {
        userId: response.data.id,
        email: response.data.email,
      });

      return response.data;
    } catch (error) {
      this.logger.error('Failed to fetch user', error as Error, { id });
      throw error;
    }
  }

  async createUser(data: CreateUserRequest): Promise<User> {
    this.logger.info('Creating user', { email: data.email, name: data.name });

    try {
      const response = await this.httpClient.post<User>('/users', data);

      this.logger.info('User created successfully', {
        userId: response.data.id,
        email: response.data.email,
      });

      return response.data;
    } catch (error) {
      this.logger.error('Failed to create user', error as Error, {
        email: data.email,
      });
      throw error;
    }
  }

  async updateUser(id: string, data: UpdateUserRequest): Promise<User> {
    this.logger.info('Updating user', { id, updates: Object.keys(data) });

    try {
      const response = await this.httpClient.put<User>(`/users/${id}`, data);

      this.logger.info('User updated successfully', {
        userId: response.data.id,
        email: response.data.email,
      });

      return response.data;
    } catch (error) {
      this.logger.error('Failed to update user', error as Error, { id });
      throw error;
    }
  }

  async deleteUser(id: string): Promise<void> {
    this.logger.info('Deleting user', { id });

    try {
      await this.httpClient.delete(`/users/${id}`);

      this.logger.info('User deleted successfully', { id });
    } catch (error) {
      this.logger.error('Failed to delete user', error as Error, { id });
      throw error;
    }
  }

  async searchUsers(query: string): Promise<User[]> {
    this.logger.info('Searching users', { query });

    try {
      const response = await this.httpClient.get<User[]>(
        `/users/search?q=${encodeURIComponent(query)}`
      );

      this.logger.info('User search completed', {
        query,
        resultCount: response.data.length,
      });

      return response.data;
    } catch (error) {
      this.logger.error('Failed to search users', error as Error, { query });
      throw error;
    }
  }
}
