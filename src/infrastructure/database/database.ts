import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

let dbInstance: Database | null = null;

export async function initDb(): Promise<Database> {
  dbInstance = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });

  await dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      genre TEXT NOT NULL,
      rating INTEGER NOT NULL,
      description TEXT NOT NULL,
      isRead INTEGER NOT NULL
    )
  `);

  await dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS analytics_metrics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      target_book_id INTEGER NOT NULL,
      recorded_at TEXT NOT NULL
    )
  `);

  return dbInstance;
}

export function getDb(): Database {
  if (!dbInstance) {
    throw new Error('База даних ще не ініціалізована');
  }
  return dbInstance;
}