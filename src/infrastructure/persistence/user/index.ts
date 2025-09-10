// User Repository Module Exports
// Single Responsibility Principle - Only exports user repository functionality

// Repository implementations
export { HttpUserRepository } from './http-repository';
export { InMemoryUserRepository } from './memory-repository';

// Data transformation utilities
export { UserMapper } from './mappers';

// API contract types
export type { UserApiRequest, UserApiResponse } from './types';
