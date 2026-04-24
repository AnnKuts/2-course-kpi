import { Request, Response } from 'express';

import { CreateBookCommandHandler } from '../../application/commands/CreateBookCommand';
import { UpdateBookCommandHandler } from '../../application/commands/UpdateBookCommand';
import { DeleteBookCommandHandler } from '../../application/commands/DeleteBookCommand';
import { RateBookCommandHandler } from '../../application/commands/RateBookCommand';
import { MarkAsReadCommandHandler } from '../../application/commands/MarkAsReadCommand';

import { GetAllBooksQueryHandler } from '../../application/queries/GetAllBooksQuery';
import { GetBookByIdQueryHandler } from '../../application/queries/GetBookByIdQuery';
import { GetReadBooksQueryHandler } from '../../application/queries/GetReadBooksQuery';

import { DomainError } from '../../domain/errors/DomainError';
import { CreateBookDto } from '../../schemas/book.schema';

export interface BookControllerUseCases {
  getAllBooks: GetAllBooksQueryHandler;
  getBookById: GetBookByIdQueryHandler;
  getReadBooks: GetReadBooksQueryHandler;
  createBook: CreateBookCommandHandler;
  updateBook: UpdateBookCommandHandler;
  deleteBook: DeleteBookCommandHandler;
  rateBook: RateBookCommandHandler;
  markAsRead: MarkAsReadCommandHandler;
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
    const { limit, offset } = req.query as unknown as { limit: number; offset: number }; 
    const books = await this.useCases.getAllBooks.execute({ limit, offset });
    res.status(200).json(books);
  };

  public getById = async (req: Request, res: Response): Promise<void> => {
    const id = this.extractId(req);
    const book = await this.useCases.getBookById.execute({ id });
    res.status(200).json(book);
  };

  public getReadBooks = async (req: Request, res: Response): Promise<void> => {
    const { limit, offset } = req.query as unknown as { limit: number; offset: number };
    const books = await this.useCases.getReadBooks.execute({ limit, offset });
    res.status(200).json(books);
  };

  public create = async (req: Request, res: Response): Promise<void> => {
    const newBookId = await this.useCases.createBook.execute(req.body as unknown as CreateBookDto);
    res.status(201).json({ id: newBookId }); 
  };

  public update = async (req: Request, res: Response): Promise<void> => {
    const id = this.extractId(req);
    await this.useCases.updateBook.execute({ id, data: req.body as unknown as Partial<CreateBookDto> });
    res.status(204).send();
  };

  public delete = async (req: Request, res: Response): Promise<void> => {
    const id = this.extractId(req);
    await this.useCases.deleteBook.execute({ id });
    res.status(204).send();
  };

  public rate = async (req: Request, res: Response): Promise<void> => {
    const id = this.extractId(req);
    const { rating } = req.body as { rating: unknown };

    if (typeof rating !== 'number') {
      throw new DomainError('Rating must be a number');
    }

    await this.useCases.rateBook.execute({ id, rating });
    res.status(204).send();
  };

  public markAsRead = async (req: Request, res: Response): Promise<void> => {
    const id = this.extractId(req);
    await this.useCases.markAsRead.execute({ id });
    res.status(204).send();
  };
}