import { IBookReadRepository } from '../../domain/repositories/IBookReadRepository';

export type BookReadModel = {
  id: number;
  title: string;
  author: string;
  genre: string;
  rating: number;
  isRead: boolean;
};

export type GetAllBooksQuery = {
  limit: number;
  offset: number;
};

export class GetAllBooksQueryHandler {
    constructor(private readonly bookRepository: IBookReadRepository) {}

  public async execute(query: GetAllBooksQuery): Promise<BookReadModel[]> {
    const books = await this.bookRepository.findAll(query.limit, query.offset);

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