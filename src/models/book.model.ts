import { Genre } from '../schemas/book.schema';

export interface Book {
  id: number;
  title: string;
  author: string;
  genre: Genre;
  rating: number;
  description: string;
  isRead: boolean;
}
