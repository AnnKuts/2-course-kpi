import { DomainError } from '../../domain/errors/DomainError';
import { Book } from '../../domain/models/Book';
import { Genre } from '../../domain/models/Genre';
import { BookEntity } from '../entities/BookEntity';

export class BookMapper {
  private static parseGenre(value: string): Genre {
    const validGenres = Object.values(Genre) as string[];
    if (!validGenres.includes(value)) {
      throw new DomainError(`Invalid genre value in database: "${value}"`);
    }
    return value as Genre;
  }

  public static toDomain(entity: BookEntity): Book {
    return new Book(
      entity.id,
      entity.title,
      entity.author,
      BookMapper.parseGenre(entity.genre),
      entity.rating,
      entity.description,
      entity.isRead,
    );
  }

  public static toEntity(domain: Book): BookEntity {
    return {
      id: domain.id,
      title: domain.title,
      author: domain.author,
      genre: domain.genre,
      rating: domain.rating,
      description: domain.description,
      isRead: domain.isRead,
    };
  }
}