import { createMMKV } from 'react-native-mmkv';

export const personalizationStorage = createMMKV({
  id: 'quotivation.user-personalization',
});

export const personalizationKeys = {
  followedTopics: 'followed-topic-ids.v2',
  lovedQuotes: 'loved-quote-ids.v1',
  recentlyViewedQuotes: 'recently-viewed-quote-ids.v1',
  selectedTopicId: 'selected-topic-id.v1',
} as const;
