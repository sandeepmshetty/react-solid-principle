// Domain Entities following Domain-Driven Design
// Single Responsibility Principle - Each type/class represents one concept
// Dependency Inversion Principle - Domain doesn't depend on infrastructure

// ✅ UserRole — typed union prevents invalid roles at compile time (ISP + type-safety)
export type UserRole = 'admin' | 'user' | 'moderator';

// ✅ EmailAddress value object — validation enforced at construction time (SRP)
//    Invalid email states are unrepresentable; the weak validate() check is no longer needed.
export class EmailAddress {
  private constructor(public readonly value: string) {}

  static create(raw: string): EmailAddress {
    const normalised = raw.trim().toLowerCase();
    // RFC-minimal check: must contain exactly one @, with chars on both sides
    const atIndex = normalised.indexOf('@');
    if (atIndex < 1 || atIndex === normalised.length - 1) {
      throw new DomainError(`Invalid email address: "${raw}"`);
    }
    return new EmailAddress(normalised);
  }

  equals(other: EmailAddress): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}

interface UserEntityData {
  readonly id: string;
  readonly email: string; // stored as normalised string after EmailAddress validation
  name: string;
  role: UserRole;
  readonly createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export class UserEntity {
  private constructor(private readonly data: UserEntityData) {}

  // ✅ Factory method — EmailAddress validates the email before storage
  static create(input: {
    id: string;
    email: string;
    name: string;
    role?: UserRole;
    createdAt?: Date;
    updatedAt?: Date;
    isActive?: boolean;
  }): UserEntity {
    const emailAddress = EmailAddress.create(input.email); // throws DomainError if invalid
    const now = new Date();
    return new UserEntity({
      id: input.id,
      email: emailAddress.value, // normalised lowercase value
      name: input.name,
      role: input.role ?? 'user',
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

  get role(): UserRole {
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

  updateRole(newRole: UserRole): void {
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

  // ✅ Domain validation — email is always valid (enforced by EmailAddress VO at construction)
  validate(): DomainValidationResult {
    const errors: string[] = [];

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
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}
