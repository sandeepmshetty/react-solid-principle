// Validated User Service - Decorator Pattern
// Single Responsibility Principle - Only adds validation to user operations
// Decorator Pattern - Adds validation behavior to existing user service

import type { Logger, UserService } from '@/services/interfaces';
import type {
  CreateUserRequest,
  PaginatedResponse,
  UpdateUserRequest,
  User,
} from '@/types';
import type { UserValidationStrategy } from './user-validation';
import { ValidationError } from './user-validation';

/**
 * User service decorator that adds validation functionality
 * Uses Decorator pattern to extend user service behavior
 */
export class ValidatedUserService implements UserService {
  constructor(
    private readonly userService: UserService,
    private readonly validationStrategy: UserValidationStrategy,
    private readonly logger: Logger
  ) {}

  async getUsers(
    page?: number,
    limit?: number
  ): Promise<PaginatedResponse<User>> {
    return this.userService.getUsers(page, limit);
  }

  async getUserById(id: string): Promise<User> {
    return this.userService.getUserById(id);
  }

  async createUser(data: CreateUserRequest): Promise<User> {
    this.validateUserData(data, 'creation');
    return this.userService.createUser(data);
  }

  async updateUser(id: string, data: UpdateUserRequest): Promise<User> {
    this.validateUserData(data, 'update', id);
    return this.userService.updateUser(id, data);
  }

  async deleteUser(id: string): Promise<void> {
    return this.userService.deleteUser(id);
  }

  async searchUsers(query: string): Promise<User[]> {
    return this.userService.searchUsers(query);
  }

  private validateUserData(
    data: CreateUserRequest | UpdateUserRequest,
    operation: 'creation' | 'update',
    id?: string
  ): void {
    const validationResult = this.validationStrategy.validate(data);

    if (!validationResult.isValid) {
      const error = new ValidationError(
        `User ${operation} validation failed`,
        validationResult.errors
      );

      this.logger.error(`User ${operation} validation failed`, error, {
        id,
        errors: validationResult.errors,
        operation,
      });

      throw error;
    }
  }
}
