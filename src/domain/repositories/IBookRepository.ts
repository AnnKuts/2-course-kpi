import { Book } from '../models/Book';

export interface IBookRepository {
  findAll(limit?: number, offset?: number): Promise<Book[]>;
  findById(id: number): Promise<Book | null>;
  findReadBooks(limit?: number, offset?: number): Promise<Book[]>;
  create(book: Book): Promise<Book>;
  update(id: number, data: Partial<Book>): Promise<Book | null>;
  delete(id: number): Promise<boolean>;
}