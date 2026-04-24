import logger from 'jet-logger';
import server from './server';
import { initDb } from './infrastructure/database/database';

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  try {
    await initDb();
    logger.info('База даних SQLite успішно ініціалізована');

    server.listen(PORT, () => {
      logger.info(`Server started on port: ${PORT}`);
    });
  } catch (error) {
    logger.err('Помилка під час запуску сервера:');
    console.error(error);
    process.exit(1);
  }
}

bootstrap();
