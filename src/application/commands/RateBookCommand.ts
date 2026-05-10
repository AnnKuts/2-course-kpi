import { IBookWriteRepository } from '../../domain/repositories/IBookWriteRepository';
import { NotFoundError } from '../../domain/errors/NotFoundError';
import { DomainError } from '../../domain/errors/DomainError';

export type RateBookCommand = { id: number; rating: number };

export class RateBookCommandHandler {
  constructor(private readonly bookRepository: IBookWriteRepository) {}

  public async execute(command: RateBookCommand): Promise<void> {
    const book = await this.bookRepository.findById(command.id);
    if (!book) throw new NotFoundError(`Book with ID ${command.id} not found`);
    
    book.rating = command.rating; 
    const updatedBook = await this.bookRepository.update(command.id, book);
    if (!updatedBook) throw new DomainError('Update failed');
  }
}