import { IEventHandler } from '../../../infrastructure/events/EventContracts';
import { BookCreatedEvent } from '../../../core/domain/events/BookCreatedEvent';
import { BookEventTranslator } from '../../acl/BookEventTranslator';
import { AnalyticsRepository } from '../../infrastructure/repositories/AnalyticsRepository';

export class OnBookCreatedHandler implements IEventHandler<BookCreatedEvent> {
  constructor(private readonly repo: AnalyticsRepository) {}

  async handle(event: BookCreatedEvent): Promise<void> {
    const metric = BookEventTranslator.toBookMetric(event);
    
    await this.repo.saveMetric(metric);
    console.log(`[Analytics] Записана метрика для доданої книги ID: ${metric.targetBookId}`);
  }
}