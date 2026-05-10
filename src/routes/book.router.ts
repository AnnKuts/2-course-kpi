import { Router } from 'express';

import { BookController } from '../presentation/controllers/book.controller';
import { catchAsync } from '../utils/catchAsync';

export function createBookRouter(bookController: BookController): Router {
  const router = Router();

  router.get('/', catchAsync(bookController.getAll));
  router.get('/read', catchAsync(bookController.getReadBooks));
  router.get('/:id', catchAsync(bookController.getById));
  router.post('/', catchAsync(bookController.create));
  router.patch('/:id', catchAsync(bookController.update));
  router.delete('/:id', catchAsync(bookController.delete));
  router.patch('/:id/rating', catchAsync(bookController.rate));
  router.patch('/:id/read', catchAsync(bookController.markAsRead));

  return router;
}
