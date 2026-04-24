import { initDb } from './infrastructure/database/database';
import { createServer } from './server';

const PORT = 3000;

async function bootstrap() {
  try {
    const db = await initDb();
    console.log('База даних успішно ініціалізована');

    const app = createServer(db);

    app.listen(PORT, () => {
      console.log(`Server started on port: ${PORT}`);
    });
  } catch (error) {
    console.error('Помилка під час запуску сервера:', error);
    process.exit(1);
  }
}

bootstrap().catch((error) => {
  console.error('Непередбачена помилка під час запуску:', error);
  process.exit(1);
});