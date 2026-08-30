import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const assetPath = name => fileURLToPath(new URL(`../src/assets/db/${name}`, import.meta.url));
const quotes = JSON.parse(readFileSync(assetPath('quotes.json'), 'utf8'));
const topics = JSON.parse(readFileSync(assetPath('topics.json'), 'utf8'));
const databaseVersion = JSON.parse(readFileSync(assetPath('version.json'), 'utf8')).version;
const databasePath = assetPath('quotes.sqlite');

if (!Array.isArray(quotes) || !Array.isArray(topics)) {
  throw new TypeError('quotes.json and topics.json must contain arrays');
}
if (!Number.isInteger(databaseVersion) || databaseVersion < 1) {
  throw new TypeError('Database version must be a positive integer');
}

const topicIds = new Set();
for (const topic of topics) {
  if (!topic.id || !topic.name || !topic.description || !Array.isArray(topic.tags)) {
    throw new Error('Every topic requires id, name, description, and tags');
  }
  if (topicIds.has(topic.id)) throw new Error(`Duplicate topic id: ${topic.id}`);
  topicIds.add(topic.id);
}

const sqlText = value => `'${String(value).replaceAll("'", "''")}'`;
const sqlJson = value => (value == null ? 'NULL' : sqlText(JSON.stringify(value)));
const sqlNullableText = value => value == null || value === '' ? 'NULL' : sqlText(value);
const normalizeAuthor = value => {
  if (typeof value !== 'string') return null;
  const author = value.trim();
  return /^unknown?\b/i.test(author) ? null : author;
};
function createShuffleKey(id) {
  let hash = 2166136261;
  for (let index = 0; index < id.length; index += 1) {
    hash ^= id.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) % 2147483647;
}

const quoteIds = new Set();
const quoteStatements = [];
for (const [index, quote] of quotes.entries()) {
  if (!quote.id || !quote.text || !Array.isArray(quote.topicIds) || quote.topicIds.length !== 1) {
    throw new Error(`Quote at index ${index} requires exactly one topicId`);
  }
  if (quote.type !== 'text' && quote.type !== 'image') throw new Error(`Quote ${quote.id} has an invalid type`);
  if (quoteIds.has(quote.id)) throw new Error(`Duplicate quote id: ${quote.id}`);
  quoteIds.add(quote.id);
  const [topicId] = quote.topicIds;
  if (!topicIds.has(topicId)) throw new Error(`Quote ${quote.id} uses unknown topic: ${topicId}`);
  const quotation = Number(quote.quotation ?? 1);
  if (![1, 2, 3, 4].includes(quotation)) {
    throw new Error(`Quote ${quote.id} has an invalid quotation: ${quote.quotation}`);
  }
  quoteStatements.push(`INSERT INTO quotes (
    id, topic_id, type, text, quotation, author, style, segments,
    background_color, background_image_url, image_url, updated_at, shuffle_key
  ) VALUES (
    ${sqlText(quote.id)}, ${sqlText(topicId)}, ${sqlText(quote.type)}, ${sqlText(quote.text)},
    ${quotation}, ${sqlNullableText(normalizeAuthor(quote.author?.name))}, ${sqlJson(quote.style)},
    ${sqlJson(quote.segments)}, ${sqlText(quote.backgroundColor ?? '#000000')},
    ${sqlNullableText(quote.backgroundImageUrl)}, ${sqlNullableText(quote.imageUrl)},
    ${sqlText(quote.updatedAt ?? new Date().toISOString())}, ${createShuffleKey(quote.id)}
  );`);
}

const sql = [
  'PRAGMA foreign_keys = OFF;', 'BEGIN IMMEDIATE;',
  'DROP TABLE IF EXISTS quote_topics;', 'DROP TABLE IF EXISTS topics;', 'DROP TABLE IF EXISTS quotes;',
  `CREATE TABLE quotes (id TEXT PRIMARY KEY, topic_id TEXT NOT NULL, type TEXT NOT NULL, text TEXT NOT NULL,
    quotation INTEGER NOT NULL DEFAULT 1 CHECK (quotation BETWEEN 1 AND 4), author TEXT, style TEXT, segments TEXT,
    background_color TEXT NOT NULL, background_image_url TEXT, image_url TEXT,
    updated_at TEXT NOT NULL, shuffle_key INTEGER NOT NULL);`,
  ...quoteStatements,
  'CREATE INDEX idx_quotes_shuffle ON quotes(shuffle_key);',
  'CREATE INDEX idx_quotes_topic_shuffle ON quotes(topic_id, shuffle_key, id);',
  `PRAGMA user_version = ${databaseVersion};`, 'COMMIT;', 'PRAGMA foreign_keys = ON;',
].join('\n');

const result = spawnSync('sqlite3', [databasePath], { encoding: 'utf8', input: sql });
if (result.error) throw new Error(`Could not run sqlite3: ${result.error.message}`);
if (result.status !== 0) throw new Error(result.stderr.trim() || 'SQLite import failed');
console.log(`Imported ${quotes.length} quotes into single-table database version ${databaseVersion}`);
