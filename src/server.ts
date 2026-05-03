import express from 'express';
import { bookRepository } from './infrastructure/repositories/book.repository';
import { BookFactory } from './domain/factories/BookFactory';
import { BookController } from './presentation/controllers/book.controller';
import { createBookRouter } from './routes/book.router';
import {
  GetAllBooksUseCase, GetBookByIdUseCase, CreateBookUseCase,
  UpdateBookUseCase, DeleteBookUseCase, GetReadBooksUseCase,
  RateBookUseCase, MarkAsReadUseCase
} from './application/use-cases/BookUseCases';
import { errorMiddleware } from './middlewares/error.middleware';

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
  markAsRead: new MarkAsReadUseCase(bookRepository)
};

const bookController = new BookController(useCases);

const bookRouter = createBookRouter(bookController);

app.use('/books', bookRouter);

app.use(errorMiddleware);

export default app;

