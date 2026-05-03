import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mocked } from 'vitest';

import { CreateBookCommandHandler } from '../../../src/application/commands/CreateBookCommand';
import { IBookWriteRepository } from '../../../src/domain/repositories/IBookWriteRepository';
import { IBookReadRepository } from '../../../src/domain/repositories/IBookReadRepository';
import { BookFactory } from '../../../src/domain/factories/BookFactory';
import { Book } from '../../../src/domain/models/Book';
import { Genre } from '../../../src/domain/models/Genre';

describe('CreateBookCommandHandler', () => {
  let handler: CreateBookCommandHandler;
  let mockWriteRepository: Mocked<IBookWriteRepository>;
  let mockReadRepository: Mocked<IBookReadRepository>;
  let factory: BookFactory;

  beforeEach(() => {
    mockWriteRepository = {
      findById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    mockReadRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      findByTitleAndAuthor: vi.fn().mockResolvedValue(null),
      findReadBooks: vi.fn(),
    };

    factory = new BookFactory(mockReadRepository);
    handler = new CreateBookCommandHandler(mockWriteRepository, factory);
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