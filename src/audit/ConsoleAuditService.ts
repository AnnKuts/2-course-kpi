import { IEventHandler } from '../application/events/EventContracts';
import { BookCreatedEvent } from '../domain/events/BookCreatedEvent';
import { IAuditService } from './IAuditService';

export class ConsoleAuditService
  implements IEventHandler<BookCreatedEvent>, IAuditService
{
  logBookCreated(event: BookCreatedEvent): void {
    const timestamp = event.occurredAt.toISOString();
    console.log(`\n[AUDIT SYNC] Record created`);
    console.log(
      `[AUDIT SYNC] [${timestamp}] Action: ${event.eventName} | Entity ID: ${event.bookId}`,
    );
    console.log(
      `[AUDIT SYNC] Details: New book added: "${event.title}" by ${event.author}\n`,
    );
  }

  async handle(event: BookCreatedEvent): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const timestamp = event.occurredAt.toISOString();
    console.log(`\n[AUDIT ASYNC] Record created`);
    console.log(
      `[AUDIT ASYNC] [${timestamp}] Action: ${event.eventName} | Entity ID: ${event.bookId}`,
    );
    console.log(
      `[AUDIT ASYNC] Details: New book added: "${event.title}" by ${event.author}\n`,
    );
  }
}