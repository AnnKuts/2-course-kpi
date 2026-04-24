import { BookReadModel } from '../../application/queries/GetAllBooksQuery';

export interface IBookReadRepository {
  findAll(limit?: number, offset?: number): Promise<BookReadModel[]>;
  findById(id: number): Promise<BookReadModel | null>;
  findReadBooks(limit?: number, offset?: number): Promise<BookReadModel[]>;
}