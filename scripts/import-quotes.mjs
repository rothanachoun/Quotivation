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
const relationStatements = [];
for (const [index, quote] of quotes.entries()) {
  if (!quote.id || !quote.text || !Array.isArray(quote.topicIds) || quote.topicIds.length === 0) {
    throw new Error(`Quote at index ${index} requires id, text, and topicIds`);
  }
  if (quote.type !== 'text' && quote.type !== 'image') throw new Error(`Quote ${quote.id} has an invalid type`);
  if (quoteIds.has(quote.id)) throw new Error(`Duplicate quote id: ${quote.id}`);
  quoteIds.add(quote.id);
  for (const topicId of new Set(quote.topicIds)) {
    if (!topicIds.has(topicId)) throw new Error(`Quote ${quote.id} uses unknown topic: ${topicId}`);
    relationStatements.push(`INSERT INTO quote_topics (quote_id, topic_id) VALUES (${sqlText(quote.id)}, ${sqlText(topicId)});`);
  }
  quoteStatements.push(`INSERT INTO quotes (
    id, type, text, decoration, author_json, style_json, segments_json,
    background_color, background_image_url, image_url, updated_at, shuffle_key
  ) VALUES (
    ${sqlText(quote.id)}, ${sqlText(quote.type)}, ${sqlText(quote.text)},
    ${sqlText(quote.decoration ?? 'soft')}, ${sqlJson(quote.author)}, ${sqlJson(quote.style)},
    ${sqlJson(quote.segments)}, ${sqlText(quote.backgroundColor ?? '#000000')},
    ${sqlNullableText(quote.backgroundImageUrl)}, ${sqlNullableText(quote.imageUrl)},
    ${sqlText(quote.updatedAt ?? new Date().toISOString())}, ${createShuffleKey(quote.id)}
  );`);
}

const topicStatements = topics.map(topic =>
  `INSERT INTO topics (id, name, description, tags_json) VALUES (${sqlText(topic.id)}, ${sqlText(topic.name)}, ${sqlText(topic.description)}, ${sqlJson(topic.tags)});`,
);
const sql = [
  'PRAGMA foreign_keys = OFF;', 'BEGIN IMMEDIATE;',
  'DROP TABLE IF EXISTS quote_topics;', 'DROP TABLE IF EXISTS topics;', 'DROP TABLE IF EXISTS quotes;',
  `CREATE TABLE quotes (id TEXT PRIMARY KEY, type TEXT NOT NULL, text TEXT NOT NULL,
    decoration TEXT NOT NULL DEFAULT 'soft', author_json TEXT, style_json TEXT, segments_json TEXT,
    background_color TEXT NOT NULL, background_image_url TEXT, image_url TEXT,
    updated_at TEXT NOT NULL, shuffle_key INTEGER NOT NULL);`,
  `CREATE TABLE topics (id TEXT PRIMARY KEY, name TEXT NOT NULL, description TEXT NOT NULL, tags_json TEXT NOT NULL);`,
  `CREATE TABLE quote_topics (quote_id TEXT NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
    topic_id TEXT NOT NULL REFERENCES topics(id) ON DELETE CASCADE, PRIMARY KEY (quote_id, topic_id));`,
  ...topicStatements, ...quoteStatements, ...relationStatements,
  'CREATE INDEX idx_quotes_shuffle ON quotes(shuffle_key);',
  'CREATE INDEX idx_quote_topics_topic ON quote_topics(topic_id, quote_id);',
  `PRAGMA user_version = ${databaseVersion};`, 'COMMIT;', 'PRAGMA foreign_keys = ON;',
].join('\n');

const result = spawnSync('sqlite3', [databasePath], { encoding: 'utf8', input: sql });
if (result.error) throw new Error(`Could not run sqlite3: ${result.error.message}`);
if (result.status !== 0) throw new Error(result.stderr.trim() || 'SQLite import failed');
console.log(`Imported ${quotes.length} quotes across ${topics.length} topics into database version ${databaseVersion}`);
