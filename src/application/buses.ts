// Command and Query Bus implementations
// Single Responsibility Principle - Each bus handles one type of operation
// Open/Closed Principle - New handlers can be registered without modification

import type { Logger } from '@/infrastructure/logging/interfaces';
import type {
  Command,
  CommandBus,
  CommandHandler,
  Query,
  QueryBus,
  QueryHandler,
} from './cqrs';

// ✅ Simple Command Bus implementation
export class SimpleCommandBus implements CommandBus {
  private readonly handlers = new Map<
    string,
    CommandHandler<Command, unknown>
  >();

  constructor(private readonly logger: Logger) {}

  async execute<TResult = void>(command: Command): Promise<TResult> {
    const commandType = command.constructor.name;

    this.logger.info(`Executing command: ${commandType}`, {
      commandType,
      commandId: command.commandId,
    });

    const handler = this.findHandler(command);
    if (!handler) {
      const error = new Error(`No handler found for command: ${commandType}`);
      this.logger.error('Command handler not found', error, { commandType });
      throw error;
    }

    try {
      const result = await handler.handle(command);

      this.logger.info(`Command executed successfully: ${commandType}`, {
        commandType,
        commandId: command.commandId,
      });

      return result as TResult;
    } catch (error) {
      this.logger.error(
        `Command execution failed: ${commandType}`,
        error as Error,
        {
          commandType,
          commandId: command.commandId,
        }
      );
      throw error;
    }
  }

  register<TCommand extends Command, TResult = void>(
    handler: CommandHandler<TCommand, TResult>
  ): void {
    // In a real implementation, you might use a more sophisticated registration system
    // For now, we'll use the handler constructor name as the key
    const handlerKey = handler.constructor.name;

    this.handlers.set(handlerKey, handler as CommandHandler<Command, unknown>);

    this.logger.debug(`Command handler registered: ${handlerKey}`);
  }

  private findHandler(
    command: Command
  ): CommandHandler<Command, unknown> | undefined {
    // Find handler by checking canHandle method
    for (const handler of this.handlers.values()) {
      if (handler.canHandle(command)) {
        return handler;
      }
    }
    return undefined;
  }

  // ✅ Utility methods for debugging
  getRegisteredHandlers(): string[] {
    return Array.from(this.handlers.keys());
  }

  clear(): void {
    this.handlers.clear();
    this.logger.debug('All command handlers cleared');
  }
}

// ✅ Simple Query Bus implementation
export class SimpleQueryBus implements QueryBus {
  private readonly handlers = new Map<string, QueryHandler<Query, unknown>>();

  constructor(private readonly logger: Logger) {}

  async execute<TResult>(query: Query): Promise<TResult> {
    const queryType = query.constructor.name;

    this.logger.debug(`Executing query: ${queryType}`, {
      queryType,
      queryId: query.queryId,
    });

    const handler = this.findHandler(query);
    if (!handler) {
      const error = new Error(`No handler found for query: ${queryType}`);
      this.logger.error('Query handler not found', error, { queryType });
      throw error;
    }

    try {
      const result = await handler.handle(query);

      this.logger.debug(`Query executed successfully: ${queryType}`, {
        queryType,
        queryId: query.queryId,
      });

      return result as TResult;
    } catch (error) {
      this.logger.error(
        `Query execution failed: ${queryType}`,
        error as Error,
        {
          queryType,
          queryId: query.queryId,
        }
      );
      throw error;
    }
  }

  register<TQuery extends Query, TResult>(
    handler: QueryHandler<TQuery, TResult>
  ): void {
    const handlerKey = handler.constructor.name;

    this.handlers.set(handlerKey, handler as QueryHandler<Query, unknown>);

    this.logger.debug(`Query handler registered: ${handlerKey}`);
  }

  private findHandler(query: Query): QueryHandler<Query, unknown> | undefined {
    // Find handler by checking canHandle method
    for (const handler of this.handlers.values()) {
      if (handler.canHandle(query)) {
        return handler;
      }
    }
    return undefined;
  }

  // ✅ Utility methods for debugging
  getRegisteredHandlers(): string[] {
    return Array.from(this.handlers.keys());
  }

  clear(): void {
    this.handlers.clear();
    this.logger.debug('All query handlers cleared');
  }
}

// ✅ Decorator for adding middleware to buses
export class MiddlewareCommandBus implements CommandBus {
  constructor(
    private readonly innerBus: CommandBus,
    private readonly middlewares: CommandMiddleware[] = []
  ) {}

  async execute<TResult = void>(command: Command): Promise<TResult> {
    let pipeline = () => this.innerBus.execute<TResult>(command);

    // Apply middlewares in reverse order
    for (let i = this.middlewares.length - 1; i >= 0; i--) {
      const middleware = this.middlewares[i];
      if (middleware) {
        const nextPipeline = pipeline;
        pipeline = () => middleware.execute(command, nextPipeline);
      }
    }

    return await pipeline();
  }

  register<TCommand extends Command, TResult = void>(
    handler: CommandHandler<TCommand, TResult>
  ): void {
    this.innerBus.register(handler);
  }

  addMiddleware(middleware: CommandMiddleware): void {
    this.middlewares.push(middleware);
  }
}

// ✅ Command middleware interface
export interface CommandMiddleware {
  execute<TResult>(
    command: Command,
    next: () => Promise<TResult>
  ): Promise<TResult>;
}

// ✅ Example middleware implementations
export class LoggingCommandMiddleware implements CommandMiddleware {
  constructor(private readonly logger: Logger) {}

  async execute<TResult>(
    command: Command,
    next: () => Promise<TResult>
  ): Promise<TResult> {
    const start = Date.now();
    const commandType = command.constructor.name;

    this.logger.info(`[MIDDLEWARE] Starting command: ${commandType}`, {
      commandType,
      commandId: command.commandId,
    });

    try {
      const result = await next();
      const duration = Date.now() - start;

      this.logger.info(`[MIDDLEWARE] Command completed: ${commandType}`, {
        commandType,
        commandId: command.commandId,
        duration,
      });

      return result;
    } catch (error) {
      const duration = Date.now() - start;

      this.logger.error(
        `[MIDDLEWARE] Command failed: ${commandType}`,
        error as Error,
        {
          commandType,
          commandId: command.commandId,
          duration,
        }
      );

      throw error;
    }
  }
}

export class ValidationCommandMiddleware implements CommandMiddleware {
  constructor(private readonly logger: Logger) {}

  async execute<TResult>(
    command: Command,
    next: () => Promise<TResult>
  ): Promise<TResult> {
    // Basic validation - in a real system you'd have proper validation
    if (!command.commandId || !command.timestamp) {
      const error = new Error('Invalid command: missing required fields');
      this.logger.error('Command validation failed', error, {
        commandType: command.constructor.name,
      });
      throw error;
    }

    return await next();
  }
}
