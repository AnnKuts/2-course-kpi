import { IEventHandler } from '../application/events/EventContracts';
import { BookCreatedEvent } from '../domain/events/BookCreatedEvent';

export class ConsoleAuditService implements IEventHandler<BookCreatedEvent> {
  
  async handle(event: BookCreatedEvent): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500)); 

    const timestamp = event.occurredAt.toISOString();
    console.log(`\n[AUDIT LOG - ASYNC] Запис в журнал`);
    console.log(`[AUDIT LOG] [${timestamp}] Дія: ${event.eventName} | Сутність ID: ${event.bookId}`);
    console.log(`[AUDIT LOG] Подробиці: Додана нова книга: "${event.title}" автора ${event.author}\n`);
  }
}