import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mocked } from 'vitest';

import { UpdateBookCommandHandler } from '../../../src/application/commands/UpdateBookCommand';
import { IBookWriteRepository } from '../../../src/domain/repositories/IBookWriteRepository';
import { Book } from '../../../src/domain/models/Book';
import { Genre } from '../../../src/domain/models/Genre';
import { NotFoundError } from '../../../src/domain/errors/NotFoundError';

describe('UpdateBookCommandHandler', () => {
  let handler: UpdateBookCommandHandler;
  let mockWriteRepository: Mocked<IBookWriteRepository>;

  beforeEach(() => {
    mockWriteRepository = {
      findById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    } as unknown as Mocked<IBookWriteRepository>;

    handler = new UpdateBookCommandHandler(mockWriteRepository);
  });

  it('повинен успішно оновлювати існуючу книгу', async () => {
    const existingBook = new Book(1, 'Стара назва', 'Автор', Genre.FICTION, 4, 'Опис', false);
    
    mockWriteRepository.findById.mockResolvedValueOnce(existingBook);
    mockWriteRepository.update.mockResolvedValueOnce(existingBook); 

    const updateData = { title: 'Нова назва', rating: 5 };

    await handler.execute({ id: 1, data: updateData });

    expect(mockWriteRepository.update.mock.calls.length).toBe(1);

    const passedId = mockWriteRepository.update.mock.calls[0][0];
    expect(passedId).toBe(1);

    const passedData = mockWriteRepository.update.mock.calls[0][1];
    expect(passedData.title).toBe('Нова назва');
    expect(passedData.rating).toBe(5);
  });

  it('повинен викидати NotFoundError, якщо книги не існує', async () => {

    mockWriteRepository.findById.mockResolvedValueOnce(null);

    await expect(handler.execute({ id: 999, data: { title: 'Тест' } }))
      .rejects
      .toThrow(NotFoundError);

    expect(mockWriteRepository.update.mock.calls.length).toBe(0);
  });
});