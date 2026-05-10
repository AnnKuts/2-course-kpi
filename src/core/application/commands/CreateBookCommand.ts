import { IEventBus } from '../../../infrastructure/events/EventContracts';
import { BookCreatedEvent } from '../../domain/events/BookCreatedEvent';
import { BookFactory } from '../../domain/factories/BookFactory';
import { Genre } from '../../domain/models/Genre';
import { IBookWriteRepository } from '../../domain/repositories/IBookWriteRepository';
import { IAuditService } from '../../audit/IAuditService';

export type CreateBookCommand = {
  title: string;
  author: string;
  genre: Genre;
  rating: number;
  description: string;
  isRead: boolean;
};

export class CreateBookCommandHandler {
  constructor(
    private readonly bookRepository: IBookWriteRepository,
    private readonly bookFactory: BookFactory,
    private readonly eventBus: IEventBus,
    private readonly auditService: IAuditService,
  ) {}

  public async execute(command: CreateBookCommand): Promise<number> {
    const newBook = await this.bookFactory.create(
      0,
      command.title,
      command.author,
      command.genre,
      command.rating,
      command.description,
      command.isRead,
    );

    const savedBook = await this.bookRepository.create(newBook);
    const event = new BookCreatedEvent(savedBook.id, command.title, command.author);

    try {
      this.auditService.logBookCreated(event);
    } catch (auditError) {
      console.error('[CreateBookHandler] Sync audit failed (ignored):', auditError);
    }

    this.eventBus.publish(event);
    return savedBook.id;
  }
}
