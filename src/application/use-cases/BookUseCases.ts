import { Book } from '../../domain/models/Book';
import { BookFactory } from '../../domain/factories/BookFactory';
import { IBookRepository } from '../../domain/repositories/IBookRepository';
import { DomainError } from '../../domain/errors/DomainError';
import { NotFoundError } from '../../domain/errors/NotFoundError';
import { Genre } from '../../domain/models/Genre';

export type CreateBookCommand = {
  title: string;
  author: string;
  genre: Genre;
  rating: number;
  description: string;
  isRead: boolean;
};

export class GetAllBooksUseCase {
  constructor(private readonly bookRepository: IBookRepository) {}
  public async execute(limit: number = 10, offset: number = 0): Promise<Book[]> {
    return await this.bookRepository.findAll(limit, offset);
  }
}

export class GetBookByIdUseCase {
  constructor(private readonly bookRepository: IBookRepository) {}
  public async execute(id: number): Promise<Book> {
    const book = await this.bookRepository.findById(id);
    if (!book) throw new NotFoundError(`Книга з ID ${id} не знайдена`);
    return book;
  }
}

export class CreateBookUseCase {
  constructor(private readonly bookRepository: IBookRepository) {}
  public async execute(data: CreateBookCommand): Promise<Book> {
    const newBook = BookFactory.create(0, data.title, data.author, data.genre, data.rating, data.description, data.isRead);
    return await this.bookRepository.create(newBook);
  }
}

export class UpdateBookUseCase {
  constructor(private readonly bookRepository: IBookRepository) {}
  public async execute(id: number, data: Partial<CreateBookCommand>): Promise<Book> {
    const existing = await this.bookRepository.findById(id);
    if (!existing) throw new NotFoundError(`Книга з ID ${id} не знайдена`);
    const updatedBook = await this.bookRepository.update(id, data);
    if (!updatedBook) throw new DomainError('Помилка оновлення');
    return updatedBook;
  }
}

export class DeleteBookUseCase {
  constructor(private readonly bookRepository: IBookRepository) {}
  public async execute(id: number): Promise<void> {
    const isDeleted = await this.bookRepository.delete(id);
    if (!isDeleted) throw new NotFoundError(`Книга з ID ${id} не знайдена`);
  }
}

export class GetReadBooksUseCase {
  constructor(private readonly bookRepository: IBookRepository) {}
  public async execute(limit: number = 10, offset: number = 0): Promise<Book[]> {
    return await this.bookRepository.findReadBooks(limit, offset);
  }
}

export class RateBookUseCase {
  constructor(private readonly bookRepository: IBookRepository) {}
  public async execute(id: number, rating: number): Promise<Book> {
    const book = await this.bookRepository.findById(id);
    if (!book) throw new NotFoundError(`Книга з ID ${id} не знайдена`);
    book.rating = rating; 
    const updatedBook = await this.bookRepository.update(id, book);
    if (!updatedBook) throw new DomainError('Помилка оновлення');
    return updatedBook;
  }
}

export class MarkAsReadUseCase {
  constructor(private readonly bookRepository: IBookRepository) {}
  public async execute(id: number): Promise<Book> {
    const book = await this.bookRepository.findById(id);
    if (!book) throw new NotFoundError(`Книга з ID ${id} не знайдена`);
    book.markAsRead(); 
    const updatedBook = await this.bookRepository.update(id, book);
    if (!updatedBook) throw new DomainError('Помилка оновлення');
    return updatedBook;
  }
}