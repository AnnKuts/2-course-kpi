import { IIntegrationEvent } from '../../../infrastructure/events/EventContracts';

export class BookCreatedEvent implements IIntegrationEvent {
  public readonly eventName = 'BookCreatedEvent';
  public readonly occurredAt: Date;

  constructor(
    public readonly bookId: number,
    public readonly title: string,
    public readonly author: string,
  ) {
    this.occurredAt = new Date();
  }
}
