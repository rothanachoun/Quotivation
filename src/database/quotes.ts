import { getDatabase } from './index';
import topicCatalog from '@/assets/db/topics.json';

export type QuoteRow = {
  author: string | null;
  background_color: string;
  background_image_url: string | null;
  decoration: string | null;
  id: string;
  image_url: string | null;
  segments: string | null;
  shuffle_key: number;
  style: string | null;
  text: string;
  topic_id: string;
  type: 'image' | 'text';
  updated_at: string;
};

export type QuoteTopic = {
  description: string;
  id: string;
  name: string;
  quoteCount: number;
  tags: string[];
};

type TopicCountRow = {
  quote_count: number;
  topic_id: string;
};

export async function getQuoteTopics(): Promise<QuoteTopic[]> {
  const result = await getDatabase().execute(
    `SELECT topic_id, COUNT(*) AS quote_count
     FROM quotes
     GROUP BY topic_id`,
  );
  const counts = new Map(
    (result.rows as TopicCountRow[]).map(row => [
      row.topic_id,
      Number(row.quote_count),
    ]),
  );

  return topicCatalog.map(topic => ({
    ...topic,
    quoteCount: counts.get(topic.id) ?? 0,
  }));
}

export async function getQuotesByTopicIds(
  topicIds: readonly string[],
  limit = 20,
): Promise<QuoteRow[]> {
  if (topicIds.length === 0) return [];
  const database = getDatabase();
  const placeholders = topicIds.map(() => '?').join(', ');
  const shuffleCursor = Math.floor(Math.random() * 2147483647);
  const query = (comparison: '>=' | '<', queryLimit: number) =>
    database.execute(
      `SELECT * FROM quotes
       WHERE topic_id IN (${placeholders})
         AND quotes.shuffle_key ${comparison} ?
       ORDER BY quotes.shuffle_key, quotes.id LIMIT ?`,
      [...topicIds, shuffleCursor, queryLimit],
    );
  const first = await query('>=', limit);
  const rows = first.rows as QuoteRow[];
  if (rows.length < limit) {
    const wrapped = await query('<', limit - rows.length);
    rows.push(...(wrapped.rows as QuoteRow[]));
  }
  return rows;
}
