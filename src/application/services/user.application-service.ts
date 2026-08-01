// Application Service following Application Service pattern
// Single Responsibility Principle - Orchestrates use cases
// Dependency Inversion Principle - Depends on abstractions

import { Result } from '@/application/cqrs';
import type { UserEntity, UserRole } from '@/domain/user/entities';
import type { DomainEventPublisher } from '@/domain/user/events';
import type {
  UserDomainService,
  UserRepository,
} from '@/domain/user/repository';
import type { Logger } from '@/infrastructure/logging/interfaces';

import {
  ActivateUserCommand,
  ActivateUserCommandHandler,
  ChangeUserRoleCommand,
  ChangeUserRoleCommandHandler,
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
  private readonly activateUserHandler: ActivateUserCommandHandler;
  private readonly changeUserRoleHandler: ChangeUserRoleCommandHandler;
  private readonly getUserByIdHandler: GetUserByIdQueryHandler;
  private readonly getUsersHandler: GetUsersQueryHandler;
  private readonly searchUsersHandler: SearchUsersQueryHandler;

  constructor(
    private readonly dependencies: UserApplicationServiceDependencies
  ) {
    // ✅ Initialize command handlers (CQRS write side)
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

    this.activateUserHandler = new ActivateUserCommandHandler(
      dependencies.userRepository,
      dependencies.eventPublisher
    );

    this.changeUserRoleHandler = new ChangeUserRoleCommandHandler(
      dependencies.userRepository,
      dependencies.eventPublisher
    );

    // ✅ Initialize query handlers (CQRS read side)
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

  // ✅ Command operations (write operations delegating to command handlers)
  async createUser(
    email: string,
    name: string,
    role?: UserRole
  ): Promise<Result<UserEntity, string>> {
    this.logger.info('Creating user', { email, name, role });

    const command = new CreateUserCommand(email, name, role);
    return await this.createUserHandler.handle(command);
  }

  async updateUser(
    userId: string,
    updates: { name?: string; role?: UserRole }
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

  async activateUser(userId: string): Promise<Result<UserEntity, string>> {
    this.logger.info('Activating user', { userId });

    const command = new ActivateUserCommand(userId);
    return await this.activateUserHandler.handle(command);
  }

  async changeUserRole(
    userId: string,
    newRole: UserRole
  ): Promise<Result<UserEntity, string>> {
    this.logger.info('Changing user role', { userId, newRole });

    const command = new ChangeUserRoleCommand(userId, newRole);
    return await this.changeUserRoleHandler.handle(command);
  }

  // ✅ Query operations (read operations delegating to query handlers)
  async getUserById(userId: string): Promise<UserReadModel | null> {
    this.logger.debug('Getting user by ID', { userId });

    const query = new GetUserByIdQuery(userId);
    return await this.getUserByIdHandler.handle(query);
  }

  async getUsers(
    pagination: PaginationQuery,
    filters?: {
      role?: UserRole;
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

  // ✅ Aggregate operations
  async getUserStats(): Promise<{
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    usersByRole: Record<string, number>;
  }> {
    this.logger.debug('Getting user statistics');

    const [totalUsers, activeUsers] = await Promise.all([
      this.dependencies.userRepository.count(),
      this.dependencies.userRepository.findActive(),
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
