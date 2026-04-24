import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mocked } from 'vitest';

import { CreateBookCommandHandler } from '../../../src/application/commands/CreateBookCommand';
import { IBookWriteRepository } from '../../../src/domain/repositories/IBookWriteRepository';
import { Book } from '../../../src/domain/models/Book';
import { Genre } from '../../../src/domain/models/Genre';

describe('CreateBookCommandHandler', () => {
  let handler: CreateBookCommandHandler;

  let mockWriteRepository: Mocked<IBookWriteRepository>;

  beforeEach(() => {
    mockWriteRepository = {
      findById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    handler = new CreateBookCommandHandler(mockWriteRepository);
  });

  it('повинен створювати книгу та повертати її ID', async () => {
    const command = {
      title: 'Тестова книга',
      author: 'Тестовий автор',
      genre: Genre.FICTION,
      rating: 5,
      description: 'Опис тестової книги',
      isRead: false,
    };

    const createdBook = new Book(
      1, command.title, command.author, command.genre, 
      command.rating, command.description, command.isRead
    );
    mockWriteRepository.create.mockResolvedValueOnce(createdBook);

    const resultId = await handler.execute(command);

    expect(resultId).toBe(1);

    expect(mockWriteRepository.create.mock.calls.length).toBe(1);

    const savedBook = mockWriteRepository.create.mock.calls[0][0];
    
    expect(savedBook).toBeInstanceOf(Book);
    expect(savedBook.title).toBe('Тестова книга');
  });
});