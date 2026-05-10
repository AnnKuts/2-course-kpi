import express from 'express';
import { Database } from 'sqlite';

import { BookFactory } from './domain/factories/BookFactory';
import { BookWriteRepository, BookReadRepository, IDatabase } from './infrastructure/repositories/book.repository';
import { BookController } from './presentation/controllers/book.controller';
import { createBookRouter } from './routes/book.router';
import { errorMiddleware } from './middlewares/error.middleware';

import { CreateBookCommandHandler } from './application/commands/CreateBookCommand';
import { UpdateBookCommandHandler } from './application/commands/UpdateBookCommand';
import { DeleteBookCommandHandler } from './application/commands/DeleteBookCommand';
import { RateBookCommandHandler } from './application/commands/RateBookCommand';
import { MarkAsReadCommandHandler } from './application/commands/MarkAsReadCommand';

import { GetAllBooksQueryHandler } from './application/queries/GetAllBooksQuery';
import { GetBookByIdQueryHandler } from './application/queries/GetBookByIdQuery';
import { GetReadBooksQueryHandler } from './application/queries/GetReadBooksQuery';

import { InMemoryEventBus } from './infrastructure/events/InMemoryEventBus';
import { ConsoleAuditService } from './audit/ConsoleAuditService';

export const createServer = (db: Database) => {
  const app = express();
  app.use(express.json());

  const bookWriteRepository = new BookWriteRepository(db as unknown as IDatabase);
  const bookReadRepository = new BookReadRepository(db as unknown as IDatabase);
  const bookFactory = new BookFactory(bookReadRepository);

  const eventBus = new InMemoryEventBus();
  const auditService = new ConsoleAuditService();
  eventBus.subscribe('BookCreatedEvent', auditService);

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
  const bookRouter = createBookRouter(bookController);

  app.use('/books', bookRouter);
  app.use(errorMiddleware);

  return app;
};
