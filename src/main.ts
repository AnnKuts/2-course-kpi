import logger from 'jet-logger';
import server from './server';
import { initDb } from './infrastructure/database/database';

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  try {
    await initDb();
    logger.info('SQLite database initialized successfully');

    server.listen(PORT, () => {
      logger.info(`Server started on port: ${PORT}`);
    });
  } catch (error) {
    logger.err('Failed to start the server:');
    console.error(error);
    process.exit(1);
  }
}

void bootstrap();
