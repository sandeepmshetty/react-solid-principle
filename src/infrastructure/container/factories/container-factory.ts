// Container Factory Functions
// Single Responsibility - Creates pre-configured containers for different environments

import { configureApplicationBindings } from '@/infrastructure/container/bindings/application-bindings';
import { configureDomainBindings } from '@/infrastructure/container/bindings/domain-bindings';
import { configureEventBindings } from '@/infrastructure/container/bindings/event-bindings';
import { configureInfrastructureBindings } from '@/infrastructure/container/bindings/infrastructure-bindings';
import type { Container } from '@/infrastructure/container/container-core';
import { ModularContainer } from '@/infrastructure/container/container-core';
import type { ContainerConfiguration } from '@/infrastructure/container/types';

/**
 * Create a fully configured container
 */
export function createContainer(config: ContainerConfiguration): Container {
  const container = new ModularContainer();

  // Configure all layers in dependency order
  configureInfrastructureBindings(container, config);
  configureDomainBindings(container, config);
  configureEventBindings(container);
  configureApplicationBindings(container);

  return container;
}

/**
 * Create development environment container
 */
export function createDevelopmentContainer(): Container {
  return createContainer({
    environment: 'development',
    apiBaseUrl: 'http://localhost:3001',
    useInMemoryRepositories: true,
    logLevel: 'debug',
  });
}

/**
 * Create production environment container
 */
export function createProductionContainer(): Container {
  return createContainer({
    environment: 'production',
    apiBaseUrl: 'https://api.example.com',
    useInMemoryRepositories: false,
    logLevel: 'error',
  });
}

/**
 * Create test environment container
 */
export function createTestContainer(): Container {
  return createContainer({
    environment: 'test',
    apiBaseUrl: 'http://localhost:3002',
    useInMemoryRepositories: true,
    logLevel: 'warn',
  });
}
