// here will be routers
import { Router } from 'express';
import { bookController } from '../controllers/book.controller';

const router = Router();

router.get('/', (req, res) => bookController.getAll(req, res));
router.get('/:id', (req, res) => bookController.getById(req, res));
router.post('/', (req, res) => bookController.create(req, res));
router.put('/:id', (req, res) => bookController.update(req, res));
router.delete('/:id', (req, res) => bookController.delete(req, res));

export default router;