import { IBookWriteRepository } from '../../domain/repositories/IBookWriteRepository';
import { NotFoundError } from '../../domain/errors/NotFoundError';

export type DeleteBookCommand = { id: number };

export class DeleteBookCommandHandler {
  constructor(private readonly bookRepository: IBookWriteRepository) {}

  public async execute(command: DeleteBookCommand): Promise<void> {
    const isDeleted = await this.bookRepository.delete(command.id);
    if (!isDeleted) throw new NotFoundError(`Книга з ID ${command.id} не знайдена`);
  }
}