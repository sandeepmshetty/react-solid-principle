// Main Container Module
// Dependency Inversion Principle - Clean interface for container usage
// Single Responsibility Principle - Only exports container functionality

// Core container types and implementation
export { ModularContainer } from './container-core';
export type {
  Binding,
  Container,
  ContainerBinding,
  ServiceType,
} from './container-core';

// Service types and configuration
export { TYPES } from './types';
export type { ContainerConfiguration } from './types';

// Factory functions for different environments
export {
  createContainer,
  createDevelopmentContainer,
  createProductionContainer,
  createTestContainer,
} from './factories/container-factory';

// Individual binding modules (for advanced usage)
export { configureApplicationBindings } from './bindings/application-bindings';
export { configureDomainBindings } from './bindings/domain-bindings';
export { configureEventBindings } from './bindings/event-bindings';
export { configureInfrastructureBindings } from './bindings/infrastructure-bindings';
