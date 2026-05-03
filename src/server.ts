import express from 'express';

import {
  CreateBookUseCase,
  DeleteBookUseCase,
  GetAllBooksUseCase,
  GetBookByIdUseCase,
  GetReadBooksUseCase,
  MarkAsReadUseCase,
  RateBookUseCase,
  UpdateBookUseCase,
} from './application/use-cases/BookUseCases';
import { BookFactory } from './domain/factories/BookFactory';
import { bookRepository } from './infrastructure/repositories/book.repository';
import { errorMiddleware } from './middlewares/error.middleware';
import { BookController } from './presentation/controllers/book.controller';
import { createBookRouter } from './routes/book.router';

const app = express();
app.use(express.json());

const bookFactory = new BookFactory(bookRepository);

const useCases = {
  getAllBooks: new GetAllBooksUseCase(bookRepository),
  getBookById: new GetBookByIdUseCase(bookRepository),
  createBook: new CreateBookUseCase(bookRepository, bookFactory),
  updateBook: new UpdateBookUseCase(bookRepository),
  deleteBook: new DeleteBookUseCase(bookRepository),
  getReadBooks: new GetReadBooksUseCase(bookRepository),
  rateBook: new RateBookUseCase(bookRepository),
  markAsRead: new MarkAsReadUseCase(bookRepository),
};

const bookController = new BookController(useCases);

const bookRouter = createBookRouter(bookController);

app.use('/books', bookRouter);

app.use(errorMiddleware);

export default app;
