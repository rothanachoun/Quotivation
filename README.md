# Quotivation

A React Native app for discovering and following motivational quote topics.

## Development

Install dependencies and native iOS pods:

```sh
npm install
bundle install
bundle exec pod install
```

Start Metro and run the app:

```sh
npm start
npm run ios
# or
npm run android
```

## Quote database

Quotes and topics are edited locally and bundled with the app. The runtime
database is read-only.

```text
src/assets/db/topics.json   Canonical flat topic catalog
src/assets/db/quotes.json   Editable/generated quote source
src/assets/db/version.json  Bundled database version
src/assets/db/quotes.sqlite Generated database bundled with the app
scripts/generate-quotes.mjs Topic-based quote generator
scripts/import-quotes.mjs   JSON-to-SQLite importer
```

Edit the JSON sources rather than `quotes.sqlite` directly.

### Topics

The app uses ten flat topics. There are no topic groups.

```ts
type Topic = {
  id: string;
  name: string;
  description: string;
  tags: string[];
};
```

| Topic | Topic ID |
| --- | --- |
| Motivation | `motivation` |
| Self-Love | `self-love` |
| Peace | `peace` |
| Confidence | `confidence` |
| Focus | `focus` |
| Resilience | `resilience` |
| Relationships | `relationships` |
| Personal Growth | `personal-growth` |
| Healing | `healing` |
| Gratitude | `gratitude` |

Tags provide narrower writing and search metadata. They are not followable
topics and do not create additional Explore sections.

### Quote topic assignments

Every quote must reference exactly one canonical topic:

```json
{
  "id": "quote-001",
  "type": "text",
  "text": "You have survived every difficult day that brought you here.",
  "topicIds": ["resilience"],
  "author": { "name": "" }
}
```

Author typography is global. Authors inherit the quote font family, color, and
alignment and render at a smaller size. SQLite stores only the author name in
the plain-text `author` column. Quote presentation JSON is stored in the
`style` and `segments` columns.

### SQLite schema

The current bundled database is version `13` and uses one table:

```sql
PRAGMA user_version = 13;

CREATE TABLE quotes (
  id                   TEXT PRIMARY KEY,
  topic_id             TEXT NOT NULL,
  type                 TEXT NOT NULL,
  text                 TEXT NOT NULL,
  decoration           TEXT NOT NULL DEFAULT 'soft',
  author               TEXT,
  style                TEXT,
  segments             TEXT,
  background_color     TEXT NOT NULL,
  background_image_url TEXT,
  image_url             TEXT,
  updated_at           TEXT NOT NULL,
  shuffle_key          INTEGER NOT NULL
);

CREATE INDEX idx_quotes_shuffle
  ON quotes(shuffle_key);

CREATE INDEX idx_quotes_topic_shuffle
  ON quotes(topic_id, shuffle_key, id);
```

Column notes:

- `topic_id` stores the quote's single topic assignment. Topic names,
  descriptions, and tags remain in `topics.json` rather than SQLite.
- `author` stores only the author name as plain text. Author presentation is
  global and inherits the main quote font, color, and alignment at a smaller
  size.
- `style` and `segments` contain serialized JSON used for quote typography and
  styled text segments. The column names intentionally omit the `_json`
  suffix.
- Generated quote styles use the Paper theme background (`#242424`) and
  foreground (`#FAFAFC`), centered `Lora-SemiBold` typography, and
  length-aware font sizes from 23–31 points.
- `background_image_url` and `image_url` are nullable because most quotes are
  text-only.
- `shuffle_key` provides a stable randomized feed order.
- `idx_quotes_topic_shuffle` supports efficient topic-filtered feed queries;
  `idx_quotes_shuffle` supports unscoped shuffle traversal.

### Updating bundled content

1. Edit `topics.json`, `quotes.json`, or `generate-quotes.mjs`.
2. Increase the version in `version.json`.
3. Generate quotes when generator inputs changed:

```sh
npm run db:generate
```

4. Rebuild SQLite:

```sh
npm run db:import
```

5. Rebuild the native app so the updated database is bundled.

The importer validates topic metadata, quote IDs, quote types, and all
`topicIds`. It requires exactly one known topic per quote, rejects duplicate
quote IDs, rebuilds the `quotes` table in one transaction, creates lookup
indexes, and writes the bundle version to SQLite `PRAGMA user_version`.

## Personalization

Followed topics are stored in MMKV under `followed-topic-ids.v2`. Loved quotes
and recently viewed quote history remain stored independently. Uninstalling the
app removes this local personalization data.

## Validation

```sh
npm run lint
npx tsc --noEmit
npm test -- --runInBand --watchman=false
```
