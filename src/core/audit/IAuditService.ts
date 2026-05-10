import { BookCreatedEvent } from '../domain/events/BookCreatedEvent';

export interface IAuditService {
  logBookCreated(event: BookCreatedEvent): void;
}
