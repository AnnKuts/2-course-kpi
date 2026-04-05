import express from 'express';

import bookRouter from './routes/book.router';

const app = express();

app.use(express.json());

app.use('/api/books', bookRouter);

export default app;
