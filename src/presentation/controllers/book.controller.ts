import { Request, Response } from 'express';

import {
  CreateBookUseCase,
  DeleteBookUseCase,
  GetAllBooksUseCase,
  GetBookByIdUseCase,
  GetReadBooksUseCase,
  MarkAsReadUseCase,
  RateBookUseCase,
  UpdateBookUseCase,
} from '../../application/use-cases/BookUseCases';
import { DomainError } from '../../domain/errors/DomainError';
import { createBookSchema, paginationSchema } from '../../schemas/book.schema';

export interface BookControllerUseCases {
  getAllBooks: GetAllBooksUseCase;
  getBookById: GetBookByIdUseCase;
  createBook: CreateBookUseCase;
  updateBook: UpdateBookUseCase;
  deleteBook: DeleteBookUseCase;
  getReadBooks: GetReadBooksUseCase;
  rateBook: RateBookUseCase;
  markAsRead: MarkAsReadUseCase;
}

export class BookController {
  constructor(private readonly useCases: BookControllerUseCases) {}

  private extractId = (req: Request): number => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      throw new DomainError('ID must be a number');
    }
    return id;
  };

  public getAll = async (req: Request, res: Response): Promise<void> => {
    const { limit, offset } = paginationSchema.parse(req.query);
    const books = await this.useCases.getAllBooks.execute(limit, offset);
    res.status(200).json(books);
  };

  public getById = async (req: Request, res: Response): Promise<void> => {
    const id = this.extractId(req);
    const book = await this.useCases.getBookById.execute(id);
    res.status(200).json(book);
  };

  public create = async (req: Request, res: Response): Promise<void> => {
    const parsedData = createBookSchema.parse(req.body);
    const newBook = await this.useCases.createBook.execute(parsedData);
    res.status(201).json(newBook);
  };

  public update = async (req: Request, res: Response): Promise<void> => {
    const id = this.extractId(req);
    const parsedData = createBookSchema.partial().parse(req.body);
    const updatedBook = await this.useCases.updateBook.execute(id, parsedData);
    res.status(200).json(updatedBook);
  };

  public delete = async (req: Request, res: Response): Promise<void> => {
    const id = this.extractId(req);
    await this.useCases.deleteBook.execute(id);
    res.status(204).send();
  };

  public getReadBooks = async (req: Request, res: Response): Promise<void> => {
    const { limit, offset } = paginationSchema.parse(req.query);
    const books = await this.useCases.getReadBooks.execute(limit, offset);
    res.status(200).json(books);
  };

  public rate = async (req: Request, res: Response): Promise<void> => {
    const id = this.extractId(req);
    const { rating } = req.body as { rating: unknown };

    if (typeof rating !== 'number') {
      throw new DomainError('Rating must be a number');
    }

    const updatedBook = await this.useCases.rateBook.execute(id, rating);
    res.status(200).json(updatedBook);
  };

  public markAsRead = async (req: Request, res: Response): Promise<void> => {
    const id = this.extractId(req);
    const updatedBook = await this.useCases.markAsRead.execute(id);
    res.status(200).json(updatedBook);
  };
}
