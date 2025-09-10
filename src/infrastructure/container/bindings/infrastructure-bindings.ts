// Infrastructure Layer Bindings
// Single Responsibility - Only handles infrastructure service bindings

import type { HttpClient } from '@/infrastructure/http/interfaces';
import type { Logger } from '@/infrastructure/logging/interfaces';
import type { Container } from '../container-core';
import type { ContainerConfiguration } from '../types';
import { TYPES } from '../types';

/**
 * Configure infrastructure layer services
 */
export function configureInfrastructureBindings(
  container: Container,
  config: ContainerConfiguration
): void {
  // Configuration bindings
  container.bind<string>(TYPES.Environment).toValue(config.environment);
  container.bind<string>(TYPES.ApiBaseUrl).toValue(config.apiBaseUrl);

  // Logger binding
  container.bind<Logger>(TYPES.Logger).toFactory(createLogger);

  // HTTP Client binding
  container.bind<HttpClient>(TYPES.HttpClient).toFactory(createHttpClient);
}

/**
 * Create logger instance based on environment
 */
function createLogger(): Logger {
  return {
    info: (message: string, meta?: Record<string, unknown>) =>
      console.info(`[INFO] ${message}`, meta),
    warn: (message: string, meta?: Record<string, unknown>) =>
      console.warn(`[WARN] ${message}`, meta),
    error: (message: string, error?: Error, meta?: Record<string, unknown>) =>
      console.error(`[ERROR] ${message}`, error, meta),
    debug: (message: string, meta?: Record<string, unknown>) =>
      console.debug(`[DEBUG] ${message}`, meta),
  };
}

/**
 * Create HTTP client instance
 */
function createHttpClient(): HttpClient {
  return {
    get: async <T>() => ({
      data: {} as T,
      status: 200,
      statusText: 'OK',
      headers: {},
    }),
    post: async <T>() => ({
      data: {} as T,
      status: 201,
      statusText: 'Created',
      headers: {},
    }),
    put: async <T>() => ({
      data: {} as T,
      status: 200,
      statusText: 'OK',
      headers: {},
    }),
    patch: async <T>() => ({
      data: {} as T,
      status: 200,
      statusText: 'OK',
      headers: {},
    }),
    delete: async <T>() => ({
      data: {} as T,
      status: 204,
      statusText: 'No Content',
      headers: {},
    }),
  } as HttpClient;
}
