// User Commands - Write operations following CQRS pattern
// Single Responsibility Principle - Each command handles one operation
// Command Pattern - Encapsulates requests as objects

import { Command, CommandHandler, Result } from '@/application/cqrs';
import { UserEntity, type UserRole } from '@/domain/user/entities';
import type { DomainEventPublisher } from '@/domain/user/events';
import {
  UserActivatedEvent,
  UserCreatedEvent,
  UserDeactivatedEvent,
  UserRoleChangedEvent,
  UserUpdatedEvent,
} from '@/domain/user/events';
import type {
  UserDomainService,
  UserRepository,
} from '@/domain/user/repository';

// ✅ Create User Command
export class CreateUserCommand implements Command {
  public readonly commandId: string;
  public readonly timestamp: Date;

  constructor(
    public readonly email: string,
    public readonly name: string,
    public readonly role: UserRole = 'user'
  ) {
    this.commandId = `create-user-${Date.now()}`;
    this.timestamp = new Date();
  }
}

export class CreateUserCommandHandler
  implements CommandHandler<CreateUserCommand, Result<UserEntity, string>>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userDomainService: UserDomainService,
    private readonly eventPublisher: DomainEventPublisher
  ) {}

  async handle(
    command: CreateUserCommand
  ): Promise<Result<UserEntity, string>> {
    try {
      // ✅ Domain validation
      const isEmailUnique = await this.userDomainService.validateUniqueEmail(
        command.email
      );
      if (!isEmailUnique) {
        return Result.failure('Email already exists');
      }

      // ✅ Create domain entity
      const userId = this.userDomainService.generateUserId();
      const user = UserEntity.create({
        id: userId,
        email: command.email,
        name: command.name,
        role: command.role,
      });

      // ✅ Domain validation
      const validation = user.validate();
      if (!validation.isValid) {
        return Result.failure(validation.errors.join(', '));
      }

      // ✅ Persist
      await this.userRepository.save(user);

      // ✅ Publish domain event
      const event = new UserCreatedEvent(user.id, {
        email: user.email,
        name: user.name,
        role: user.role,
      });
      await this.eventPublisher.publish(event);

      return Result.success(user);
    } catch (error) {
      return Result.failure(
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  canHandle(command: Command): command is CreateUserCommand {
    return command instanceof CreateUserCommand;
  }
}

// ✅ Update User Command
export class UpdateUserCommand implements Command {
  public readonly commandId: string;
  public readonly timestamp: Date;

  constructor(
    public readonly userId: string,
    public readonly updates: {
      name?: string;
      role?: UserRole;
    }
  ) {
    this.commandId = `update-user-${Date.now()}`;
    this.timestamp = new Date();
  }
}

export class UpdateUserCommandHandler
  implements CommandHandler<UpdateUserCommand, Result<UserEntity, string>>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly eventPublisher: DomainEventPublisher
  ) {}

  async handle(
    command: UpdateUserCommand
  ): Promise<Result<UserEntity, string>> {
    try {
      const user = await this.loadUser(command.userId);
      if (!user) {
        return Result.failure('User not found');
      }

      const updateContext = this.captureUpdateContext(user);
      this.applyUpdates(user, command.updates);

      const validationResult = this.validateUser(user);
      if (!validationResult.isValid) {
        return Result.failure(validationResult.errors.join(', '));
      }

      await this.persistUser(user);
      await this.publishUpdateEvent(user, updateContext);

      return Result.success(user);
    } catch (error) {
      return Result.failure(
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  private captureUpdateContext(user: UserEntity): UserUpdateContext {
    return {
      previousValues: {
        name: user.name,
        role: user.role,
      },
    };
  }

  private applyUpdates(
    user: UserEntity,
    updates: { name?: string; role?: UserRole }
  ): void {
    if (updates.name !== undefined) {
      user.updateName(updates.name);
    }

    if (updates.role !== undefined) {
      user.updateRole(updates.role);
    }
  }

  private validateUser(user: UserEntity): ValidationResult {
    return user.validate();
  }

  private async persistUser(user: UserEntity): Promise<void> {
    await this.userRepository.save(user);
  }

  private async publishUpdateEvent(
    user: UserEntity,
    context: UserUpdateContext
  ): Promise<void> {
    const event = new UserUpdatedEvent(user.id, {
      previousValues: context.previousValues,
      newValues: {
        name: user.name,
        role: user.role,
      },
    });
    await this.eventPublisher.publish(event);
  }

  private async loadUser(userId: string): Promise<UserEntity | null> {
    return await this.userRepository.findById(userId);
  }

  canHandle(command: Command): command is UpdateUserCommand {
    return command instanceof UpdateUserCommand;
  }
}

// ✅ Deactivate User Command
export class DeactivateUserCommand implements Command {
  public readonly commandId: string;
  public readonly timestamp: Date;

  constructor(
    public readonly userId: string,
    public readonly reason?: string
  ) {
    this.commandId = `deactivate-user-${Date.now()}`;
    this.timestamp = new Date();
  }
}

export class DeactivateUserCommandHandler
  implements CommandHandler<DeactivateUserCommand, Result<void, string>>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly eventPublisher: DomainEventPublisher
  ) {}

  async handle(command: DeactivateUserCommand): Promise<Result<void, string>> {
    try {
      const user = await this.userRepository.findById(command.userId);
      if (!user) {
        return Result.failure('User not found');
      }

      if (!user.isActive) {
        return Result.failure('User is already deactivated');
      }

      // ✅ Domain operation
      user.deactivate();

      // ✅ Persist
      await this.userRepository.save(user);

      // ✅ Publish domain event
      const event = new UserDeactivatedEvent(user.id, command.reason);
      await this.eventPublisher.publish(event);

      return Result.success(undefined);
    } catch (error) {
      return Result.failure(
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  canHandle(command: Command): command is DeactivateUserCommand {
    return command instanceof DeactivateUserCommand;
  }
}

// ✅ Activate User Command
export class ActivateUserCommand implements Command {
  public readonly commandId: string;
  public readonly timestamp: Date;

  constructor(public readonly userId: string) {
    this.commandId = `activate-user-${Date.now()}`;
    this.timestamp = new Date();
  }
}

export class ActivateUserCommandHandler
  implements CommandHandler<ActivateUserCommand, Result<UserEntity, string>>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly eventPublisher: DomainEventPublisher
  ) {}

  async handle(
    command: ActivateUserCommand
  ): Promise<Result<UserEntity, string>> {
    try {
      const user = await this.userRepository.findById(command.userId);
      if (!user) {
        return Result.failure('User not found');
      }

      if (user.isActive) {
        return Result.failure('User is already active');
      }

      // ✅ Domain operation
      user.activate();

      // ✅ Persist
      await this.userRepository.save(user);

      // ✅ Publish domain event
      const event = new UserActivatedEvent(user.id);
      await this.eventPublisher.publish(event);

      return Result.success(user);
    } catch (error) {
      return Result.failure(
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  canHandle(command: Command): command is ActivateUserCommand {
    return command instanceof ActivateUserCommand;
  }
}

// ✅ Change User Role Command
export class ChangeUserRoleCommand implements Command {
  public readonly commandId: string;
  public readonly timestamp: Date;

  constructor(
    public readonly userId: string,
    public readonly newRole: UserRole
  ) {
    this.commandId = `change-user-role-${Date.now()}`;
    this.timestamp = new Date();
  }
}

export class ChangeUserRoleCommandHandler
  implements CommandHandler<ChangeUserRoleCommand, Result<UserEntity, string>>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly eventPublisher: DomainEventPublisher
  ) {}

  async handle(
    command: ChangeUserRoleCommand
  ): Promise<Result<UserEntity, string>> {
    try {
      const user = await this.userRepository.findById(command.userId);
      if (!user) {
        return Result.failure('User not found');
      }

      const previousRole = user.role;
      user.updateRole(command.newRole);

      // ✅ Persist
      await this.userRepository.save(user);

      // ✅ Publish domain event
      const event = new UserRoleChangedEvent(
        user.id,
        previousRole,
        command.newRole
      );
      await this.eventPublisher.publish(event);

      return Result.success(user);
    } catch (error) {
      return Result.failure(
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  canHandle(command: Command): command is ChangeUserRoleCommand {
    return command instanceof ChangeUserRoleCommand;
  }
}

// ✅ Supporting interfaces for the refactored handlers
interface UserUpdateContext {
  previousValues: {
    name: string;
    role: UserRole;
  };
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}
