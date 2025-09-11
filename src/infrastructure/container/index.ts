// Main Container Module
// Dependency Inversion Principle - Clean interface for container usage
// Single Responsibility Principle - Only exports container functionality

// Service types and configuration
export { TYPES } from './types';
export type { ContainerConfiguration } from './types';

// Factory functions for different environments
export {
  createDevelopmentContainer,
  createTestContainer,
} from './factories/container-factory';
