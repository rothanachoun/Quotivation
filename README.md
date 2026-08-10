This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Quote database workflow

Quotes are edited locally and bundled with the app. The app does not need a quote server and opens its runtime database as read-only.

### Important files

```text
src/assets/db/quotes.json    Editable quote source data
src/assets/db/version.json   Bundled database version
src/assets/db/quotes.sqlite  Generated database bundled with the app
scripts/import-quotes.mjs    JSON-to-SQLite importer
```

Edit `quotes.json`, not `quotes.sqlite` directly. Each quote can contain text, category, author, text style, styled segments, a quote symbol, background settings, and an optional image URL.

### Update the quotes

1. Edit `src/assets/db/quotes.json`.
2. Increase the number in `src/assets/db/version.json`:

```json
{
  "version": 2
}
```

3. Import the JSON into SQLite:

```sh
npm run db:import
```

4. Rebuild the app so the updated SQLite file is added to the native bundle:

```sh
npm run ios
```

Or, for Android:

```sh
npm run android
```

The import command validates the JSON, rejects duplicate quote IDs, replaces the existing rows in one transaction, serializes nested objects into the JSON database columns, generates a stable `shuffle_key` for each quote, and stamps the version into SQLite using `PRAGMA user_version`.

Quote IDs must remain stable after release. Loved and recently viewed quotes are stored locally by ID, so changing an existing ID makes it appear to the app as a new quote.

### Shuffle keys and indexes

The importer generates `shuffle_key` from the quote ID. Do not add or maintain this value in `quotes.json`.

The generated database contains:

```sql
shuffle_key INTEGER NOT NULL DEFAULT 0

CREATE INDEX idx_quotes_category_shuffle
ON quotes(category, shuffle_key);
```

The stable key gives each quote a reusable pseudo-random position. Home chooses a random cursor, queries forward through the indexed values, and wraps around to the beginning if it needs more results. This avoids using `ORDER BY RANDOM()`, which becomes expensive for a large quote database.

The importer safely adds the column and index when importing an older database. Schema changes must also be accompanied by an increase in `version.json` so installed apps receive the new database.

The importer uses the local `sqlite3` command. On macOS it is normally available by default. Verify it with:

```sh
sqlite3 --version
```

### When the app copies the database

The master database is bundled inside the application, but SQLite reads a copy from the app's private storage.

```text
First launch             -> copy the bundled database
Same database version    -> reuse the existing copy
Newer bundled version    -> replace the existing copy once
Later launches           -> reuse the updated copy
```

At startup, the app compares `version.json` with the runtime database's `PRAGMA user_version`. Therefore, always increase `version.json` before importing and releasing changed quote data. If the version is not increased, existing users will continue using their previous database copy.

Deleting the app also deletes its runtime database. The bundled `src/assets/db/quotes.sqlite` file remains part of the source project and is copied again after reinstalling.

### Personalized Home feed

SQLite stores read-only quote content. MMKV separately stores user-specific data:

```text
Followed category names
Loved quote IDs
Recently viewed quote IDs
```

Home builds the feed in this order:

```text
Followed categories
        -> indexed random-cursor SQLite query
        -> unseen quotes first
        -> previously viewed quotes last
        -> oldest viewed quotes recycled first when needed
```

The current candidate batch is limited to 200 quotes. MMKV retains the 200 most recently viewed IDs. A quote is recorded as viewed after at least 60% of it remains visible for 250 milliseconds.

Pulling down at the top of Home refreshes the candidate order without deleting viewing history. Closing and reopening the app also preserves followed categories, loved quotes, and recent history. Uninstalling the app removes this MMKV personalization data.

User data must not be added to `quotes.sqlite`. A newer bundled database may replace the runtime SQLite copy, while MMKV personalization must remain intact across quote database upgrades.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
