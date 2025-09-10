// User Service Module Exports
// Single Responsibility - Only exports user service functionality

// Core CRUD service
export { UserServiceImpl } from './user-crud-service';

// Repository implementation
export { HttpUserRepository } from './user-repository';

// Validation services
export {
  BasicUserValidationStrategy,
  StrictUserValidationStrategy,
  ValidationError,
} from './user-validation';
export type {
  UserValidationStrategy,
  ValidationResult,
} from './user-validation';

// Validated service decorator
export { ValidatedUserService } from './validated-user-service';
