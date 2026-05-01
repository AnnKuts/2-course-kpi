import { IBookReadRepository } from '../../domain/repositories/IBookReadRepository';
import { NotFoundError } from '../../domain/errors/NotFoundError';
import { BookReadModel } from './GetAllBooksQuery';

export type GetBookByIdQuery = { id: number };

export class GetBookByIdQueryHandler {
    constructor(private readonly bookRepository: IBookReadRepository) {}

  public async execute(query: GetBookByIdQuery): Promise<BookReadModel> {
    const book = await this.bookRepository.findById(query.id);
    if (!book) throw new NotFoundError(`Книга з ID ${query.id} не знайдена`);

    return {
      id: book.id,
      title: book.title,
      author: book.author,
      genre: book.genre,
      rating: book.rating,
      isRead: book.isRead
    };
  }
}