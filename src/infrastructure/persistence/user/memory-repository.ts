// In-Memory User Repository for Testing
// Single Responsibility Principle - Only handles in-memory user persistence for testing

import { UserEntity } from '@/domain/user/entities';
import type { UserRepository } from '@/domain/user/repository';

export class InMemoryUserRepository implements UserRepository {
  private users = new Map<string, UserEntity>();

  async findById(id: string): Promise<UserEntity | null> {
    return this.users.get(id) || null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  async findByRole(role: string): Promise<UserEntity[]> {
    return Array.from(this.users.values()).filter(user => user.role === role);
  }

  async findActive(): Promise<UserEntity[]> {
    return Array.from(this.users.values()).filter(user => user.isActive);
  }

  async count(): Promise<number> {
    return this.users.size;
  }

  async save(user: UserEntity): Promise<void> {
    this.users.set(user.id, user);
  }

  async delete(id: string): Promise<void> {
    this.users.delete(id);
  }

  async softDelete(id: string): Promise<void> {
    const user = this.users.get(id);
    if (user) {
      user.deactivate();
    }
  }

  // Test helper methods
  clear(): void {
    this.users.clear();
  }

  getAll(): UserEntity[] {
    return Array.from(this.users.values());
  }
}
