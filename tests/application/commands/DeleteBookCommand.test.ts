import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mocked } from 'vitest';

import { DeleteBookCommandHandler } from '../../../src/application/commands/DeleteBookCommand';
import { IBookWriteRepository } from '../../../src/domain/repositories/IBookWriteRepository';
import { NotFoundError } from '../../../src/domain/errors/NotFoundError';

describe('DeleteBookCommandHandler', () => {
  let handler: DeleteBookCommandHandler;
  let mockWriteRepository: Mocked<IBookWriteRepository>;

  beforeEach(() => {
    mockWriteRepository = {
      findById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    } as unknown as Mocked<IBookWriteRepository>;
    
    handler = new DeleteBookCommandHandler(mockWriteRepository);
  });

  it('повинен успішно видаляти існуючу книгу', async () => {
    mockWriteRepository.delete.mockResolvedValueOnce(true);

    await handler.execute({ id: 1 });

    expect(mockWriteRepository.delete.mock.calls.length).toBe(1);
    
    const deletedId = mockWriteRepository.delete.mock.calls[0][0];
    expect(deletedId).toBe(1);
  });

  it('повинен викидати NotFoundError при спробі видалити неіснуючу книгу', async () => {

    mockWriteRepository.delete.mockResolvedValueOnce(false);

    await expect(handler.execute({ id: 999 }))
      .rejects
      .toThrow(NotFoundError);

    expect(mockWriteRepository.delete.mock.calls.length).toBe(1);
  });
});