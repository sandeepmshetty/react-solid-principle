// Domain Entities following Domain-Driven Design
// Single Responsibility Principle - Each entity represents one business concept
// Dependency Inversion Principle - Domain doesn't depend on infrastructure

interface UserEntityData {
  readonly id: string;
  readonly email: string;
  name: string;
  role: string;
  readonly createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export class UserEntity {
  private constructor(private readonly data: UserEntityData) {}

  // ✅ Factory method following the Builder pattern
  static create(input: {
    id: string;
    email: string;
    name: string;
    role: string;
    createdAt?: Date;
    updatedAt?: Date;
    isActive?: boolean;
  }): UserEntity {
    const now = new Date();
    return new UserEntity({
      id: input.id,
      email: input.email,
      name: input.name,
      role: input.role,
      createdAt: input.createdAt ?? now,
      updatedAt: input.updatedAt ?? now,
      isActive: input.isActive ?? true,
    });
  }

  // ✅ Getters following encapsulation principles
  get id(): string {
    return this.data.id;
  }

  get email(): string {
    return this.data.email;
  }

  get name(): string {
    return this.data.name;
  }

  get role(): string {
    return this.data.role;
  }

  get createdAt(): Date {
    return this.data.createdAt;
  }

  get updatedAt(): Date {
    return this.data.updatedAt;
  }

  get isActive(): boolean {
    return this.data.isActive;
  }

  // ✅ Business logic methods in the domain
  updateName(newName: string): void {
    if (!newName.trim()) {
      throw new DomainError('Name cannot be empty');
    }
    this.data.name = newName.trim();
    this.data.updatedAt = new Date();
  }

  updateRole(newRole: string): void {
    const validRoles = ['admin', 'user', 'moderator'];
    if (!validRoles.includes(newRole)) {
      throw new DomainError(`Invalid role: ${newRole}`);
    }
    this.data.role = newRole;
    this.data.updatedAt = new Date();
  }

  deactivate(): void {
    this.data.isActive = false;
    this.data.updatedAt = new Date();
  }

  activate(): void {
    this.data.isActive = true;
    this.data.updatedAt = new Date();
  }

  // ✅ Domain validation
  validate(): DomainValidationResult {
    const errors: string[] = [];

    if (!this.data.email.includes('@')) {
      errors.push('Invalid email format');
    }

    if (this.data.name.length < 2) {
      errors.push('Name must be at least 2 characters');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // ✅ Convert to plain object for persistence
  toPlainObject(): UserPlainObject {
    return {
      id: this.data.id,
      email: this.data.email,
      name: this.data.name,
      role: this.data.role,
      createdAt: this.data.createdAt,
      updatedAt: this.data.updatedAt,
      isActive: this.data.isActive,
    };
  }
}

// ✅ Value objects
export class UserProfile {
  constructor(
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly avatar?: string,
    public readonly bio?: string
  ) {
    if (!firstName.trim() || !lastName.trim()) {
      throw new DomainError('First name and last name are required');
    }
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}

// ✅ Domain errors
export class DomainError extends Error {
  constructor(
    message: string,
    public readonly code?: string
  ) {
    super(message);
    this.name = 'DomainError';
  }
}

// ✅ Domain interfaces
export interface DomainValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface UserPlainObject {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}
