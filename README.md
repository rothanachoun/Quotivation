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

Every quote must reference at least one canonical topic. Quotes can appear in
multiple topics without being duplicated:

```json
{
  "id": "quote-001",
  "type": "text",
  "text": "You have survived every difficult day that brought you here.",
  "topicIds": ["resilience", "healing", "motivation"],
  "author": { "name": "" }
}
```

Author typography is global. Authors inherit the quote font family, color, and
alignment, so `author` stores only `name`.

### SQLite schema

The importer creates a normalized many-to-many model:

```text
topics ──< quote_topics >── quotes
```

- `topics` stores the canonical topic metadata.
- `quotes` stores quote content and presentation data.
- `quote_topics` assigns one quote to one or more topics.

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
`topicIds`. It rejects duplicates and unknown topics, rebuilds the three tables
in one transaction, creates lookup indexes, and writes the bundle version to
SQLite `PRAGMA user_version`.

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
