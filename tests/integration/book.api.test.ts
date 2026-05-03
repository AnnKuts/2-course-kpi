import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../src/server';
import { initDb, getDb } from '../../src/infrastructure/database/database';

describe('Book API Integration Tests', () => {
  let createdBookId: number;

  beforeAll(async () => {
    await initDb(':memory:');
  });

  afterAll(async () => {
    await getDb().close();
  });

  it('POST /books - should create a new book', async () => {
    const res = await request(app)
      .post('/books')
      .send({
        title: 'Integration Test Book',
        author: 'Tester',
        genre: 'Science',
        rating: 4,
        description: 'Test description',
        isRead: false
      });

    expect(res.status).toBe(201);
    expect((res.body as { title: string }).title).toBe('Integration Test Book');

    createdBookId = (res.body as { id: number }).id;
  });

  it('POST /books - should return 400 when creating duplicate title+author', async () => {
    const res = await request(app)
      .post('/books')
      .send({
        title: 'Integration Test Book',
        author: 'Tester',
        genre: 'Science',
        rating: 3,
        description: 'Duplicate',
        isRead: false
      });

    expect(res.status).toBe(400);
    expect((res.body as { message: string }).message).toMatch(/already exists/);
  });

  it('GET /books/:id - should return the newly created book', async () => {
    const res = await request(app).get(`/books/${createdBookId}`);

    expect(res.status).toBe(200);
    expect((res.body as { id: number }).id).toBe(createdBookId);
    expect((res.body as { title: string }).title).toBe('Integration Test Book');
  });

  it('PATCH /books/:id/rating - should update the rating', async () => {
    const res = await request(app)
      .patch(`/books/${createdBookId}/rating`)
      .send({ rating: 5 });

    expect(res.status).toBe(200);
    expect((res.body as { rating: number }).rating).toBe(5);
  });

  it('PATCH /books/:id/rating - should return 400 on domain error', async () => {
    const res = await request(app)
      .patch(`/books/${createdBookId}/rating`)
      .send({ rating: 10 });

    expect(res.status).toBe(400);
    expect((res.body as { message: string }).message).toBeDefined();
  });

  it('PATCH /books/:id/read - should mark the book as read', async () => {
    const res = await request(app).patch(`/books/${createdBookId}/read`);

    expect(res.status).toBe(200);
    expect((res.body as { isRead: boolean }).isRead).toBe(true);
  });

  it('DELETE /books/:id - should successfully delete the book', async () => {
    const res = await request(app).delete(`/books/${createdBookId}`);

    expect(res.status).toBe(204);
  });

  it('GET /books/:id - should return 404 after deletion', async () => {
    const res = await request(app).get(`/books/${createdBookId}`);

    expect(res.status).toBe(404);
  });
});

