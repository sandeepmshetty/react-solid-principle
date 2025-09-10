// Domain Events following Event Sourcing patterns
// Single Responsibility Principle - Each event represents one business event
// Open/Closed Principle - New events can be added without modifying existing ones

export abstract class DomainEvent {
  public readonly occurredAt: Date;
  public readonly eventId: string;

  constructor(
    public readonly aggregateId: string,
    public readonly eventType: string
  ) {
    this.occurredAt = new Date();
    this.eventId = this.generateEventId();
  }

  private generateEventId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// ✅ User domain events
export class UserCreatedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly userData: {
      email: string;
      name: string;
      role: string;
    }
  ) {
    super(aggregateId, 'UserCreated');
  }
}

export class UserUpdatedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly changes: {
      previousValues: Record<string, unknown>;
      newValues: Record<string, unknown>;
    }
  ) {
    super(aggregateId, 'UserUpdated');
  }
}

export class UserDeactivatedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly reason?: string
  ) {
    super(aggregateId, 'UserDeactivated');
  }
}

export class UserActivatedEvent extends DomainEvent {
  constructor(aggregateId: string) {
    super(aggregateId, 'UserActivated');
  }
}

export class UserRoleChangedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly previousRole: string,
    public readonly newRole: string
  ) {
    super(aggregateId, 'UserRoleChanged');
  }
}

// ✅ Domain event publisher interface
export interface DomainEventPublisher {
  publish(event: DomainEvent): Promise<void>;
  publishAll(events: DomainEvent[]): Promise<void>;
}

// ✅ Domain event handler interface
export interface DomainEventHandler<T extends DomainEvent> {
  handle(event: T): Promise<void>;
  canHandle(event: DomainEvent): event is T;
}

// ✅ Event store interface for event sourcing
export interface EventStore {
  saveEvents(aggregateId: string, events: DomainEvent[]): Promise<void>;
  getEvents(aggregateId: string): Promise<DomainEvent[]>;
  getEventsFromVersion(
    aggregateId: string,
    version: number
  ): Promise<DomainEvent[]>;
}
