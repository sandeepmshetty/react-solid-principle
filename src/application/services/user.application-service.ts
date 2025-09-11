// Application Service following Application Service pattern
// Single Responsibility Principle - Orchestrates use cases
// Dependency Inversion Principle - Depends on abstractions

import { Result } from '@/application/cqrs';
import type { UserEntity } from '@/domain/user/entities';
import type { DomainEventPublisher } from '@/domain/user/events';
import type {
  UserDomainService,
  UserRepository,
} from '@/domain/user/repository';
import type { Logger } from '@/infrastructure/logging/interfaces';

import {
  CreateUserCommand,
  CreateUserCommandHandler,
  DeactivateUserCommand,
  DeactivateUserCommandHandler,
  UpdateUserCommand,
  UpdateUserCommandHandler,
} from '@/application/commands/user.commands';

import {
  GetUserByIdQuery,
  GetUserByIdQueryHandler,
  GetUsersQuery,
  GetUsersQueryHandler,
  SearchUsersQuery,
  SearchUsersQueryHandler,
  type UserReadModel,
  type UserSummaryReadModel,
} from '@/application/queries/user.queries';

import type { PaginatedResult, PaginationQuery } from '@/application/cqrs';

// ✅ User Application Service
interface UserApplicationServiceDependencies {
  userRepository: UserRepository;
  userDomainService: UserDomainService;
  eventPublisher: DomainEventPublisher;
  logger: Logger;
}

export class UserApplicationService {
  private readonly createUserHandler: CreateUserCommandHandler;
  private readonly updateUserHandler: UpdateUserCommandHandler;
  private readonly deactivateUserHandler: DeactivateUserCommandHandler;
  private readonly getUserByIdHandler: GetUserByIdQueryHandler;
  private readonly getUsersHandler: GetUsersQueryHandler;
  private readonly searchUsersHandler: SearchUsersQueryHandler;

  constructor(
    private readonly dependencies: UserApplicationServiceDependencies
  ) {
    // ✅ Initialize command handlers
    this.createUserHandler = new CreateUserCommandHandler(
      dependencies.userRepository,
      dependencies.userDomainService,
      dependencies.eventPublisher
    );

    this.updateUserHandler = new UpdateUserCommandHandler(
      dependencies.userRepository,
      dependencies.eventPublisher
    );

    this.deactivateUserHandler = new DeactivateUserCommandHandler(
      dependencies.userRepository,
      dependencies.eventPublisher
    );

    // ✅ Initialize query handlers
    this.getUserByIdHandler = new GetUserByIdQueryHandler(
      dependencies.userRepository
    );
    this.getUsersHandler = new GetUsersQueryHandler(
      dependencies.userRepository
    );
    this.searchUsersHandler = new SearchUsersQueryHandler(
      dependencies.userRepository
    );

    dependencies.logger.info('User Application Service initialized');
  }

  private get logger() {
    return this.dependencies.logger;
  }

  private get userRepository() {
    return this.dependencies.userRepository;
  }

  // ✅ Command operations
  async createUser(
    email: string,
    name: string,
    role?: string
  ): Promise<Result<UserEntity, string>> {
    this.logger.info('Creating user', { email, name, role });

    const command = new CreateUserCommand(email, name, role);
    return await this.createUserHandler.handle(command);
  }

  async updateUser(
    userId: string,
    updates: { name?: string; role?: string }
  ): Promise<Result<UserEntity, string>> {
    this.logger.info('Updating user', { userId, updates });

    const command = new UpdateUserCommand(userId, updates);
    return await this.updateUserHandler.handle(command);
  }

  async deactivateUser(
    userId: string,
    reason?: string
  ): Promise<Result<void, string>> {
    this.logger.info('Deactivating user', { userId, reason });

    const command = new DeactivateUserCommand(userId, reason);
    return await this.deactivateUserHandler.handle(command);
  }

  // ✅ Query operations
  async getUserById(userId: string): Promise<UserReadModel | null> {
    this.logger.debug('Getting user by ID', { userId });

    const query = new GetUserByIdQuery(userId);
    return await this.getUserByIdHandler.handle(query);
  }

  async getUsers(
    pagination: PaginationQuery,
    filters?: {
      role?: string;
      isActive?: boolean;
      search?: string;
    }
  ): Promise<PaginatedResult<UserSummaryReadModel>> {
    this.logger.debug('Getting users', { pagination, filters });

    const query = new GetUsersQuery(pagination, filters);
    return await this.getUsersHandler.handle(query);
  }

  async searchUsers(
    searchTerm: string,
    limit?: number
  ): Promise<UserSummaryReadModel[]> {
    this.logger.debug('Searching users', { searchTerm, limit });

    const query = new SearchUsersQuery(searchTerm, limit);
    return await this.searchUsersHandler.handle(query);
  }

  // ✅ Business operations
  async activateUser(userId: string): Promise<Result<UserEntity, string>> {
    try {
      this.logger.info('Activating user', { userId });

      const user = await this.userRepository.findById(userId);
      if (!user) {
        return Result.failure('User not found');
      }

      if (user.isActive) {
        return Result.failure('User is already active');
      }

      user.activate();

      await this.userRepository.save(user);

      this.logger.info('User activated successfully', { userId });
      return Result.success(user);
    } catch (error) {
      this.logger.error('Error activating user', error as Error, { userId });
      return Result.failure(
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  async changeUserRole(
    userId: string,
    newRole: string
  ): Promise<Result<UserEntity, string>> {
    try {
      this.logger.info('Changing user role', { userId, newRole });

      const user = await this.userRepository.findById(userId);
      if (!user) {
        return Result.failure('User not found');
      }

      const oldRole = user.role;
      user.updateRole(newRole);

      await this.userRepository.save(user);

      this.logger.info('User role changed successfully', {
        userId,
        oldRole,
        newRole,
      });

      return Result.success(user);
    } catch (error) {
      this.logger.error('Error changing user role', error as Error, {
        userId,
        newRole,
      });
      return Result.failure(
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  // ✅ Aggregate operations
  async getUserStats(): Promise<{
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    usersByRole: Record<string, number>;
  }> {
    this.logger.debug('Getting user statistics');

    const [totalUsers, activeUsers] = await Promise.all([
      this.userRepository.count(),
      this.userRepository.findActive(),
    ]);

    const inactiveUsers = totalUsers - activeUsers.length;

    // Count users by role
    const usersByRole: Record<string, number> = {};
    for (const user of activeUsers) {
      usersByRole[user.role] = (usersByRole[user.role] || 0) + 1;
    }

    const stats = {
      totalUsers,
      activeUsers: activeUsers.length,
      inactiveUsers,
      usersByRole,
    };

    this.dependencies.logger.debug('User statistics calculated', stats);
    return stats;
  }
}
