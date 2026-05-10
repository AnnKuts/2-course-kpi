import { IBookWriteRepository } from '../../domain/repositories/IBookWriteRepository';
import { NotFoundError } from '../../domain/errors/NotFoundError';
import { DomainError } from '../../domain/errors/DomainError';
import { CreateBookCommand } from './CreateBookCommand';

export type UpdateBookCommand = {
  id: number;
  data: Partial<CreateBookCommand>;
};

export class UpdateBookCommandHandler {
  constructor(private readonly bookRepository: IBookWriteRepository) {}

  public async execute(command: UpdateBookCommand): Promise<void> {
    const existing = await this.bookRepository.findById(command.id);
    if (!existing) throw new NotFoundError(`Book with ID ${command.id} not found`);
    
    if (command.data.title !== undefined && !command.data.title.trim()) {
      throw new DomainError('Book title cannot be empty');
    }
    if (command.data.author !== undefined && !command.data.author.trim()) {
      throw new DomainError('Author name cannot be empty');
    }

    const updatedBook = await this.bookRepository.update(command.id, command.data);
    if (!updatedBook) throw new DomainError('Update failed');
  }
}