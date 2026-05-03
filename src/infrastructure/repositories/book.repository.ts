import { Book } from '../../domain/models/Book';
import { BookRepository } from '../../domain/repositories/book.repository';
import { BookEntity } from '../entities/book.entity';
import { BookMapper } from '../mappers/book.mapper';
import { getDb } from '../database/database';

interface BookDbRow {
  id: number;
  title: string;
  author: string;
  genre: string;
  rating: number;
  description: string;
  isRead: number; 
}

class BookRepositoryImpl implements BookRepository {
public async findAll(limit: number = 10, offset: number = 0): Promise<Book[]> {
    const db = getDb();
    const rows = await db.all<BookDbRow[]>(
      'SELECT * FROM books LIMIT ? OFFSET ?',
      [limit, offset]
    );
    
    return rows.map((row: BookDbRow) => BookMapper.toDomain({
      ...row,
      isRead: Boolean(row.isRead)
    } as BookEntity));
  }

  public async findById(id: number): Promise<Book | null> {
    const db = getDb();
    const row = await db.get<BookDbRow>('SELECT * FROM books WHERE id = ?', [id]);
    
    if (!row) return null;
    return BookMapper.toDomain({ ...row, isRead: Boolean(row.isRead) } as BookEntity);
  }

  public async findByTitleAndAuthor(title: string, author: string): Promise<Book | null> {
    const db = getDb();
    const row = await db.get<BookDbRow>(
      'SELECT * FROM books WHERE title = ? AND author = ? LIMIT 1',
      [title, author]
    );
    if (!row) return null;
    return BookMapper.toDomain({ ...row, isRead: Boolean(row.isRead) } as BookEntity);
  }

  public async findReadBooks(limit: number = 10, offset: number = 0): Promise<Book[]> {
    const db = getDb();
    const rows = await db.all<BookDbRow[]>(
      'SELECT * FROM books WHERE isRead = 1 LIMIT ? OFFSET ?',
      [limit, offset]
    );
    return rows.map((row: BookDbRow) => BookMapper.toDomain({
      ...row,
      isRead: Boolean(row.isRead)
    } as BookEntity));
  }

  public async create(book: Book): Promise<Book> {
    const db = getDb();
    const entity = BookMapper.toEntity(book);
    
    const result = await db.run(
      `INSERT INTO books (title, author, genre, rating, description, isRead) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [entity.title, entity.author, entity.genre, entity.rating, entity.description, entity.isRead ? 1 : 0]
    );

    return new Book(
      result.lastID!,
      book.title,
      book.author,
      book.genre,
      book.rating,
      book.description,
      book.isRead
    );
  }

  public async update(id: number, data: Partial<Book>): Promise<Book | null> {
    const db = getDb();
    const existing = await this.findById(id);
    if (!existing) return null;

    if (data.title !== undefined) existing.title = data.title;
    if (data.author !== undefined) existing.author = data.author;
    if (data.genre !== undefined) existing.genre = data.genre;
    if (data.rating !== undefined) existing.rating = data.rating;
    if (data.description !== undefined) existing.description = data.description;
    if (data.isRead !== undefined) existing.isRead = data.isRead;

    const entity = BookMapper.toEntity(existing);

    await db.run(
      `UPDATE books SET title = ?, author = ?, genre = ?, rating = ?, description = ?, isRead = ? WHERE id = ?`,
      [entity.title, entity.author, entity.genre, entity.rating, entity.description, entity.isRead ? 1 : 0, id]
    );

    return existing;
  }

  public async delete(id: number): Promise<boolean> {
    const db = getDb();
    const result = await db.run('DELETE FROM books WHERE id = ?', [id]);
    
    return result.changes !== undefined && result.changes > 0;
  }
}

export const bookRepository = new BookRepositoryImpl();