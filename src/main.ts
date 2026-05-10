import logger from 'jet-logger';

import { initDb } from './infrastructure/database/database';
import { createServer } from './server';

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  try {
    const db = await initDb();
    logger.info('SQLite database initialized successfully');

    const app = createServer(db);

    app.listen(PORT, () => {
      logger.info(`Server started on port: ${PORT}`);
    });
  } catch (error) {
    logger.err('Failed to start the server:');
    console.error(error);
    process.exit(1);
  }
}

bootstrap().catch((err) => {
  console.error('Unhandled error during bootstrap:', err);
  process.exit(1);
});
