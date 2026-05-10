import { Router } from 'express';
import { IDatabase, BookWriteRepository, BookReadRepository } from './infrastructure/repositories/book.repository';
import { BookController } from './presentation/controllers/book.controller';
import { createBookRouter } from './routes/book.router';
import { BookFactory } from './domain/factories/BookFactory';
import { ConsoleAuditService } from './audit/ConsoleAuditService';
import { CreateBookCommandHandler } from './application/commands/CreateBookCommand';
import { UpdateBookCommandHandler } from './application/commands/UpdateBookCommand';
import { DeleteBookCommandHandler } from './application/commands/DeleteBookCommand';
import { RateBookCommandHandler } from './application/commands/RateBookCommand';
import { MarkAsReadCommandHandler } from './application/commands/MarkAsReadCommand';
import { GetAllBooksQueryHandler } from './application/queries/GetAllBooksQuery';
import { GetBookByIdQueryHandler } from './application/queries/GetBookByIdQuery';
import { GetReadBooksQueryHandler } from './application/queries/GetReadBooksQuery';
import { IEventBus } from '../infrastructure/events/EventContracts';

export class CoreModule {
  public readonly router: Router;

  constructor(db: IDatabase, eventBus: IEventBus) {
    const bookWriteRepository = new BookWriteRepository(db);
    const bookReadRepository = new BookReadRepository(db);
    const bookFactory = new BookFactory(bookReadRepository);
    const auditService = new ConsoleAuditService();

    const useCases = {
      getAllBooks: new GetAllBooksQueryHandler(bookReadRepository),
      getBookById: new GetBookByIdQueryHandler(bookReadRepository),
      getReadBooks: new GetReadBooksQueryHandler(bookReadRepository),
      createBook: new CreateBookCommandHandler(bookWriteRepository, bookFactory, eventBus, auditService),
      updateBook: new UpdateBookCommandHandler(bookWriteRepository),
      deleteBook: new DeleteBookCommandHandler(bookWriteRepository),
      rateBook: new RateBookCommandHandler(bookWriteRepository),
      markAsRead: new MarkAsReadCommandHandler(bookWriteRepository),
    };

    const bookController = new BookController(useCases);
    this.router = createBookRouter(bookController);
  }
}