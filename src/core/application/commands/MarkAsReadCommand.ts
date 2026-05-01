import { IBookWriteRepository } from '../../domain/repositories/IBookWriteRepository';
import { NotFoundError } from '../../domain/errors/NotFoundError';
import { DomainError } from '../../domain/errors/DomainError';

export type MarkAsReadCommand = { id: number };

export class MarkAsReadCommandHandler {
  constructor(private readonly bookRepository: IBookWriteRepository) {}

  public async execute(command: MarkAsReadCommand): Promise<void> {
    const book = await this.bookRepository.findById(command.id);
    if (!book) throw new NotFoundError(`Книга з ID ${command.id} не знайдена`);
    
    book.markAsRead(); 
    const updatedBook = await this.bookRepository.update(command.id, book);
    if (!updatedBook) throw new DomainError('Помилка оновлення');
  }
}