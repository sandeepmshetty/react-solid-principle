// Tests demonstrating SOLID principles and clean architecture

import type { Logger } from '@/services/interfaces';
import { CompositeLogger, ConsoleLogger, FileLogger } from '@/services/logger';

describe('Logger Services (SRP & OCP)', () => {
  describe('ConsoleLogger', () => {
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, 'info').mockImplementation();
    });

    afterEach(() => {
      consoleSpy.mockRestore();
    });

    it('should log info messages to console', () => {
      const logger = new ConsoleLogger();
      const message = 'Test message';
      const meta = { userId: '123' };

      logger.info(message, meta);

      expect(consoleSpy).toHaveBeenCalledWith('[INFO] Test message', meta);
    });

    it('should follow Single Responsibility Principle', () => {
      const logger = new ConsoleLogger();

      // Logger should only handle logging, not business logic
      expect(typeof logger.info).toBe('function');
      expect(typeof logger.warn).toBe('function');
      expect(typeof logger.error).toBe('function');
      expect(typeof logger.debug).toBe('function');

      // Should not have unrelated methods
      expect(
        (logger as unknown as Record<string, unknown>)['sendEmail']
      ).toBeUndefined();
      expect(
        (logger as unknown as Record<string, unknown>)['saveToDatabase']
      ).toBeUndefined();
    });
  });

  describe('FileLogger', () => {
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    });

    afterEach(() => {
      consoleSpy.mockRestore();
    });

    it('should log to file format', () => {
      const logger = new FileLogger('app.log');

      logger.info('Test message', { key: 'value' });

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[app.log]')
      );
    });
  });

  describe('CompositeLogger (OCP)', () => {
    it('should extend logger functionality without modifying existing loggers', () => {
      const consoleLogger = new ConsoleLogger();
      const fileLogger = new FileLogger('test.log');
      const compositeLogger = new CompositeLogger([consoleLogger, fileLogger]);

      const consoleSpy = jest.spyOn(console, 'info').mockImplementation();
      const fileSpy = jest.spyOn(console, 'log').mockImplementation();

      compositeLogger.info('Test message');

      expect(consoleSpy).toHaveBeenCalled();
      expect(fileSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
      fileSpy.mockRestore();
    });

    it('should demonstrate Open/Closed Principle', () => {
      // We can extend functionality by composition without modifying existing classes
      const logger1 = new ConsoleLogger();
      const logger2 = new FileLogger('app.log');

      // Combine loggers without modifying their implementation
      const composite = new CompositeLogger([logger1, logger2]);

      expect(composite).toBeDefined();
      expect(typeof composite.info).toBe('function');
    });
  });
});

describe('SOLID Principles Validation', () => {
  it('should demonstrate Liskov Substitution Principle', () => {
    // All logger implementations should be substitutable
    const loggers = [
      new ConsoleLogger(),
      new FileLogger('test.log'),
      new CompositeLogger([new ConsoleLogger()]),
    ];

    // Each logger should work the same way
    loggers.forEach(logger => {
      expect(() => {
        logger.info('Test message');
        logger.warn('Warning message');
        logger.error('Error message', new Error('Test error'));
        logger.debug('Debug message');
      }).not.toThrow();
    });
  });

  it('should demonstrate Interface Segregation Principle', () => {
    const logger = new ConsoleLogger();

    // Logger interface is focused and doesn't include unrelated methods
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(logger));
    const publicMethods = methods.filter(
      method => !method.startsWith('_') && method !== 'constructor'
    );

    expect(publicMethods).toEqual(['info', 'warn', 'error', 'debug']);
  });

  it('should demonstrate Dependency Inversion Principle through interfaces', () => {
    // This test shows that we depend on abstractions (Logger interface)
    // rather than concrete implementations

    function logUserAction(logger: Logger, action: string): void {
      logger.info(`User performed action: ${action}`);
    }

    const consoleLogger = new ConsoleLogger();
    const fileLogger = new FileLogger('actions.log');

    // Both implementations work with the same interface
    expect(() => logUserAction(consoleLogger, 'login')).not.toThrow();
    expect(() => logUserAction(fileLogger, 'logout')).not.toThrow();
  });
});
