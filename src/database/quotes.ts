import { getDatabase } from './index';

export type QuoteRow = {
  author_json: string | null;
  background_color: string;
  background_image_url: string | null;
  category: string;
  id: string;
  image_url: string | null;
  segments_json: string | null;
  style_json: string | null;
  symbol_json: string | null;
  text: string;
  type: 'image' | 'text';
  updated_at: string;
};

export type QuoteCategory = {
  name: string;
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
    name: row.category,
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
