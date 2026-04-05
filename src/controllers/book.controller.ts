//here will be controllers
import { Request, Response } from 'express';
import { bookService } from '../services/book.service';
import { Book } from '../models/book.model';

class BookController {
  private getIdOrRespond(req: Request, res: Response): number | null {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: 'ID має бути числом' });
      return null;
    }
    return id;
  }

  public async getAll(req: Request, res: Response): Promise<void> {
    try {
      const books = await bookService.getAllBooks();
      res.status(200).json(books);
    } catch {
      res.status(500).json({ message: 'Помилка сервера' });
    }
  }

  public async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = this.getIdOrRespond(req, res);
      if (id === null) return;

      const book = await bookService.getBookById(id);
      res.status(200).json(book);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(404).json({ message: error.message });
      } else {
        res.status(404).json({ message: 'Unknown error' });
      }
    }
  }

  public async create(req: Request, res: Response): Promise<void> {
    try {
      const newBook = await bookService.createBook(
        req.body as Omit<Book, 'id'>
      );
      res.status(201).json(newBook);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(400).json({ message: 'Unknown error' });
      }
    }
  }

  public async update(req: Request, res: Response): Promise<void> {
    try {
      const id = this.getIdOrRespond(req, res);
      if (id === null) return;

      const updatedBook = await bookService.updateBook(
        id,
        req.body as Omit<Partial<Book>, 'id'>
      );
      res.status(200).json(updatedBook);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(404).json({ message: error.message });
      } else {
        res.status(404).json({ message: 'Unknown error' });
      }
    }
  }

  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = this.getIdOrRespond(req, res);
      if (id === null) return;

      await bookService.deleteBook(id);
      res.status(200).json({ message: 'Книга видалена' });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(404).json({ message: error.message });
      } else {
        res.status(404).json({ message: 'Unknown error' });
      }
    }
  }
}

export const bookController = new BookController();
