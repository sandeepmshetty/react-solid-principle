// Service Type Definitions
// Single Responsibility - Only defines service identifiers and types

// ✅ Service identifiers
export const TYPES = {
  // Infrastructure
  Logger: Symbol.for('Logger'),
  HttpClient: Symbol.for('HttpClient'),
  Environment: Symbol.for('Environment'),
  ApiBaseUrl: Symbol.for('ApiBaseUrl'),

  // Domain
  UserRepository: Symbol.for('UserRepository'),
  UserDomainService: Symbol.for('UserDomainService'),

  // Events
  EventStore: Symbol.for('EventStore'),
  DomainEventPublisher: Symbol.for('DomainEventPublisher'),

  // CQRS
  CommandBus: Symbol.for('CommandBus'),
  QueryBus: Symbol.for('QueryBus'),

  // Application
  UserApplicationService: Symbol.for('UserApplicationService'),
} as const;

// ✅ Container configuration
export interface ContainerConfiguration {
  environment: 'development' | 'production' | 'test';
  apiBaseUrl: string;
  useInMemoryRepositories?: boolean;
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
}
