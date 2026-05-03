import { describe, it, expect, vi, beforeEach, Mocked } from 'vitest';
import {
  CreateBookUseCase,
  RateBookUseCase,
  GetBookByIdUseCase,
  DeleteBookUseCase
} from '../../src/application/use-cases/BookUseCases';
import { BookRepository } from '@src/domain/repositories/book.repository';
import { BookFactory } from '../../src/domain/factories/BookFactory';
import { Book } from '../../src/domain/models/Book';
import { Genre } from '../../src/domain/models/Genre';
import { NotFoundError } from '../../src/domain/errors/NotFoundError';
import { DomainError } from '../../src/domain/errors/DomainError';

describe('Book Use Cases', () => {
  let mockRepository: Mocked<BookRepository>;

  beforeEach(() => {
    mockRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      findReadBooks: vi.fn(),
      findByTitleAndAuthor: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
  });

  describe('CreateBookUseCase', () => {
    it('should successfully create a book', async () => {
      const mockFactory = {
        create: vi.fn().mockResolvedValue(new Book(1, 'Title', 'Author', Genre.FICTION, 5, 'Desc', false)),
      } as unknown as BookFactory;

      const useCase = new CreateBookUseCase(mockRepository, mockFactory);
      const fakeBook = new Book(1, 'Title', 'Author', Genre.FICTION, 5, 'Desc', false);
      mockRepository.create.mockResolvedValue(fakeBook);

      const result = await useCase.execute({
        title: 'Title',
        author: 'Author',
        genre: Genre.FICTION,
        rating: 5,
        description: 'Desc',
        isRead: false
      });

      expect(mockFactory['create']).toHaveBeenCalledOnce();
      expect(mockRepository['create']).toHaveBeenCalledOnce();
      expect(result.id).toBe(1);
      expect(result.title).toBe('Title');
    });
  });

  describe('RateBookUseCase', () => {
    it('should update the book rating', async () => {
      const useCase = new RateBookUseCase(mockRepository);
      const fakeBook = new Book(1, 'Title', 'Author', Genre.FICTION, 3, 'Desc', false);
      mockRepository.findById.mockResolvedValue(fakeBook);
      mockRepository.update.mockResolvedValue(fakeBook);

      const result = await useCase.execute(1, 5);

      expect(mockRepository['findById']).toHaveBeenCalledWith(1);
      expect(mockRepository['update']).toHaveBeenCalledOnce();
      expect(result.rating).toBe(5);
    });

    it('should throw NotFoundError if the book is not found', async () => {
      const useCase = new RateBookUseCase(mockRepository);
      mockRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute(99, 5)).rejects.toThrow(NotFoundError);
    });

    it('should throw DomainError if the database update fails', async () => {
      const useCase = new RateBookUseCase(mockRepository);
      const fakeBook = new Book(1, 'Title', 'Author', Genre.FICTION, 3, 'Desc', false);
      mockRepository.findById.mockResolvedValue(fakeBook);
      mockRepository.update.mockResolvedValue(null);

      await expect(useCase.execute(1, 5)).rejects.toThrow(DomainError);
    });
  });

  describe('GetBookByIdUseCase', () => {
    it('should return a book by the correct ID', async () => {
      const useCase = new GetBookByIdUseCase(mockRepository);
      const fakeBook = new Book(1, 'Title', 'Author', Genre.FICTION, 5, 'Desc', false);
      mockRepository.findById.mockResolvedValue(fakeBook);

      const result = await useCase.execute(1);
      expect(result).toEqual(fakeBook);
    });

    it('should throw NotFoundError for a non-existent ID', async () => {
      const useCase = new GetBookByIdUseCase(mockRepository);
      mockRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute(99)).rejects.toThrow(NotFoundError);
    });
  });
  describe('DeleteBookUseCase', () => {
    it('should successfully delete a book', async () => {
      const useCase = new DeleteBookUseCase(mockRepository);
      mockRepository.delete.mockResolvedValue(true);

      await useCase.execute(1);
      expect(mockRepository['delete']).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundError if the book to delete does not exist', async () => {
      const useCase = new DeleteBookUseCase(mockRepository);
      mockRepository.delete.mockResolvedValue(false);

      await expect(useCase.execute(99)).rejects.toThrow(NotFoundError);
    });
  });
});
