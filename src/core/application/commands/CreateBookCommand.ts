import { IEventBus } from '../../../infrastructure/events/EventContracts';
import { BookCreatedEvent } from '../../domain/events/BookCreatedEvent';
import { BookFactory } from '../../domain/factories/BookFactory';
import { Genre } from '../../domain/models/Genre';
import { IBookWriteRepository } from '../../domain/repositories/IBookWriteRepository';

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
    private readonly eventBus: IEventBus,
  ) {}

  public async execute(command: CreateBookCommand): Promise<number> {
    const newBook = BookFactory.create(
      0,
      command.title,
      command.author,
      command.genre,
      command.rating,
      command.description,
      command.isRead,
    );

    const savedBook = await this.bookRepository.create(newBook);

    const event = new BookCreatedEvent(
      savedBook.id,
      command.title,
      command.author,
    );

    this.eventBus.publish(event);
    return savedBook.id;
  }
}
