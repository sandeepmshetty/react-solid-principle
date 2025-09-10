// Infrastructure Logging interfaces
// Single Responsibility Principle - Focused logging abstractions
// Interface Segregation Principle - Separate concerns for different logging needs

export interface Logger {
  info(message: string, meta?: LogMetadata): void;
  warn(message: string, meta?: LogMetadata): void;
  error(message: string, error?: Error, meta?: LogMetadata): void;
  debug(message: string, meta?: LogMetadata): void;
}

export interface LogMetadata {
  [key: string]: unknown;
}

export interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  error?: Error;
  meta?: LogMetadata;
}

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// ✅ Structured logging interface
export interface StructuredLogger extends Logger {
  log(entry: LogEntry): void;
  child(meta: LogMetadata): StructuredLogger;
}

// ✅ Log destination interfaces
export interface LogDestination {
  write(entry: LogEntry): void | Promise<void>;
}

export interface FileLogDestination extends LogDestination {
  rotate(): void | Promise<void>;
  cleanup(): void | Promise<void>;
}

// ✅ Log formatter interface
export interface LogFormatter {
  format(entry: LogEntry): string;
}

// ✅ Log filtering interface
export interface LogFilter {
  shouldLog(entry: LogEntry): boolean;
}

// ✅ Logger configuration
export interface LoggerConfig {
  level: LogLevel;
  destinations: LogDestination[];
  formatter?: LogFormatter;
  filters?: LogFilter[];
}
