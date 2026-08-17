import { getDatabase } from './index';

export type QuoteRow = {
  author_json: string | null;
  background_color: string;
  background_image_url: string | null;
  decoration: string | null;
  id: string;
  image_url: string | null;
  segments_json: string | null;
  shuffle_key: number;
  style_json: string | null;
  text: string;
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

type TopicRow = {
  description: string;
  id: string;
  name: string;
  quote_count: number;
  tags_json: string;
};

export async function getQuoteTopics(): Promise<QuoteTopic[]> {
  const result = await getDatabase().execute(
    `SELECT topics.*, COUNT(quote_topics.quote_id) AS quote_count
     FROM topics
     LEFT JOIN quote_topics ON quote_topics.topic_id = topics.id
     GROUP BY topics.id
     ORDER BY topics.rowid`,
  );
  return (result.rows as TopicRow[]).map(row => ({
    description: row.description,
    id: row.id,
    name: row.name,
    quoteCount: Number(row.quote_count),
    tags: JSON.parse(row.tags_json) as string[],
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
      `SELECT DISTINCT quotes.* FROM quotes
       INNER JOIN quote_topics ON quote_topics.quote_id = quotes.id
       WHERE quote_topics.topic_id IN (${placeholders})
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
