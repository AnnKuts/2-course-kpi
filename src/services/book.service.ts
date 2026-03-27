// here will be services

import { bookRepository } from '../repos/book.repository';
import { Book } from '../models/book.model';

export type CreateBookDto = Omit<Book, 'id'>;

class BookService {
  private currentId = 1;

  public async getAllBooks(): Promise<Book[]> {
    return await bookRepository.findAll();
  }

  public async getBookById(id: number): Promise<Book> {
    const book = await bookRepository.findById(id);
    if (!book) {
      throw new Error(`Книга з ID ${id} не знайдена`);
    }
    return book;
  }

  public async createBook(bookDto: CreateBookDto): Promise<Book> {
    if (!bookDto.title || !bookDto.author) {
      throw new Error(`Назва та автор обов'язкові`);
    }

    const newBook: Book = {
      id: this.currentId++,
      ...bookDto,
    };

    return await bookRepository.create(newBook);
  }

  public async updateBook(id: number, bookDto: Omit<Partial<Book>, 'id'>): Promise<Book> {
    const updatedBook = await bookRepository.update(id, bookDto);
    if (!updatedBook) {
      throw new Error(`Неможливо оновити: Книга з ID ${id} не знайдена`);
    }
    return updatedBook;
  }

  public async deleteBook(id: number): Promise<void> {
    const isDeleted = await bookRepository.delete(id);
    if (!isDeleted) {
      throw new Error(`Неможливо видалити: Книга з ID ${id} не знайдена`);
    }
  }
}

export const bookService = new BookService();