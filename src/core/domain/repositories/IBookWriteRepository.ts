import { Book } from '../models/Book';

export interface IBookWriteRepository {
  findById(id: number): Promise<Book | null>;
  create(book: Book): Promise<Book>;
  update(id: number, data: Partial<Book>): Promise<Book | null>;
  delete(id: number): Promise<boolean>;
}