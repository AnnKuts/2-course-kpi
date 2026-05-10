import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mocked } from 'vitest';

import { CreateBookCommandHandler } from '../../../src/application/commands/CreateBookCommand';
import { IBookWriteRepository } from '../../../src/domain/repositories/IBookWriteRepository';
import { IBookReadRepository } from '../../../src/domain/repositories/IBookReadRepository';
import { BookFactory } from '../../../src/domain/factories/BookFactory';
import { Book } from '../../../src/domain/models/Book';
import { Genre } from '../../../src/domain/models/Genre';
import { IEventBus } from '../../../src/application/events/EventContracts';
import { IAuditService } from '../../../src/audit/IAuditService';

describe('CreateBookCommandHandler', () => {
  let handler: CreateBookCommandHandler;
  let mockWriteRepository: Mocked<IBookWriteRepository>;
  let mockReadRepository: Mocked<IBookReadRepository>;
  let mockEventBus: Mocked<IEventBus>;
  let mockAuditService: Mocked<IAuditService>;
  let factory: BookFactory;

  const makeBook = (id = 1) =>
    new Book(id, 'Test Book', 'Test Author', Genre.FICTION, 5, 'Test Desc', false);

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

    mockEventBus = {
      publish: vi.fn(),
      subscribe: vi.fn(),
    };

    mockAuditService = {
      logBookCreated: vi.fn(),
    };

    factory = new BookFactory(mockReadRepository);
    handler = new CreateBookCommandHandler(
      mockWriteRepository,
      factory,
      mockEventBus,
      mockAuditService,
    );
  });

  const baseCommand = {
    title: 'Test Book',
    author: 'Test Author',
    genre: Genre.FICTION,
    rating: 5,
    description: 'Test Desc',
    isRead: false,
  };

  it('should create a book, call sync audit, and publish async event', async () => {
    mockWriteRepository.create.mockResolvedValueOnce(makeBook(1));

    const resultId = await handler.execute(baseCommand);

    expect(resultId).toBe(1);
    expect(mockWriteRepository.create).toHaveBeenCalledOnce();

    expect(mockAuditService.logBookCreated).toHaveBeenCalledOnce();
    expect(mockAuditService.logBookCreated).toHaveBeenCalledWith(
      expect.objectContaining({ eventName: 'BookCreatedEvent', bookId: 1 }),
    );

    expect(mockEventBus.publish).toHaveBeenCalledOnce();
    expect(mockEventBus.publish).toHaveBeenCalledWith(
      expect.objectContaining({ eventName: 'BookCreatedEvent' }),
    );
  });

  it('should still create book and publish event when sync audit throws (error is swallowed)', async () => {
    mockWriteRepository.create.mockResolvedValueOnce(makeBook(2));
    mockAuditService.logBookCreated.mockImplementation(() => {
      throw new Error('Audit service is unavailable');
    });

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const resultId = await handler.execute(baseCommand);

    expect(resultId).toBe(2);
    expect(mockWriteRepository.create).toHaveBeenCalledOnce();
    expect(mockAuditService.logBookCreated).toHaveBeenCalledOnce();
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Sync audit failed'),
      expect.any(Error),
    );
    expect(mockEventBus.publish).toHaveBeenCalledOnce();

    consoleSpy.mockRestore();
  });

  it('should call sync audit before publishing the async event', async () => {
    const callOrder: string[] = [];

    mockWriteRepository.create.mockResolvedValueOnce(makeBook(3));
    mockAuditService.logBookCreated.mockImplementation(() => {
      callOrder.push('sync');
    });
    mockEventBus.publish.mockImplementation(() => {
      callOrder.push('async');
    });

    await handler.execute(baseCommand);

    expect(callOrder).toEqual(['sync', 'async']);
  });
});