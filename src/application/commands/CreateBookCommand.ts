import { BookFactory } from '../../domain/factories/BookFactory';
import { IBookWriteRepository } from '../../domain/repositories/IBookWriteRepository';
import { Genre } from '../../domain/models/Genre';

export type CreateBookCommand = {
  title: string;
  author: string;
  genre: Genre;
  rating: number;
  description: string;
  isRead: boolean;
};

export class CreateBookCommandHandler {
  constructor(
    private readonly bookRepository: IBookWriteRepository,
    private readonly bookFactory: BookFactory
  ) {}

  public async execute(command: CreateBookCommand): Promise<number> {
    const newBook = await this.bookFactory.create(
      0,
      command.title,
      command.author,
      command.genre,
      command.rating,
      command.description,
      command.isRead
    );
    
    const savedBook = await this.bookRepository.create(newBook);
    
    return savedBook.id; 
  }
}