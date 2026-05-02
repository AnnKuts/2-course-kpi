import { BookMetric } from '../../domain/models/BookMetric';

type SqlValue = string | number | boolean | null;
export interface IAnalyticsDatabase {
  run(sql: string, params?: SqlValue[]): Promise<{ lastID?: number; changes?: number }>;
}

export class AnalyticsRepository {
  constructor(private readonly db: IAnalyticsDatabase) {}

  public async saveMetric(metric: BookMetric): Promise<void> {
    await this.db.run(
      `INSERT INTO analytics_metrics (target_book_id, recorded_at) VALUES (?, ?)`,
      [metric.targetBookId, metric.recordedAt.toISOString()]
    );
  }
}