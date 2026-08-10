import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const quotesPath = fileURLToPath(
  new URL('../src/assets/db/quotes.json', import.meta.url),
);
const databasePath = fileURLToPath(
  new URL('../src/assets/db/quotes.sqlite', import.meta.url),
);
const versionPath = fileURLToPath(
  new URL('../src/assets/db/version.json', import.meta.url),
);

const quotes = JSON.parse(readFileSync(quotesPath, 'utf8'));
const databaseVersion = JSON.parse(readFileSync(versionPath, 'utf8')).version;

if (!Array.isArray(quotes)) {
  throw new TypeError('quotes.json must contain an array');
}

if (!Number.isInteger(databaseVersion) || databaseVersion < 1) {
  throw new TypeError('Database version must be a positive integer');
}

const sqlText = value => `'${String(value).replaceAll("'", "''")}'`;
const sqlJson = value =>
  value == null ? 'NULL' : sqlText(JSON.stringify(value));
const sqlNullableText = value =>
  value == null || value === '' ? 'NULL' : sqlText(value);

function createShuffleKey(id) {
  let hash = 2166136261;

  for (let index = 0; index < id.length; index += 1) {
    hash ^= id.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0) % 2147483647;
}

const tableInfoResult = spawnSync(
  'sqlite3',
  [databasePath, 'PRAGMA table_info(quotes);'],
  { encoding: 'utf8' },
);

if (tableInfoResult.error || tableInfoResult.status !== 0) {
  throw new Error(
    tableInfoResult.stderr?.trim() || 'Could not inspect the quotes table',
  );
}

const hasShuffleKey = tableInfoResult.stdout
  .split('\n')
  .some(column => column.split('|')[1] === 'shuffle_key');

const ids = new Set();
const statements = quotes.map((quote, index) => {
  if (!quote.id || !quote.text || !quote.category) {
    throw new Error(
      `Quote at index ${index} requires id, text, and category`,
    );
  }

  if (quote.type !== 'text' && quote.type !== 'image') {
    throw new Error(`Quote ${quote.id} has an invalid type`);
  }

  if (ids.has(quote.id)) {
    throw new Error(`Duplicate quote id: ${quote.id}`);
  }

  ids.add(quote.id);

  return `INSERT INTO quotes (
    id,
    type,
    text,
    category,
    author_json,
    style_json,
    segments_json,
    symbol_json,
    background_color,
    background_image_url,
    image_url,
    updated_at,
    shuffle_key
  ) VALUES (
    ${sqlText(quote.id)},
    ${sqlText(quote.type)},
    ${sqlText(quote.text)},
    ${sqlText(quote.category)},
    ${sqlJson(quote.author)},
    ${sqlJson(quote.style)},
    ${sqlJson(quote.segments)},
    ${sqlJson(quote.symbol)},
    ${sqlText(quote.backgroundColor ?? '#000000')},
    ${sqlNullableText(quote.backgroundImageUrl)},
    ${sqlNullableText(quote.imageUrl)},
    ${sqlText(quote.updatedAt ?? new Date().toISOString())},
    ${createShuffleKey(quote.id)}
  );`;
});

const sql = [
  'PRAGMA foreign_keys = ON;',
  hasShuffleKey
    ? ''
    : 'ALTER TABLE quotes ADD COLUMN shuffle_key INTEGER NOT NULL DEFAULT 0;',
  'BEGIN IMMEDIATE;',
  'DELETE FROM quotes;',
  ...statements,
  `CREATE INDEX IF NOT EXISTS idx_quotes_category_shuffle
   ON quotes(category, shuffle_key);`,
  `PRAGMA user_version = ${databaseVersion};`,
  'COMMIT;',
].join('\n');

const result = spawnSync('sqlite3', [databasePath], {
  encoding: 'utf8',
  input: sql,
});

if (result.error) {
  throw new Error(
    `Could not run sqlite3. Make sure it is installed: ${result.error.message}`,
  );
}

if (result.status !== 0) {
  throw new Error(result.stderr.trim() || 'SQLite import failed');
}

console.log(
  `Imported ${quotes.length} quotes into database version ${databaseVersion}`,
);
