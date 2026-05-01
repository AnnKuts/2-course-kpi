import { describe, it, expect } from 'vitest';
import { BookFactory } from '../../src/core/domain/factories/BookFactory';
import { Genre } from '../../src/core/domain/models/Genre';
import { DomainError } from '../../src/core/domain/errors/DomainError';

describe('Book Domain Model & Factory', () => {
  it('should successfully create a valid book', () => {
    const book = BookFactory.create(1, '1984', 'George Orwell', Genre.FICTION, 5, 'Dystopia', false);

    expect(book.title).toBe('1984');
    expect(book.rating).toBe(5);
    expect(book.isRead).toBe(false);
  });

  it('should throw DomainError if title is empty', () => {
    expect(() =>
      BookFactory.create(2, '   ', 'Author', Genre.FICTION, 4, 'Desc', false)
    ).toThrow(DomainError);
  });

  it('should throw DomainError if author is empty', () => {
    expect(() =>
      BookFactory.create(2, 'Title', '   ', Genre.FICTION, 4, 'Desc', false)
    ).toThrow(DomainError);
  });

  it('should throw DomainError for invalid rating above 5', () => {
    expect(() =>
      BookFactory.create(3, 'Title', 'Author', Genre.FICTION, 10, 'Desc', false)
    ).toThrow(DomainError);
  });

  it('should throw DomainError for invalid rating below 1', () => {
    expect(() =>
      BookFactory.create(3, 'Title', 'Author', Genre.FICTION, 0, 'Desc', false)
    ).toThrow(DomainError);
  });

  it('should throw DomainError when setting an invalid rating via setter', () => {
    const book = BookFactory.create(1, '1984', 'George Orwell', Genre.FICTION, 5, 'Dystopia', false);
    expect(() => {
      book.rating = 6;
    }).toThrow(DomainError);
  });

  it('markAsRead should change status to read', () => {
    const book = BookFactory.create(4, 'Title', 'Author', Genre.FICTION, 4, 'Desc', false);
    book.markAsRead();
    expect(book.isRead).toBe(true);
  });
});
