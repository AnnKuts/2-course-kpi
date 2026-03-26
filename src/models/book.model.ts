export enum Genre {
  Fiction = "Fiction",
  Fantasy = "Fantasy",
  Science = "Science",
  Romance = "Romance",
  Horror = "Horror",
}
export interface Book {
  id: number;
  title: string;
  author: string;
  genre: Genre;
  rating: number;
  description: string;
  isRead: boolean;
}
//gonna be normalised later