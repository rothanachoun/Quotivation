import { createMMKV } from 'react-native-mmkv';

export const personalizationStorage = createMMKV({
  id: 'quotivation.user-personalization',
});

export const personalizationKeys = {
  followedCategories: 'followed-category-names.v1',
  lovedQuotes: 'loved-quote-ids.v1',
  recentlyViewedQuotes: 'recently-viewed-quote-ids.v1',
} as const;
