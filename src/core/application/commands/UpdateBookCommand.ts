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
    if (!existing) throw new NotFoundError(`Книга з ID ${command.id} не знайдена`);
    
    const updatedBook = await this.bookRepository.update(command.id, command.data);
    if (!updatedBook) throw new DomainError('Помилка оновлення');
  }
}