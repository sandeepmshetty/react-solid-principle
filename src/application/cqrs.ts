// Command and Query Responsibility Segregation (CQRS)
// Single Responsibility Principle - Commands handle writes, Queries handle reads
// Interface Segregation Principle - Separate command and query interfaces

// ✅ Base command and query interfaces
export interface Command {
  readonly commandId: string;
  readonly timestamp: Date;
}

export interface Query {
  readonly queryId: string;
  readonly timestamp: Date;
}

export interface CommandHandler<TCommand extends Command, TResult = void> {
  handle(command: TCommand): Promise<TResult>;
  canHandle(command: Command): command is TCommand;
}

export interface QueryHandler<TQuery extends Query, TResult> {
  handle(query: TQuery): Promise<TResult>;
  canHandle(query: Query): query is TQuery;
}

// ✅ Command and Query Bus interfaces
export interface CommandBus {
  execute<TResult = void>(command: Command): Promise<TResult>;
  register<TCommand extends Command, TResult = void>(
    handler: CommandHandler<TCommand, TResult>
  ): void;
}

export interface QueryBus {
  execute<TResult>(query: Query): Promise<TResult>;
  register<TQuery extends Query, TResult>(
    handler: QueryHandler<TQuery, TResult>
  ): void;
}

// ✅ Result patterns
export class Result<T, E = Error> {
  private constructor(
    private readonly _isSuccess: boolean,
    private readonly _value?: T,
    private readonly _error?: E
  ) {}

  static success<T, E = Error>(value: T): Result<T, E> {
    return new Result<T, E>(true, value, undefined);
  }

  static failure<T, E = Error>(error: E): Result<T, E> {
    return new Result<T, E>(false, undefined, error);
  }

  get isSuccess(): boolean {
    return this._isSuccess;
  }

  get isFailure(): boolean {
    return !this._isSuccess;
  }

  get value(): T {
    if (!this._isSuccess || this._value === undefined) {
      throw new Error('Cannot get value of failed result');
    }
    return this._value;
  }

  get error(): E {
    if (this._isSuccess || this._error === undefined) {
      throw new Error('Cannot get error of successful result');
    }
    return this._error;
  }

  map<U>(fn: (value: T) => U): Result<U, E> {
    if (this._isSuccess && this._value !== undefined) {
      return Result.success(fn(this._value));
    }
    return Result.failure(this._error as E);
  }

  flatMap<U>(fn: (value: T) => Result<U, E>): Result<U, E> {
    if (this._isSuccess && this._value !== undefined) {
      return fn(this._value);
    }
    return Result.failure(this._error as E);
  }
}

// ✅ Pagination
export interface PaginationQuery {
  page: number;
  limit: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
