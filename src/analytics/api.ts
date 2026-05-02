import { IEventBus } from '../infrastructure/events/EventContracts';
import { AnalyticsRepository, IAnalyticsDatabase } from './infrastructure/repositories/AnalyticsRepository';
import { OnBookCreatedHandler } from './application/handlers/OnBookCreatedHandler';

export class AnalyticsModule {
  constructor(db: IAnalyticsDatabase, eventBus: IEventBus) {
    const repo = new AnalyticsRepository(db);
    const handler = new OnBookCreatedHandler(repo);

    eventBus.subscribe('BookCreatedEvent', handler);
  }
}