import { IBookReadRepository } from '../../domain/repositories/IBookReadRepository';
import { BookReadModel } from './GetAllBooksQuery';

export type GetReadBooksQuery = { limit: number; offset: number };

export class GetReadBooksQueryHandler {
    constructor(private readonly bookRepository: IBookReadRepository) {}

  public async execute(query: GetReadBooksQuery): Promise<BookReadModel[]> {
    const books = await this.bookRepository.findReadBooks(query.limit, query.offset);
    
    return books.map(book => ({
      id: book.id,
      title: book.title,
      author: book.author,
      genre: book.genre,
      rating: book.rating,
      isRead: book.isRead
    }));
  }
}