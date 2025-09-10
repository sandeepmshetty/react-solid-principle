// User Repository Implementation
// Single Responsibility Principle - Only handles user data persistence
// Dependency Inversion Principle - Depends on HttpClient abstraction

import type { HttpClient, Logger, UserRepository } from '@/services/interfaces';
import type { User } from '@/types';

/**
 * HTTP-based user repository implementation
 * Handles all user data persistence operations
 */
export class HttpUserRepository implements UserRepository {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly logger: Logger
  ) {}

  async read(id: string): Promise<User> {
    this.logger.info(`Reading user with id: ${id}`);
    const response = await this.httpClient.get<User>(`/users/${id}`);
    return response.data;
  }

  async create(data: Omit<User, 'id'>): Promise<User> {
    this.logger.info('Creating user in repository', { email: data.email });
    const response = await this.httpClient.post<User>('/users', data);
    this.logger.info('User created in repository', { id: response.data.id });
    return response.data;
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    this.logger.info('Updating user in repository', {
      id,
      fields: Object.keys(data),
    });
    const response = await this.httpClient.put<User>(`/users/${id}`, data);
    this.logger.info('User updated in repository', { id });
    return response.data;
  }

  async delete(id: string): Promise<void> {
    this.logger.info('Deleting user from repository', { id });
    await this.httpClient.delete(`/users/${id}`);
    this.logger.info('User deleted from repository', { id });
  }

  async findByEmail(email: string): Promise<User | null> {
    this.logger.info('Finding user by email', { email });

    try {
      const response = await this.httpClient.get<User>(
        `/users/by-email/${encodeURIComponent(email)}`
      );
      this.logger.info('User found by email', { email, id: response.data.id });
      return response.data;
    } catch (error) {
      // If user not found, return null instead of throwing
      if (error instanceof Error && error.message.includes('404')) {
        this.logger.info('User not found by email', { email });
        return null;
      }
      this.logger.error('Error finding user by email', error as Error, {
        email,
      });
      throw error;
    }
  }

  async findByRole(role: string): Promise<User[]> {
    this.logger.info('Finding users by role', { role });
    const response = await this.httpClient.get<User[]>(
      `/users/by-role/${role}`
    );
    this.logger.info('Users found by role', {
      role,
      count: response.data.length,
    });
    return response.data;
  }
}
