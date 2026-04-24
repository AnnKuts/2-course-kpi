import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { Express } from 'express';
import { createServer } from '../../src/server';
import { initDb } from '../../src/infrastructure/database/database';
import { Genre } from '../../src/domain/models/Genre';


interface BookResponse {
  id: number;
  title: string;
  author: string;
  genre: string;
  rating: number;
  description: string;
  isRead: boolean | number;
}

describe('Book API Integration Tests', () => {
  let app: Express;
  let createdBookId: number;

  beforeAll(async () => {
    const db = await initDb();

    await db.run('DELETE FROM books');
    await db.run('DELETE FROM sqlite_sequence WHERE name="books"');

    app = createServer(db);
  });

  it('POST /books - should create a new book', async () => {
    const res = await request(app)
      .post('/books')
      .send({
        title: 'Book 1',
        author: 'Author 1',
        genre: Genre.FICTION,
        rating: 5,
        description: 'Description 1',
        isRead: false
      });

    expect(res.status).toBe(201);
    const body = res.body as { id: number };
    expect(body.id).toBeDefined();
    createdBookId = body.id;
  });

  it('GET /books - should support pagination (limit and offset)', async () => {
    await request(app).post('/books').send({
      title: 'Book 2',
      author: 'Author 2',
      genre: Genre.FICTION,
      rating: 3,
      description: 'Desc 2',
      isRead: false
    });

    await request(app).post('/books').send({
      title: 'Book 3',
      author: 'Author 3',
      genre: Genre.FICTION,
      rating: 5,
      description: 'Desc 3',
      isRead: true
    });

    const resLimit = await request(app).get('/books?limit=2&offset=0');
    expect(resLimit.status).toBe(200);
    const booksLimit = resLimit.body as BookResponse[];
    expect(Array.isArray(booksLimit)).toBe(true);
    expect(booksLimit.length).toBe(2);

    const resOffset = await request(app).get('/books?limit=2&offset=2');
    expect(resOffset.status).toBe(200);
    const booksOffset = resOffset.body as BookResponse[];
    expect(booksOffset.length).toBe(1);
    expect(booksOffset[0].title).toBe('Book 3');
  });

  it('GET /books/read - should return only books that were read', async () => {
    const res = await request(app).get('/books/read?limit=10&offset=0');
    
    expect(res.status).toBe(200);
    const books = res.body as BookResponse[];
    
    expect(books.length).toBeGreaterThan(0);
    books.forEach(book => {
      expect(Boolean(book.isRead)).toBe(true);
    });
  });

  it('GET /books/:id - should return the book details', async () => {
    const res = await request(app).get(`/books/${createdBookId}`);
    expect(res.status).toBe(200);
    const body = res.body as BookResponse;
    expect(body.id).toBe(createdBookId);
  });

  it('DELETE /books/:id - should successfully delete the book', async () => {
    const res = await request(app).delete(`/books/${createdBookId}`);
    expect(res.status).toBe(204);
  });

  it('GET /books/:id - should return 404 after deletion', async () => {
    const res = await request(app).get(`/books/${createdBookId}`);
    expect(res.status).toBe(404);
  });

  afterAll(async () => {
    const db = await initDb(); 
    await db.run('DELETE FROM books');
    await db.run('DELETE FROM sqlite_sequence WHERE name="books"');
  });
});