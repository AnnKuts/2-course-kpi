import { DomainError } from '../errors/DomainError';
import { Genre } from './Genre';

export class Book {
  constructor(
    public readonly id: number,
    public title: string,
    public author: string,
    public genre: Genre,
    private _rating: number,
    public description: string,
    public isRead: boolean,
  ) {
    this.rating = _rating;
  }

  get rating(): number {
    return this._rating;
  }

  set rating(value: number) {
    if (value < 1 || value > 5) {
      throw new DomainError('Рейтинг має бути від 1 до 5');
    }
    this._rating = value;
  }

  public markAsRead(): void {
    this.isRead = true;
  }

  public toJSON() {
    return {
      id: this.id,
      title: this.title,
      author: this.author,
      genre: this.genre,
      rating: this.rating,
      description: this.description,
      isRead: this.isRead,
    };
  }
}
