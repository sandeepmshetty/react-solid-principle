// User Queries - Read operations following CQRS pattern
// Single Responsibility Principle - Each query handles one read operation
// Interface Segregation Principle - Separate query DTOs

import type {
  PaginatedResult,
  PaginationQuery,
  Query,
  QueryHandler,
} from '@/application/cqrs';
import type { UserEntity } from '@/domain/user/entities';
import type { UserRepository } from '@/domain/user/repository';

// ✅ DTOs for queries (separate from domain entities)
export interface UserReadModel {
  id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserSummaryReadModel {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

// ✅ Get User by ID Query
export class GetUserByIdQuery implements Query {
  public readonly queryId: string;
  public readonly timestamp: Date;

  constructor(public readonly userId: string) {
    this.queryId = `get-user-${Date.now()}`;
    this.timestamp = new Date();
  }
}

export class GetUserByIdQueryHandler
  implements QueryHandler<GetUserByIdQuery, UserReadModel | null>
{
  constructor(private readonly userRepository: UserRepository) {}

  async handle(query: GetUserByIdQuery): Promise<UserReadModel | null> {
    const user = await this.userRepository.findById(query.userId);
    return user ? this.mapToReadModel(user) : null;
  }

  canHandle(query: Query): query is GetUserByIdQuery {
    return query instanceof GetUserByIdQuery;
  }

  private mapToReadModel(user: UserEntity): UserReadModel {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}

// ✅ Get Users with Pagination Query
export class GetUsersQuery implements Query {
  public readonly queryId: string;
  public readonly timestamp: Date;

  constructor(
    public readonly pagination: PaginationQuery,
    public readonly filters?: {
      role?: string;
      isActive?: boolean;
      search?: string;
    }
  ) {
    this.queryId = `get-users-${Date.now()}`;
    this.timestamp = new Date();
  }
}

export class GetUsersQueryHandler
  implements QueryHandler<GetUsersQuery, PaginatedResult<UserSummaryReadModel>>
{
  constructor(private readonly userRepository: UserRepository) {}

  async handle(
    query: GetUsersQuery
  ): Promise<PaginatedResult<UserSummaryReadModel>> {
    // This is a simplified implementation
    // In a real scenario, you'd implement filtering and pagination in the repository

    let users: UserEntity[] = [];

    if (query.filters?.role) {
      users = await this.userRepository.findByRole(query.filters.role);
    } else if (query.filters?.isActive !== undefined) {
      users = query.filters.isActive
        ? await this.userRepository.findActive()
        : await this.getAllInactiveUsers();
    } else {
      users = await this.userRepository.findActive();
    }

    // Apply search filter if provided
    if (query.filters?.search) {
      const searchTerm = query.filters.search.toLowerCase();
      users = users.filter(
        user =>
          user.name.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm)
      );
    }

    // Apply pagination
    const totalCount = users.length;
    const startIndex = (query.pagination.page - 1) * query.pagination.limit;
    const endIndex = startIndex + query.pagination.limit;
    const paginatedUsers = users.slice(startIndex, endIndex);

    // Apply sorting
    if (query.pagination.sortBy) {
      paginatedUsers.sort((a, b) => {
        const aValue = this.getValueForSorting(a, query.pagination.sortBy!);
        const bValue = this.getValueForSorting(b, query.pagination.sortBy!);

        if (query.pagination.sortDirection === 'desc') {
          return bValue.localeCompare(aValue);
        }
        return aValue.localeCompare(bValue);
      });
    }

    const totalPages = Math.ceil(totalCount / query.pagination.limit);

    return {
      items: paginatedUsers.map(this.mapToSummaryReadModel),
      totalCount,
      page: query.pagination.page,
      limit: query.pagination.limit,
      totalPages,
      hasNext: query.pagination.page < totalPages,
      hasPrevious: query.pagination.page > 1,
    };
  }

  canHandle(query: Query): query is GetUsersQuery {
    return query instanceof GetUsersQuery;
  }

  private async getAllInactiveUsers(): Promise<UserEntity[]> {
    // This would be implemented in the repository
    // For now, return empty array as we don't have inactive users method
    return [];
  }

  private getValueForSorting(user: UserEntity, sortBy: string): string {
    switch (sortBy) {
      case 'name':
        return user.name;
      case 'email':
        return user.email;
      case 'role':
        return user.role;
      case 'createdAt':
        return user.createdAt.toISOString();
      default:
        return user.name;
    }
  }

  private mapToSummaryReadModel(user: UserEntity): UserSummaryReadModel {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    };
  }
}

// ✅ Search Users Query
export class SearchUsersQuery implements Query {
  public readonly queryId: string;
  public readonly timestamp: Date;

  constructor(
    public readonly searchTerm: string,
    public readonly limit: number = 10
  ) {
    this.queryId = `search-users-${Date.now()}`;
    this.timestamp = new Date();
  }
}

export class SearchUsersQueryHandler
  implements QueryHandler<SearchUsersQuery, UserSummaryReadModel[]>
{
  constructor(private readonly userRepository: UserRepository) {}

  async handle(query: SearchUsersQuery): Promise<UserSummaryReadModel[]> {
    // Simple search implementation
    // In a real scenario, you might use a dedicated search service
    const activeUsers = await this.userRepository.findActive();
    const searchTerm = query.searchTerm.toLowerCase();

    const matchingUsers = activeUsers
      .filter(
        user =>
          user.name.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm)
      )
      .slice(0, query.limit);

    return matchingUsers.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    }));
  }

  canHandle(query: Query): query is SearchUsersQuery {
    return query instanceof SearchUsersQuery;
  }
}
