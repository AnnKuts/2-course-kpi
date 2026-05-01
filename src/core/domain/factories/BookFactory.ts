import { Book } from '../models/Book';
import { DomainError } from '../errors/DomainError';
import { Genre } from '../models/Genre';

export class BookFactory {
  static create(
    id: number,
    title: string,
    author: string,
    genre: Genre,
    rating: number,
    description: string,
    isRead: boolean
  ): Book {
    if (!title.trim()) {
      throw new DomainError('Поле назва книги не може бути порожнім');
    }
    if (!author.trim()) {
      throw new DomainError('Поле автор не може бути порожнім');
    }

    return new Book(id, title, author, genre, rating, description, isRead);
  }
}