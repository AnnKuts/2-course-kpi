/* eslint-disable @typescript-eslint/unbound-method */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BookFactory } from '../../src/domain/factories/BookFactory';
import { BookRepository } from '../../src/domain/repositories/book.repository';
import { Genre } from '../../src/domain/models/Genre';
import { DomainError } from '../../src/domain/errors/DomainError';
import { Book } from '../../src/domain/models/Book';

describe('Book Domain Model & Factory', () => {
  let mockRepository: BookRepository;
  let factory: BookFactory;

  beforeEach(() => {
    mockRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      findByTitleAndAuthor: vi.fn().mockResolvedValue(null),
      findReadBooks: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    factory = new BookFactory(mockRepository);
  });

  it('should successfully create a valid book', async () => {
    const book = await factory.create(1, '1984', 'George Orwell', Genre.FICTION, 5, 'Dystopia', false);

    expect(book.title).toBe('1984');
    expect(book.rating).toBe(5);
    expect(book.isRead).toBe(false);
  });

  it('should throw DomainError if title is empty', async () => {
    await expect(
      factory.create(2, '   ', 'Author', Genre.FICTION, 4, 'Desc', false)
    ).rejects.toThrow(DomainError);
  });

  it('should throw DomainError if author is empty', async () => {
    await expect(
      factory.create(2, 'Title', '   ', Genre.FICTION, 4, 'Desc', false)
    ).rejects.toThrow(DomainError);
  });

  it('should throw DomainError for invalid rating above 5', async () => {
    await expect(
      factory.create(3, 'Title', 'Author', Genre.FICTION, 10, 'Desc', false)
    ).rejects.toThrow(DomainError);
  });

  it('should throw DomainError for invalid rating below 1', async () => {
    await expect(
      factory.create(3, 'Title', 'Author', Genre.FICTION, 0, 'Desc', false)
    ).rejects.toThrow(DomainError);
  });

  it('should throw DomainError when book with same title and author already exists', async () => {
    const existingBook = new Book(1, '1984', 'George Orwell', Genre.FICTION, 5, 'Dystopia', true);
    vi.mocked(mockRepository.findByTitleAndAuthor).mockResolvedValue(existingBook);

    await expect(
      factory.create(2, '1984', 'George Orwell', Genre.FICTION, 4, 'Another desc', false)
    ).rejects.toThrow(DomainError);
  });

  it('should throw DomainError when setting an invalid rating via setter', async () => {
    const book = await factory.create(1, '1984', 'George Orwell', Genre.FICTION, 5, 'Dystopia', false);
    expect(() => {
      book.rating = 6;
    }).toThrow(DomainError);
  });

  it('markAsRead should change status to read', async () => {
    const book = await factory.create(4, 'Title', 'Author', Genre.FICTION, 4, 'Desc', false);
    book.markAsRead();
    expect(book.isRead).toBe(true);
  });
});

