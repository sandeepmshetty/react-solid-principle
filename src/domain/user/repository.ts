// Domain Repository Interfaces
// Interface Segregation Principle - Specific, focused interfaces
// Dependency Inversion Principle - Domain defines contracts, infrastructure implements

import type { UserEntity } from './entities';

// ✅ ISP: Separate read and write operations
export interface UserReader {
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  findByRole(role: string): Promise<UserEntity[]>;
  findActive(): Promise<UserEntity[]>;
  count(): Promise<number>;
}

export interface UserWriter {
  save(user: UserEntity): Promise<void>;
  delete(id: string): Promise<void>;
  softDelete(id: string): Promise<void>;
}

// ✅ Combined interface for convenience
export interface UserRepository extends UserReader, UserWriter {}

// ✅ Domain services interfaces
export interface UserDomainService {
  validateUniqueEmail(email: string, excludeId?: string): Promise<boolean>;
  generateUserId(): string;
  hashPassword(password: string): Promise<string>;
  verifyPassword(password: string, hash: string): Promise<boolean>;
}

// ✅ Specification pattern for complex queries
export interface UserSpecification {
  isSatisfiedBy(user: UserEntity): boolean;
  and(spec: UserSpecification): UserSpecification;
  or(spec: UserSpecification): UserSpecification;
  not(): UserSpecification;
}

export class ActiveUserSpecification implements UserSpecification {
  isSatisfiedBy(user: UserEntity): boolean {
    return user.isActive;
  }

  and(spec: UserSpecification): UserSpecification {
    return new AndSpecification(this, spec);
  }

  or(spec: UserSpecification): UserSpecification {
    return new OrSpecification(this, spec);
  }

  not(): UserSpecification {
    return new NotSpecification(this);
  }
}

export class UserRoleSpecification implements UserSpecification {
  constructor(private readonly role: string) {}

  isSatisfiedBy(user: UserEntity): boolean {
    return user.role === this.role;
  }

  and(spec: UserSpecification): UserSpecification {
    return new AndSpecification(this, spec);
  }

  or(spec: UserSpecification): UserSpecification {
    return new OrSpecification(this, spec);
  }

  not(): UserSpecification {
    return new NotSpecification(this);
  }
}

// ✅ Specification combinators
class AndSpecification implements UserSpecification {
  constructor(
    private readonly left: UserSpecification,
    private readonly right: UserSpecification
  ) {}

  isSatisfiedBy(user: UserEntity): boolean {
    return this.left.isSatisfiedBy(user) && this.right.isSatisfiedBy(user);
  }

  and(spec: UserSpecification): UserSpecification {
    return new AndSpecification(this, spec);
  }

  or(spec: UserSpecification): UserSpecification {
    return new OrSpecification(this, spec);
  }

  not(): UserSpecification {
    return new NotSpecification(this);
  }
}

class OrSpecification implements UserSpecification {
  constructor(
    private readonly left: UserSpecification,
    private readonly right: UserSpecification
  ) {}

  isSatisfiedBy(user: UserEntity): boolean {
    return this.left.isSatisfiedBy(user) || this.right.isSatisfiedBy(user);
  }

  and(spec: UserSpecification): UserSpecification {
    return new AndSpecification(this, spec);
  }

  or(spec: UserSpecification): UserSpecification {
    return new OrSpecification(this, spec);
  }

  not(): UserSpecification {
    return new NotSpecification(this);
  }
}

class NotSpecification implements UserSpecification {
  constructor(private readonly spec: UserSpecification) {}

  isSatisfiedBy(user: UserEntity): boolean {
    return !this.spec.isSatisfiedBy(user);
  }

  and(spec: UserSpecification): UserSpecification {
    return new AndSpecification(this, spec);
  }

  or(spec: UserSpecification): UserSpecification {
    return new OrSpecification(this, spec);
  }

  not(): UserSpecification {
    return new NotSpecification(this);
  }
}
