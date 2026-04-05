import { z } from 'zod';

export const genreSchema = z.enum([
  'Fiction',
  'Fantasy',
  'Science',
  'Romance',
  'Horror',
]);

export const createBookSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  genre: genreSchema,
  rating: z.number().min(0).max(5),
  description: z.string(),
  isRead: z.boolean(),
});

export type Genre = z.infer<typeof genreSchema>;
export type CreateBookDto = z.infer<typeof createBookSchema>;
