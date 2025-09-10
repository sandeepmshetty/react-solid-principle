// Single Responsibility Principle (SRP) - Each class has one responsibility
// Dependency Inversion Principle (DIP) - Depends on abstractions, not concretions

import type { Logger } from '@/services/interfaces';

// ✅ SRP: ConsoleLogger only handles console logging
export class ConsoleLogger implements Logger {
  info(message: string, meta?: Record<string, unknown>): void {
    console.info(`[INFO] ${message}`, meta);
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    console.warn(`[WARN] ${message}`, meta);
  }

  error(message: string, error?: Error, meta?: Record<string, unknown>): void {
    console.error(`[ERROR] ${message}`, error, meta);
  }

  debug(message: string, meta?: Record<string, unknown>): void {
    // Only log debug in development mode
    console.debug(`[DEBUG] ${message}`, meta);
  }
}

// ✅ SRP: FileLogger only handles file logging
export class FileLogger implements Logger {
  constructor(private readonly logFile: string) {}

  info(message: string, meta?: Record<string, unknown>): void {
    this.writeToFile('INFO', message, meta);
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    this.writeToFile('WARN', message, meta);
  }

  error(message: string, error?: Error, meta?: Record<string, unknown>): void {
    this.writeToFile('ERROR', message, { error: error?.message, ...meta });
  }

  debug(message: string, meta?: Record<string, unknown>): void {
    // Only log debug in development mode
    this.writeToFile('DEBUG', message, meta);
  }

  private writeToFile(
    level: string,
    message: string,
    meta?: Record<string, unknown>
  ): void {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      meta,
    };

    // In a real implementation, this would write to a file
    console.log(`[${this.logFile}] ${JSON.stringify(logEntry)}`);
  }
}

// ✅ SRP & OCP: RemoteLogger handles remote logging and is extensible
export class RemoteLogger implements Logger {
  constructor(
    private readonly endpoint: string,
    private readonly apiKey: string
  ) {}

  info(message: string, meta?: Record<string, unknown>): void {
    this.sendToRemote('info', message, meta);
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    this.sendToRemote('warn', message, meta);
  }

  error(message: string, error?: Error, meta?: Record<string, unknown>): void {
    this.sendToRemote('error', message, { error: error?.message, ...meta });
  }

  debug(message: string, meta?: Record<string, unknown>): void {
    // Only log debug in development mode
    this.sendToRemote('debug', message, meta);
  }

  private async sendToRemote(
    level: string,
    message: string,
    meta?: Record<string, unknown>
  ): Promise<void> {
    try {
      await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          level,
          message,
          meta,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      // Fallback to console if remote logging fails
      console.error('Failed to send log to remote:', error);
      console.log(`[${level.toUpperCase()}] ${message}`, meta);
    }
  }
}

// ✅ Decorator Pattern + SRP: Composable logging with multiple outputs
export class CompositeLogger implements Logger {
  constructor(private readonly loggers: Logger[]) {}

  info(message: string, meta?: Record<string, unknown>): void {
    this.loggers.forEach(logger => logger.info(message, meta));
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    this.loggers.forEach(logger => logger.warn(message, meta));
  }

  error(message: string, error?: Error, meta?: Record<string, unknown>): void {
    this.loggers.forEach(logger => logger.error(message, error, meta));
  }

  debug(message: string, meta?: Record<string, unknown>): void {
    this.loggers.forEach(logger => logger.debug(message, meta));
  }
}
