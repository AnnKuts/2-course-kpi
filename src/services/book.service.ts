import { Book } from '../models/book.model';
import { bookRepository } from '../repos/book.repository';
import { CreateBookDto, createBookSchema } from '../schemas/book.schema';
import { NotFoundError } from '../utils/httpErrors';

class BookService {
  private currentId = 1;

  public async getAllBooks(): Promise<Book[]> {
    return await bookRepository.findAll();
  }

  public async getBookById(id: number): Promise<Book> {
    const book = await bookRepository.findById(id);
    if (!book) {
      throw new NotFoundError(`Book with ID ${id} not found`);
    }
    return book;
  }

  public async createBook(data: unknown): Promise<Book> {
    const parsed: CreateBookDto = createBookSchema.parse(data);

    const newBook: Book = {
      id: this.currentId++,
      ...parsed,
    };

    return await bookRepository.create(newBook);
  }

  public async updateBook(id: number, data: unknown): Promise<Book> {
    const existing = await bookRepository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Book with ID ${id} not found`);
    }

    const parsed = createBookSchema.partial().parse(data);

    const updatedBook = await bookRepository.update(id, parsed);
    if (!updatedBook) {
      throw new NotFoundError('Failed to update book');
    }

    return updatedBook;
  }

  public async deleteBook(id: number): Promise<void> {
    const isDeleted = await bookRepository.delete(id);
    if (!isDeleted) {
      throw new NotFoundError(`Book with ID ${id} not found`);
    }
  }
}

export const bookService = new BookService();
