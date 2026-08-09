import {
  moveAssetsDatabase,
  open,
  type DB,
} from '@op-engineering/op-sqlite';

import databaseVersion from '@/assets/db/version.json';

let database: DB | undefined;

function openDatabase(): DB {
  return open({
    name: 'quotes.sqlite',
    readOnly: true,
  });
}

export async function initializeDatabase(): Promise<DB> {
  if (database) {
    return database;
  }

  const available = await moveAssetsDatabase({
    filename: 'quotes.sqlite',
  });

  if (!available) {
    throw new Error('Could not copy the bundled quotes.sqlite database');
  }

  database = openDatabase();

  const versionResult = await database.execute('PRAGMA user_version');
  const installedVersion = Number(
    versionResult.rows[0]?.user_version ?? 0,
  );

  if (installedVersion < databaseVersion.version) {
    database.close();
    database = undefined;

    const updated = await moveAssetsDatabase({
      filename: 'quotes.sqlite',
      overwrite: true,
    });

    if (!updated) {
      throw new Error('Could not update the bundled quotes.sqlite database');
    }

    database = openDatabase();
  }

  return database;
}

export function getDatabase(): DB {
  if (!database) {
    throw new Error('Database has not been initialized');
  }

  return database;
}
