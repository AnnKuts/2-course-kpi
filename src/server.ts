import express from 'express';
import { Database } from 'sqlite';
import { IDatabase } from './core/infrastructure/repositories/book.repository';
import { IAnalyticsDatabase } from './analytics/infrastructure/repositories/AnalyticsRepository';
import { errorMiddleware } from './middlewares/error.middleware';
import { InMemoryEventBus } from './infrastructure/events/InMemoryEventBus';

import { CoreModule } from './core/api'; 
import { AnalyticsModule } from './analytics/api';

export const createServer = (db: Database) => {
  const app = express();
  app.use(express.json());

  const eventBus = new InMemoryEventBus();

  const analyticsModule = new AnalyticsModule(db as unknown as IAnalyticsDatabase, eventBus);
  const coreModule = new CoreModule(db as unknown as IDatabase, eventBus);
  
  app.use('/books', coreModule.router);

  app.use(errorMiddleware);

  return app;
};