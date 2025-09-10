// HTTP User Repository Implementation
// Single Responsibility Principle - Only handles HTTP-based user persistence
// Dependency Inversion Principle - Implements domain interfaces

import { UserEntity } from '@/domain/user/entities';
import type { UserRepository } from '@/domain/user/repository';
import type { HttpClient } from '@/infrastructure/http/interfaces';
import type { Logger } from '@/infrastructure/logging/interfaces';
import { UserMapper } from './mappers';
import type { UserApiResponse } from './types';

export class HttpUserRepository implements UserRepository {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly logger: Logger
  ) {}

  async findById(id: string): Promise<UserEntity | null> {
    try {
      this.logger.info(`Finding user by ID: ${id}`);

      const response = await this.httpClient.get<UserApiResponse>(
        `/users/${id}`
      );

      if (response.status === 404) {
        return null;
      }

      return UserMapper.fromApiResponse(response.data);
    } catch (error) {
      this.logger.error('Error finding user by ID', error as Error, {
        userId: id,
      });
      throw error;
    }
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    try {
      this.logger.info(`Finding user by email: ${email}`);

      const response = await this.httpClient.get<UserApiResponse[]>(
        `/users?email=${encodeURIComponent(email)}`
      );

      if (!response.data || response.data.length === 0) {
        return null;
      }

      const userData = response.data[0];
      if (!userData) {
        return null;
      }

      return UserMapper.fromApiResponse(userData);
    } catch (error) {
      this.logger.error('Error finding user by email', error as Error, {
        email,
      });
      throw error;
    }
  }

  async findByRole(role: string): Promise<UserEntity[]> {
    try {
      this.logger.info(`Finding users by role: ${role}`);

      const response = await this.httpClient.get<UserApiResponse[]>(
        `/users?role=${encodeURIComponent(role)}`
      );

      return UserMapper.fromApiResponseArray(response.data);
    } catch (error) {
      this.logger.error('Error finding users by role', error as Error, {
        role,
      });
      throw error;
    }
  }

  async findActive(): Promise<UserEntity[]> {
    try {
      this.logger.info('Finding active users');

      const response =
        await this.httpClient.get<UserApiResponse[]>('/users?active=true');

      return UserMapper.fromApiResponseArray(response.data);
    } catch (error) {
      this.logger.error('Error finding active users', error as Error);
      throw error;
    }
  }

  async count(): Promise<number> {
    try {
      this.logger.info('Counting users');

      const response = await this.httpClient.get<{ count: number }>(
        '/users/count'
      );

      return response.data.count;
    } catch (error) {
      this.logger.error('Error counting users', error as Error);
      throw error;
    }
  }

  async save(user: UserEntity): Promise<void> {
    try {
      const userData = UserMapper.toApiRequest(user);

      this.logger.info(`Saving user: ${user.id}`);

      // Determine if this is create or update
      const existingUser = await this.findById(user.id);

      if (existingUser) {
        // Update existing user
        await this.httpClient.put(`/users/${user.id}`, userData);
        this.logger.info(`User updated: ${user.id}`);
      } else {
        // Create new user
        await this.httpClient.post('/users', userData);
        this.logger.info(`User created: ${user.id}`);
      }
    } catch (error) {
      this.logger.error('Error saving user', error as Error, {
        userId: user.id,
      });
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      this.logger.info(`Deleting user: ${id}`);

      await this.httpClient.delete(`/users/${id}`);

      this.logger.info(`User deleted: ${id}`);
    } catch (error) {
      this.logger.error('Error deleting user', error as Error, { userId: id });
      throw error;
    }
  }

  async softDelete(id: string): Promise<void> {
    try {
      this.logger.info(`Soft deleting user: ${id}`);

      await this.httpClient.patch(`/users/${id}`, {
        isActive: false,
        deletedAt: new Date().toISOString(),
      });

      this.logger.info(`User soft deleted: ${id}`);
    } catch (error) {
      this.logger.error('Error soft deleting user', error as Error, {
        userId: id,
      });
      throw error;
    }
  }
}
