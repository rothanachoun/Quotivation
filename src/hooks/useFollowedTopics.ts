import {
  personalizationKeys,
  personalizationStorage,
} from '@/storage/personalizationStorage';

import { useStoredStringSet } from './useStoredStringSet';

const LEGACY_KEY = 'followed-category-names.v1';
const LEGACY_TOPIC_MAP: Record<string, string> = {
  ambition: 'focus', boundaries: 'relationships', breakups: 'healing',
  calm: 'peace', change: 'personal-growth', courage: 'confidence',
  'choosing-yourself': 'self-love', confidence: 'confidence',
  consistency: 'focus', discipline: 'focus', 'difficult-days': 'resilience',
  focus: 'focus', friendship: 'relationships', gratitude: 'gratitude',
  habits: 'focus', healing: 'healing', heartbreak: 'healing',
  'healthy-love': 'relationships', 'inner-peace': 'peace',
  'keep-going': 'motivation', 'knowing-your-worth': 'self-love',
  'letting-go': 'healing', 'life-lessons': 'personal-growth',
  mindfulness: 'peace', 'moving-on': 'healing', 'never-give-up': 'resilience',
  overthinking: 'peace', 'personal-growth': 'personal-growth',
  philosophy: 'personal-growth', 'positive-thinking': 'motivation',
  productivity: 'focus', purpose: 'personal-growth', relationships: 'relationships',
  rest: 'peace', 'self-love': 'self-love', 'self-respect': 'self-love',
  'starting-again': 'resilience', 'starting-over': 'resilience',
  success: 'motivation', time: 'personal-growth', trust: 'relationships',
  'walking-away': 'healing',
};

function migrateLegacyTopics() {
  if (personalizationStorage.contains(personalizationKeys.followedTopics)) return;
  const legacyValue = personalizationStorage.getString(LEGACY_KEY);
  if (!legacyValue) return;
  try {
    const legacyIds: unknown = JSON.parse(legacyValue);
    if (Array.isArray(legacyIds)) {
      const topicIds = new Set(
        legacyIds.flatMap(id =>
          typeof id === 'string' && LEGACY_TOPIC_MAP[id]
            ? [LEGACY_TOPIC_MAP[id]]
            : [],
        ),
      );
      personalizationStorage.set(
        personalizationKeys.followedTopics,
        JSON.stringify([...topicIds]),
      );
    }
  } catch {
    // Ignore malformed legacy personalization data.
  }
}

export function useFollowedTopics() {
  migrateLegacyTopics();
  const topics = useStoredStringSet(personalizationKeys.followedTopics);

  return {
    followedTopicIds: topics.values,
    isFollowingTopic: topics.contains,
    toggleFollowedTopic: topics.toggle,
  };
}
