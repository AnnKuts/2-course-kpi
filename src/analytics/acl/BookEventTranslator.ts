import { BookCreatedEvent } from '../../core/domain/events/BookCreatedEvent';
import { BookMetric } from '../domain/models/BookMetric';

export class BookEventTranslator {
  public static toBookMetric(event: BookCreatedEvent): BookMetric {
    return new BookMetric(
      event.bookId,
      event.occurredAt
    );
  }
}