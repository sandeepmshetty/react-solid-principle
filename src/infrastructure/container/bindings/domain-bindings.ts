// Domain Layer Bindings
// Single Responsibility - Only handles domain service bindings

import type {
  UserDomainService,
  UserRepository,
} from '@/domain/user/repository';
import type { HttpClient } from '@/infrastructure/http/interfaces';
import type { Logger } from '@/infrastructure/logging/interfaces';
import {
  HttpUserRepository,
  InMemoryUserRepository,
} from '@/infrastructure/persistence/user.repository';
import type { Container } from '../container-core';
import type { ContainerConfiguration } from '../types';
import { TYPES } from '../types';

/**
 * Configure domain layer services
 */
export function configureDomainBindings(
  container: Container,
  config: ContainerConfiguration
): void {
  // Domain service binding
  container
    .bind<UserDomainService>(TYPES.UserDomainService)
    .toFactory(() => createUserDomainService());

  // Repository binding - choose implementation based on config
  if (config.useInMemoryRepositories) {
    container
      .bind<UserRepository>(TYPES.UserRepository)
      .toFactory(() => new InMemoryUserRepository());
  } else {
    container
      .bind<UserRepository>(TYPES.UserRepository)
      .toFactory(
        () =>
          new HttpUserRepository(
            container.get<HttpClient>(TYPES.HttpClient),
            container.get<Logger>(TYPES.Logger)
          )
      );
  }
}

/**
 * Create user domain service with business logic
 */
function createUserDomainService(): UserDomainService {
  return {
    validateUniqueEmail: async () => true,
    generateUserId: () =>
      `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    hashPassword: async (password: string) => `hashed-${password}`,
    verifyPassword: async (password: string, hash: string) =>
      hash === `hashed-${password}`,
  };
}
