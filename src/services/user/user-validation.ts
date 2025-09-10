// User Validation Services
// Single Responsibility Principle - Only handles user data validation
// Strategy Pattern - Different validation strategies for different requirements

import type { CreateUserRequest, UpdateUserRequest } from '@/types';

/**
 * Validation strategy interface following Strategy pattern
 */
export interface UserValidationStrategy {
  validate(user: CreateUserRequest | UpdateUserRequest): ValidationResult;
}

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Basic user validation strategy with minimal requirements
 */
export class BasicUserValidationStrategy implements UserValidationStrategy {
  validate(user: CreateUserRequest | UpdateUserRequest): ValidationResult {
    const errors: string[] = [];

    if ('email' in user && user.email) {
      if (!this.isValidEmail(user.email)) {
        errors.push('Invalid email format');
      }
    }

    if ('name' in user && user.name) {
      if (user.name.length < 2) {
        errors.push('Name must be at least 2 characters long');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

/**
 * Strict user validation strategy with enhanced requirements
 */
export class StrictUserValidationStrategy implements UserValidationStrategy {
  validate(user: CreateUserRequest | UpdateUserRequest): ValidationResult {
    const basicResult = new BasicUserValidationStrategy().validate(user);

    if (!basicResult.isValid) {
      return basicResult;
    }

    const errors: string[] = [];

    if ('name' in user && user.name) {
      if (user.name.length < 3) {
        errors.push('Name must be at least 3 characters long');
      }
      if (!/^[a-zA-Z\s]+$/.test(user.name)) {
        errors.push('Name can only contain letters and spaces');
      }
    }

    if ('email' in user && user.email) {
      if (!user.email.includes('.')) {
        errors.push('Email must contain a valid domain');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

/**
 * Custom validation error class
 */
export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly errors: string[]
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}
