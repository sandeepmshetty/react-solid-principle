// Event System Bindings
// Single Responsibility - Only handles event infrastructure bindings

import type { CommandBus, QueryBus } from '@/application/cqrs';
import type { DomainEventPublisher } from '@/domain/user/events';
import type { Logger } from '@/infrastructure/logging/interfaces';

import { SimpleCommandBus, SimpleQueryBus } from '@/application/buses';
import {
  EventBus,
  InMemoryEventStore,
} from '@/infrastructure/events/event-bus';
import type { Container } from '../container-core';
import { TYPES } from '../types';

/**
 * Configure event system and CQRS infrastructure
 */
export function configureEventBindings(container: Container): void {
  // Event infrastructure
  container
    .bind(TYPES.EventStore)
    .toFactory(
      () => new InMemoryEventStore(container.get<Logger>(TYPES.Logger))
    );

  container
    .bind<DomainEventPublisher>(TYPES.DomainEventPublisher)
    .toFactory(() => new EventBus(container.get<Logger>(TYPES.Logger)));

  // CQRS infrastructure
  container
    .bind<CommandBus>(TYPES.CommandBus)
    .toFactory(() => new SimpleCommandBus(container.get<Logger>(TYPES.Logger)));

  container
    .bind<QueryBus>(TYPES.QueryBus)
    .toFactory(() => new SimpleQueryBus(container.get<Logger>(TYPES.Logger)));
}
