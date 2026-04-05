import { Request, Response } from 'express';

import { bookService } from '../services/book.service';
import { getErrorMessage, getErrorStatus } from '../utils/errorHandler';

class BookController {
  private handleError(res: Response, error: unknown): void {
    const status = getErrorStatus(error);
    const message = getErrorMessage(error);
    res.status(status).json({ message });
  }

  private getIdOrRespond(req: Request, res: Response): number | null {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: 'ID must be a number' });
      return null;
    }
    return id;
  }

  public async getAll(req: Request, res: Response): Promise<void> {
    try {
      const books = await bookService.getAllBooks();
      res.status(200).json(books);
    } catch (error: unknown) {
      this.handleError(res, error);
    }
  }

  public async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = this.getIdOrRespond(req, res);
      if (id === null) return;

      const book = await bookService.getBookById(id);
      res.status(200).json(book);
    } catch (error: unknown) {
      this.handleError(res, error);
    }
  }

  public async create(req: Request, res: Response): Promise<void> {
    try {
      const newBook = await bookService.createBook(req.body);
      res.status(201).json(newBook);
    } catch (error: unknown) {
      this.handleError(res, error);
    }
  }

  public async update(req: Request, res: Response): Promise<void> {
    try {
      const id = this.getIdOrRespond(req, res);
      if (id === null) return;

      const updatedBook = await bookService.updateBook(id, req.body);
      res.status(200).json(updatedBook);
    } catch (error: unknown) {
      this.handleError(res, error);
    }
  }

  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = this.getIdOrRespond(req, res);
      if (id === null) return;

      await bookService.deleteBook(id);
      res.status(204).send();
    } catch (error: unknown) {
      this.handleError(res, error);
    }
  }
}

export const bookController = new BookController();
