// here will be repositories for app
import { Book } from '../models/book.model';

class BookRepository {
  private books: Book[] = [];

  public async findAll(): Promise<Book[]> {
    return [...this.books];
  }

  public async findById(id: number): Promise<Book | undefined> {
    const book = this.books.find((book) => book.id === id);
    return book ? { ...book } : undefined;
  }

  public async create(book: Book): Promise<Book> {
    this.books.push(book);
    return { ...book };
  }

  public async update(
    id: number,
    updatedData: Omit<Partial<Book>, 'id'>,
  ): Promise<Book | null> {
    const index = this.books.findIndex((book) => book.id === id);
    if (index === -1) return null;

    this.books[index] = { ...this.books[index], ...updatedData };
    return { ...this.books[index] };
  }

  public async delete(id: number): Promise<boolean> {
    const index = this.books.findIndex((book) => book.id === id);
    if (index === -1) return false;

    this.books.splice(index, 1);
    return true;
  }
}

export const bookRepository = new BookRepository();
