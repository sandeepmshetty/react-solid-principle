// Event Bus Implementation following Observer Pattern
// Single Responsibility Principle - Only handles event publishing/subscribing
// Open/Closed Principle - New event handlers can be added without modification

import type {
  DomainEvent,
  DomainEventHandler,
  DomainEventPublisher,
} from '@/domain/user/events';
import type { Logger } from '@/infrastructure/logging/interfaces';

export class EventBus implements DomainEventPublisher {
  private readonly handlers = new Map<
    string,
    DomainEventHandler<DomainEvent>[]
  >();

  constructor(private readonly logger: Logger) {}

  // ✅ Register event handlers
  register<T extends DomainEvent>(
    eventType: string,
    handler: DomainEventHandler<T>
  ): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }

    const eventHandlers = this.handlers.get(eventType)!;
    eventHandlers.push(handler as DomainEventHandler<DomainEvent>);

    this.logger.debug(`Event handler registered for ${eventType}`, {
      eventType,
      handlerCount: eventHandlers.length,
    });
  }

  // ✅ Publish single event
  async publish(event: DomainEvent): Promise<void> {
    this.logger.info(`Publishing event: ${event.eventType}`, {
      eventType: event.eventType,
      aggregateId: event.aggregateId,
      eventId: event.eventId,
    });

    const handlers = this.handlers.get(event.eventType) || [];

    if (handlers.length === 0) {
      this.logger.warn(`No handlers found for event type: ${event.eventType}`, {
        eventType: event.eventType,
      });
      return;
    }

    // Process handlers in parallel
    const promises = handlers
      .filter(handler => handler.canHandle(event))
      .map(async handler => {
        try {
          await handler.handle(event);
          this.logger.debug(`Event handled successfully`, {
            eventType: event.eventType,
            eventId: event.eventId,
            handler: handler.constructor.name,
          });
        } catch (error) {
          this.logger.error(
            `Error handling event ${event.eventType}`,
            error as Error,
            {
              eventType: event.eventType,
              eventId: event.eventId,
              handler: handler.constructor.name,
            }
          );
          // Continue processing other handlers even if one fails
        }
      });

    await Promise.all(promises);

    this.logger.info(`Event processing completed: ${event.eventType}`, {
      eventType: event.eventType,
      handlersProcessed: promises.length,
    });
  }

  // ✅ Publish multiple events
  async publishAll(events: DomainEvent[]): Promise<void> {
    if (events.length === 0) {
      return;
    }

    this.logger.info(`Publishing ${events.length} events`);

    // Process events sequentially to maintain order
    for (const event of events) {
      await this.publish(event);
    }

    this.logger.info(`All events published successfully`, {
      eventCount: events.length,
    });
  }

  // ✅ Get registered handlers for debugging
  getHandlers(eventType: string): DomainEventHandler<DomainEvent>[] {
    return this.handlers.get(eventType) || [];
  }

  // ✅ Clear all handlers (useful for testing)
  clear(): void {
    this.handlers.clear();
    this.logger.debug('All event handlers cleared');
  }
}

// ✅ Retry mechanism for failed events
export class RetryableEventBus implements DomainEventPublisher {
  constructor(
    private readonly eventBus: EventBus,
    private readonly logger: Logger,
    private readonly maxRetries: number = 3,
    private readonly retryDelay: number = 1000
  ) {}

  async publish(event: DomainEvent): Promise<void> {
    let lastError: Error | undefined;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        await this.eventBus.publish(event);
        return; // Success, exit retry loop
      } catch (error) {
        lastError = error as Error;

        this.logger.warn(
          `Event publish attempt ${attempt} failed: ${lastError.message}`,
          {
            eventType: event.eventType,
            eventId: event.eventId,
            attempt,
            maxRetries: this.maxRetries,
            error: lastError.message,
          }
        );

        if (attempt < this.maxRetries) {
          await this.delay(this.retryDelay * attempt); // Exponential backoff
        }
      }
    }

    this.logger.error(
      'Event publish failed after all retry attempts',
      lastError,
      {
        eventType: event.eventType,
        eventId: event.eventId,
        maxRetries: this.maxRetries,
      }
    );

    throw new Error(
      `Failed to publish event after ${this.maxRetries} attempts: ${lastError?.message}`
    );
  }

  async publishAll(events: DomainEvent[]): Promise<void> {
    // Process each event with retry logic
    const promises = events.map(event => this.publish(event));
    await Promise.all(promises);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ✅ Event store for persistence
export interface EventStore {
  saveEvent(event: DomainEvent): Promise<void>;
  saveEvents(events: DomainEvent[]): Promise<void>;
  getEvents(aggregateId: string): Promise<DomainEvent[]>;
  getEventsFromVersion(
    aggregateId: string,
    version: number
  ): Promise<DomainEvent[]>;
  getAllEvents(): Promise<DomainEvent[]>;
}

export class InMemoryEventStore implements EventStore {
  private readonly events = new Map<string, DomainEvent[]>();

  constructor(private readonly logger: Logger) {}

  async saveEvent(event: DomainEvent): Promise<void> {
    const aggregateEvents = this.events.get(event.aggregateId) || [];
    aggregateEvents.push(event);
    this.events.set(event.aggregateId, aggregateEvents);

    this.logger.debug('Event saved to store', {
      eventType: event.eventType,
      aggregateId: event.aggregateId,
      eventId: event.eventId,
    });
  }

  async saveEvents(events: DomainEvent[]): Promise<void> {
    for (const event of events) {
      await this.saveEvent(event);
    }
  }

  async getEvents(aggregateId: string): Promise<DomainEvent[]> {
    return this.events.get(aggregateId) || [];
  }

  async getEventsFromVersion(
    aggregateId: string,
    version: number
  ): Promise<DomainEvent[]> {
    const allEvents = await this.getEvents(aggregateId);
    return allEvents.slice(version);
  }

  async getAllEvents(): Promise<DomainEvent[]> {
    const allEvents: DomainEvent[] = [];
    for (const events of this.events.values()) {
      allEvents.push(...events);
    }
    return allEvents.sort(
      (a, b) => a.occurredAt.getTime() - b.occurredAt.getTime()
    );
  }

  // ✅ Test helper methods
  clear(): void {
    this.events.clear();
  }

  getEventCount(): number {
    return Array.from(this.events.values()).reduce(
      (total, events) => total + events.length,
      0
    );
  }
}
