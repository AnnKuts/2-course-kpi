import { Book } from '../models/Book';
import { DomainError } from '../errors/DomainError';
import { Genre } from '../models/Genre';
import { BookRepository } from '../repositories/book.repository';

export class BookFactory {
  constructor(private readonly bookRepository: BookRepository) {}

  async create(
    id: number,
    title: string,
    author: string,
    genre: Genre,
    rating: number,
    description: string,
    isRead: boolean
  ): Promise<Book> {
    if (!title.trim()) {
      throw new DomainError('Book title cannot be empty');
    }
    if (!author.trim()) {
      throw new DomainError('Author name cannot be empty');
    }

    const duplicate = await this.bookRepository.findByTitleAndAuthor(title, author);
    if (duplicate) {
      throw new DomainError(
        `Book '${title.trim()}' by '${author.trim()}' already exists in the library`
      );
    }

    return new Book(id, title, author, genre, rating, description, isRead);
  }
}