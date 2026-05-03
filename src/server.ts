import express from 'express';

import { BookFactory } from './domain/factories/BookFactory';
import { BookWriteRepository, BookReadRepository, IDatabase } from './infrastructure/repositories/book.repository';
import { errorMiddleware } from './middlewares/error.middleware';
import { BookController } from './presentation/controllers/book.controller';
import { createBookRouter } from './routes/book.router';
import { getDb } from './infrastructure/database/database';

import { CreateBookCommandHandler } from './application/commands/CreateBookCommand';
import { UpdateBookCommandHandler } from './application/commands/UpdateBookCommand';
import { DeleteBookCommandHandler } from './application/commands/DeleteBookCommand';
import { RateBookCommandHandler } from './application/commands/RateBookCommand';
import { MarkAsReadCommandHandler } from './application/commands/MarkAsReadCommand';

import { GetAllBooksQueryHandler } from './application/queries/GetAllBooksQuery';
import { GetBookByIdQueryHandler } from './application/queries/GetBookByIdQuery';
import { GetReadBooksQueryHandler } from './application/queries/GetReadBooksQuery';

const app = express();
app.use(express.json());

const dbProxy: IDatabase = {
  get: (sql, params) => getDb().get(sql, params),
  all: (sql, params) => getDb().all(sql, params),
  run: (sql, params) => getDb().run(sql, params),
};

const writeRepo = new BookWriteRepository(dbProxy);
const readRepo = new BookReadRepository(dbProxy);
const bookFactory = new BookFactory(readRepo);

const useCases = {
  getAllBooks: new GetAllBooksQueryHandler(readRepo),
  getBookById: new GetBookByIdQueryHandler(readRepo),
  getReadBooks: new GetReadBooksQueryHandler(readRepo),
  createBook: new CreateBookCommandHandler(writeRepo, bookFactory),
  updateBook: new UpdateBookCommandHandler(writeRepo),
  deleteBook: new DeleteBookCommandHandler(writeRepo),
  rateBook: new RateBookCommandHandler(writeRepo),
  markAsRead: new MarkAsReadCommandHandler(writeRepo),
};

const bookController = new BookController(useCases);

const bookRouter = createBookRouter(bookController);

app.use('/books', bookRouter);

app.use(errorMiddleware);

export default app;
