import { z } from 'zod';

import { Genre } from '../domain/models/Genre';

export const createBookSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  genre: z.enum(Object.values(Genre) as [Genre, ...Genre[]]),
  rating: z
    .number()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5'),
  description: z.string(),
  isRead: z.boolean(),
});

export const paginationSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
  offset: z.coerce.number().int().min(0).optional().default(0),
});
