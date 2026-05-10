import { Book } from '../../domain/models/Book';
import { IBookWriteRepository } from '../../domain/repositories/IBookWriteRepository';
import { IBookReadRepository } from '../../domain/repositories/IBookReadRepository';
import { BookEntity } from '../entities/BookEntity';
import { BookMapper } from '../mappers/BookMapper';
import { BookReadModel } from '../../application/queries/GetAllBooksQuery';

type SqlValue = string | number | boolean | null;
export interface IDatabase {
  get<T>(sql: string, params?: SqlValue[]): Promise<T | undefined>;
  all<T>(sql: string, params?: SqlValue[]): Promise<T>;
  run(sql: string, params?: SqlValue[]): Promise<{ lastID?: number; changes?: number }>;
}

interface BookDbRow {
  id: number;
  title: string;
  author: string;
  genre: string;
  rating: number;
  description: string;
  isRead: number; 
}

export class BookWriteRepository implements IBookWriteRepository {
  constructor(private readonly db: IDatabase) {}

  public async findById(id: number): Promise<Book | null> {
    const row = await this.db.get<BookDbRow>('SELECT * FROM books WHERE id = ?', [id]);
    if (!row) return null;
    return BookMapper.toDomain({ ...row, isRead: Boolean(row.isRead) } as BookEntity);
  }

  public async create(book: Book): Promise<Book> {
    const entity = BookMapper.toEntity(book);
    const result = await this.db.run(
      `INSERT INTO books (title, author, genre, rating, description, isRead) VALUES (?, ?, ?, ?, ?, ?)`,
      [entity.title, entity.author, entity.genre, entity.rating, entity.description, entity.isRead ? 1 : 0]
    );
    return new Book(result.lastID!, book.title, book.author, book.genre, book.rating, book.description, book.isRead);
  }

  public async update(id: number, data: Partial<Book>): Promise<Book | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    if (data.title !== undefined) existing.title = data.title;
    if (data.author !== undefined) existing.author = data.author;
    if (data.genre !== undefined) existing.genre = data.genre;
    if (data.rating !== undefined) existing.rating = data.rating;
    if (data.description !== undefined) existing.description = data.description;
    if (data.isRead !== undefined) existing.isRead = data.isRead;

    const entity = BookMapper.toEntity(existing);
    await this.db.run(
      `UPDATE books SET title = ?, author = ?, genre = ?, rating = ?, description = ?, isRead = ? WHERE id = ?`,
      [entity.title, entity.author, entity.genre, entity.rating, entity.description, entity.isRead ? 1 : 0, id]
    );
    return existing;
  }

  public async delete(id: number): Promise<boolean> {
    const result = await this.db.run('DELETE FROM books WHERE id = ?', [id]);
    return result.changes !== undefined && result.changes > 0;
  }
}

export class BookReadRepository implements IBookReadRepository {
  constructor(private readonly db: IDatabase) {}

  private mapRowToReadModel = (row: BookDbRow): BookReadModel => {
    return {
      id: row.id,
      title: row.title,
      author: row.author,
      genre: row.genre,
      rating: row.rating,
      isRead: Boolean(row.isRead)
    };
  };

  public async findAll(limit: number = 10, offset: number = 0): Promise<BookReadModel[]> {
    const rows = await this.db.all<BookDbRow[]>('SELECT * FROM books ORDER BY id LIMIT ? OFFSET ?', [limit, offset]);
    return rows.map(this.mapRowToReadModel);
  }

  public async findById(id: number): Promise<BookReadModel | null> {
    const row = await this.db.get<BookDbRow>('SELECT * FROM books WHERE id = ?', [id]);
    if (!row) return null;
    return this.mapRowToReadModel(row);
  }

  public async findByTitleAndAuthor(title: string, author: string): Promise<BookReadModel | null> {
    const row = await this.db.get<BookDbRow>(
      'SELECT * FROM books WHERE title = ? AND author = ? LIMIT 1',
      [title, author],
    );
    if (!row) return null;
    return this.mapRowToReadModel(row);
  }

  public async findReadBooks(limit: number = 10, offset: number = 0): Promise<BookReadModel[]> {
    const rows = await this.db.all<BookDbRow[]>(
      'SELECT * FROM books WHERE isRead = 1 ORDER BY id LIMIT ? OFFSET ?',
      [limit, offset]
    );
    return rows.map(this.mapRowToReadModel);
  }
}