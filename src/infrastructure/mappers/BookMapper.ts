import { Book } from '../../domain/models/Book';
import { Genre } from '../../domain/models/Genre';
import { BookEntity } from '../entities/BookEntity';

export class BookMapper {
  public static toDomain(entity: BookEntity): Book {
    return new Book(
      entity.id,
      entity.title,
      entity.author,
      entity.genre as Genre,
      entity.rating,
      entity.description,
      entity.isRead
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