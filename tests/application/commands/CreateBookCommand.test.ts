import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mocked } from 'vitest';

import { CreateBookCommandHandler } from '../../../src/application/commands/CreateBookCommand';
import { IBookWriteRepository } from '../../../src/domain/repositories/IBookWriteRepository';
import { Book } from '../../../src/domain/models/Book';
import { Genre } from '../../../src/domain/models/Genre';
import { IEventBus } from '../../../src/application/events/EventContracts';

describe('CreateBookCommandHandler', () => {
  let handler: CreateBookCommandHandler;
  let mockWriteRepository: Mocked<IBookWriteRepository>;
  let mockEventBus: Mocked<IEventBus>;

  beforeEach(() => {
    mockWriteRepository = {
      findById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    mockEventBus = {
      publish: vi.fn(),
      subscribe: vi.fn(),
    };

    handler = new CreateBookCommandHandler(mockWriteRepository, mockEventBus);
  });

  it('повинен успішно створити книгу, зберегти в репозиторій та опублікувати подію', async () => {
    const command = {
      title: 'Test Book',
      author: 'Test Author',
      genre: Genre.FICTION,
      rating: 5,
      description: 'Test Desc',
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
    
    expect(mockEventBus.publish.mock.calls.length).toBe(1);
    
    const savedBook = mockWriteRepository.create.mock.calls[0][0];
    expect(savedBook).toBeInstanceOf(Book);
    expect(savedBook.title).toBe('Test Book');
  });
});