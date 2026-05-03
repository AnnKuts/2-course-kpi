import { Book } from '../../domain/models/Book';
import { BookFactory } from '../../domain/factories/BookFactory';
import { BookRepository } from '../../domain/repositories/book.repository';
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
  constructor(private readonly bookRepository: BookRepository) {}
  public async execute(limit: number = 10, offset: number = 0): Promise<Book[]> {
    return await this.bookRepository.findAll(limit, offset);
  }
}

export class GetBookByIdUseCase {
  constructor(private readonly bookRepository: BookRepository) {}
  public async execute(id: number): Promise<Book> {
    const book = await this.bookRepository.findById(id);
    if (!book) throw new NotFoundError(`Book with ID ${id} not found`);
    return book;
  }
}

export class CreateBookUseCase {
  constructor(
    private readonly bookRepository: BookRepository,
    private readonly bookFactory: BookFactory
  ) {}
  public async execute(data: CreateBookCommand): Promise<Book> {
    const newBook = await this.bookFactory.create(
      0, data.title, data.author, data.genre, data.rating, data.description, data.isRead
    );
    return await this.bookRepository.create(newBook);
  }
}

export class UpdateBookUseCase {
  constructor(private readonly bookRepository: BookRepository) {}
  public async execute(id: number, data: Partial<CreateBookCommand>): Promise<Book> {
    const existing = await this.bookRepository.findById(id);
    if (!existing) throw new NotFoundError(`Book with ID ${id} not found`);

    if (data.title !== undefined && !data.title.trim()) {
      throw new DomainError('Book title cannot be empty');
    }
    if (data.author !== undefined && !data.author.trim()) {
      throw new DomainError('Author name cannot be empty');
    }

    const updatedBook = await this.bookRepository.update(id, data);
    if (!updatedBook) throw new DomainError('Update failed');
    return updatedBook;
  }
}

export class DeleteBookUseCase {
  constructor(private readonly bookRepository: BookRepository) {}
  public async execute(id: number): Promise<void> {
    const isDeleted = await this.bookRepository.delete(id);
    if (!isDeleted) throw new NotFoundError(`Book with ID ${id} not found`);
  }
}

export class GetReadBooksUseCase {
  constructor(private readonly bookRepository: BookRepository) {}
  public async execute(limit: number = 10, offset: number = 0): Promise<Book[]> {
    return await this.bookRepository.findReadBooks(limit, offset);
  }
}

export class RateBookUseCase {
  constructor(private readonly bookRepository: BookRepository) {}
  public async execute(id: number, rating: number): Promise<Book> {
    const book = await this.bookRepository.findById(id);
    if (!book) throw new NotFoundError(`Book with ID ${id} not found`);
    book.rating = rating;
    const updatedBook = await this.bookRepository.update(id, book);
    if (!updatedBook) throw new DomainError('Update failed');
    return updatedBook;
  }
}

export class MarkAsReadUseCase {
  constructor(private readonly bookRepository: BookRepository) {}
  public async execute(id: number): Promise<Book> {
    const book = await this.bookRepository.findById(id);
    if (!book) throw new NotFoundError(`Book with ID ${id} not found`);
    book.markAsRead();
    const updatedBook = await this.bookRepository.update(id, book);
    if (!updatedBook) throw new DomainError('Update failed');
    return updatedBook;
  }
}