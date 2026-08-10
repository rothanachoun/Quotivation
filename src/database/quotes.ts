import { getDatabase } from './index';

export type QuoteRow = {
  author_json: string | null;
  background_color: string;
  background_image_url: string | null;
  category: string;
  id: string;
  image_url: string | null;
  segments_json: string | null;
  shuffle_key: number;
  style_json: string | null;
  symbol_json: string | null;
  text: string;
  type: 'image' | 'text';
  updated_at: string;
};

export type QuoteCategory = {
  id: string;
  quoteCount: number;
};

type QuoteCategoryRow = {
  category: string;
  quote_count: number;
};

export async function getQuoteCategories(): Promise<QuoteCategory[]> {
  const database = getDatabase();
  const result = await database.execute(
    `SELECT category, COUNT(*) AS quote_count
     FROM quotes
     GROUP BY category
     ORDER BY category COLLATE NOCASE`,
  );

  return (result.rows as QuoteCategoryRow[]).map(row => ({
    id: row.category,
    quoteCount: Number(row.quote_count),
  }));
}

export async function getQuotes(
  limit = 20,
  offset = 0,
): Promise<QuoteRow[]> {
  const database = getDatabase();

  const result = await database.execute(
    `SELECT *
     FROM quotes
     ORDER BY id
     LIMIT ? OFFSET ?`,
    [limit, offset],
  );

  return result.rows as QuoteRow[];
}

export async function getQuotesByCategory(
  category: string,
  limit = 20,
  offset = 0,
): Promise<QuoteRow[]> {
  const database = getDatabase();

  const result = await database.execute(
    `SELECT *
     FROM quotes
     WHERE category = ?
     ORDER BY id
     LIMIT ? OFFSET ?`,
    [category, limit, offset],
  );

  return result.rows as QuoteRow[];
}

export async function getQuotesByCategories(
  categories: readonly string[],
  limit = 20,
): Promise<QuoteRow[]> {
  if (categories.length === 0) {
    return [];
  }

  const database = getDatabase();
  const placeholders = categories.map(() => '?').join(', ');
  const shuffleCursor = Math.floor(Math.random() * 2147483647);
  const query = (comparison: '>=' | '<', queryLimit: number) =>
    database.execute(
    `SELECT *
     FROM quotes
     WHERE category IN (${placeholders})
       AND shuffle_key ${comparison} ?
     ORDER BY shuffle_key, id
     LIMIT ?`,
      [...categories, shuffleCursor, queryLimit],
    );

  const firstResult = await query('>=', limit);
  const rows = firstResult.rows as QuoteRow[];

  if (rows.length < limit) {
    const wrappedResult = await query('<', limit - rows.length);
    rows.push(...(wrappedResult.rows as QuoteRow[]));
  }

  return rows;
}
