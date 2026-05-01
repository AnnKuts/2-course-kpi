import { Router } from 'express';
import { BookController } from '../presentation/controllers/book.controller';
import { catchAsync } from '../../utils/catchAsync';
import { validateBody } from '../../middlewares/validate.middleware';
import { createBookSchema } from '../schemas/book.schema';

export function createBookRouter(bookController: BookController): Router {
  const router = Router();

  router.get('/', catchAsync(bookController.getAll));
  router.get('/read', catchAsync(bookController.getReadBooks));
  router.get('/:id', catchAsync(bookController.getById));
  router.post('/', validateBody(createBookSchema), catchAsync(bookController.create));
  router.patch('/:id', validateBody(createBookSchema.partial()), catchAsync(bookController.update));
  router.delete('/:id', catchAsync(bookController.delete));
  router.patch('/:id/rating', catchAsync(bookController.rate));
  router.patch('/:id/read', catchAsync(bookController.markAsRead));

  return router;
}