// Application Layer Bindings
// Single Responsibility - Only handles application service bindings

import type { CommandBus, QueryBus } from '@/application/cqrs';
import { UserApplicationService } from '@/application/services/user.application-service';
import type { DomainEventPublisher } from '@/domain/user/events';
import type {
  UserDomainService,
  UserRepository,
} from '@/domain/user/repository';
import type { Logger } from '@/infrastructure/logging/interfaces';
import type { Container } from '../container-core';
import { TYPES } from '../types';

/**
 * Configure application layer services
 */
export function configureApplicationBindings(container: Container): void {
  // Application services
  container
    .bind<UserApplicationService>(TYPES.UserApplicationService)
    .toFactory(() => createUserApplicationService(container));
}

/**
 * Create user application service with all dependencies
 */
function createUserApplicationService(
  container: Container
): UserApplicationService {
  return new UserApplicationService(
    container.get<UserRepository>(TYPES.UserRepository),
    container.get<UserDomainService>(TYPES.UserDomainService),
    container.get<DomainEventPublisher>(TYPES.DomainEventPublisher),
    container.get<CommandBus>(TYPES.CommandBus),
    container.get<QueryBus>(TYPES.QueryBus),
    container.get<Logger>(TYPES.Logger)
  );
}
