// Dependency Inversion Principle (DIP) - IoC Container for dependency management
// Single Responsibility Principle (SRP) - Container only manages dependencies

import { FetchHttpClient } from '@/services/http-client';
import type { HttpClient, Logger, UserService } from '@/services/interfaces';
import { ConsoleLogger } from '@/services/logger';
import {
  BasicUserValidationStrategy,
  UserServiceImpl,
  ValidatedUserService,
} from '@/services/user.service';

// ✅ Service identifiers for type-safe dependency injection
export const TYPES = {
  Logger: Symbol.for('Logger'),
  HttpClient: Symbol.for('HttpClient'),
  UserService: Symbol.for('UserService'),
  ApiBaseUrl: Symbol.for('ApiBaseUrl'),
} as const;

export type ServiceType = (typeof TYPES)[keyof typeof TYPES];

// ✅ Container interface for dependency injection
export interface Container {
  bind<T>(identifier: ServiceType): Binding<T>;
  get<T>(identifier: ServiceType): T;
  has(identifier: ServiceType): boolean;
}

export interface Binding<T> {
  to(implementation: new (...args: unknown[]) => T): void;
  toValue(value: T): void;
  toFactory(factory: () => T): void;
}

// ✅ Simple IoC Container implementation
export class SimpleContainer implements Container {
  private readonly bindings = new Map<ServiceType, ContainerBinding>();
  private readonly instances = new Map<ServiceType, unknown>();

  bind<T>(identifier: ServiceType): Binding<T> {
    return {
      to: (implementation: new (...args: unknown[]) => T) => {
        this.bindings.set(identifier, {
          type: 'constructor',
          value: implementation,
        });
      },
      toValue: (value: T) => {
        this.bindings.set(identifier, {
          type: 'value',
          value,
        });
      },
      toFactory: (factory: () => T) => {
        this.bindings.set(identifier, {
          type: 'factory',
          value: factory,
        });
      },
    };
  }

  get<T>(identifier: ServiceType): T {
    // Return singleton instance if already created
    if (this.instances.has(identifier)) {
      return this.instances.get(identifier) as T;
    }

    const binding = this.bindings.get(identifier);
    if (!binding) {
      throw new Error(
        `No binding found for identifier: ${identifier.toString()}`
      );
    }

    let instance: T;

    switch (binding.type) {
      case 'value':
        instance = binding.value as T;
        break;
      case 'factory':
        instance = (binding.value as () => T)();
        break;
      case 'constructor':
        instance = this.createInstance(
          binding.value as new (...args: unknown[]) => T
        );
        break;
      default:
        throw new Error(
          `Unknown binding type for identifier: ${identifier.toString()}`
        );
    }

    // Store as singleton
    this.instances.set(identifier, instance);
    return instance;
  }

  has(identifier: ServiceType): boolean {
    return this.bindings.has(identifier);
  }

  private createInstance<T>(constructor: new (...args: unknown[]) => T): T {
    // This is a simplified version. In a real IoC container, you would:
    // 1. Analyze constructor parameters
    // 2. Resolve dependencies recursively
    // 3. Handle circular dependencies
    // 4. Support different scopes (singleton, transient, etc.)

    // For this example, we'll manually resolve known dependencies
    if (constructor === FetchHttpClient) {
      return new constructor() as T;
    }

    if (constructor === UserServiceImpl) {
      const httpClient = this.get<HttpClient>(TYPES.HttpClient);
      const logger = this.get<Logger>(TYPES.Logger);
      return new constructor(httpClient, logger) as T;
    }

    // Default: try to create without dependencies
    return new constructor();
  }
}

interface ContainerBinding {
  type: 'constructor' | 'value' | 'factory';
  value: unknown;
}

// ✅ Factory function to create a configured container
export function createContainer(config: AppConfiguration): Container {
  const container = new SimpleContainer();

  // Configure logger
  container.bind<Logger>(TYPES.Logger).toValue(new ConsoleLogger());

  // Configure API base URL
  container.bind<string>(TYPES.ApiBaseUrl).toValue(config.apiBaseUrl);

  // Configure HTTP client
  container.bind<HttpClient>(TYPES.HttpClient).toFactory(() => {
    return new FetchHttpClient();
  });

  // Configure user service with validation
  container.bind<UserService>(TYPES.UserService).toFactory(() => {
    const baseUserService = new UserServiceImpl(
      container.get<HttpClient>(TYPES.HttpClient),
      container.get<Logger>(TYPES.Logger)
    );

    return new ValidatedUserService(
      baseUserService,
      new BasicUserValidationStrategy(),
      container.get<Logger>(TYPES.Logger)
    );
  });

  return container;
}

export interface AppConfiguration {
  apiBaseUrl: string;
  environment: 'development' | 'production' | 'test';
}

// ✅ Example usage and factory for different environments
export function createProductionContainer(): Container {
  return createContainer({
    apiBaseUrl: 'https://api.example.com',
    environment: 'production',
  });
}

export function createDevelopmentContainer(): Container {
  return createContainer({
    apiBaseUrl: 'http://localhost:3001',
    environment: 'development',
  });
}

export function createTestContainer(): Container {
  return createContainer({
    apiBaseUrl: 'http://localhost:3002',
    environment: 'test',
  });
}
