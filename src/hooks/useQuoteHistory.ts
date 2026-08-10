import { useCallback } from 'react';

import {
  personalizationKeys,
  personalizationStorage,
} from '@/storage/personalizationStorage';

const MAX_RECENT_QUOTES = 200;

export function getRecentlyViewedQuoteIds(): string[] {
  const storedValue = personalizationStorage.getString(
    personalizationKeys.recentlyViewedQuotes,
  );

  if (!storedValue) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(storedValue);

    return Array.isArray(parsed)
      ? parsed.filter(item => typeof item === 'string')
      : [];
  } catch {
    return [];
  }
}

export function useQuoteHistory() {
  const recordQuoteViewed = useCallback((quoteId: string) => {
    const recentIds = getRecentlyViewedQuoteIds().filter(
      recentId => recentId !== quoteId,
    );

    personalizationStorage.set(
      personalizationKeys.recentlyViewedQuotes,
      JSON.stringify([quoteId, ...recentIds].slice(0, MAX_RECENT_QUOTES)),
    );
  }, []);

  const clearQuoteHistory = useCallback(() => {
    personalizationStorage.remove(personalizationKeys.recentlyViewedQuotes);
  }, []);

  return {
    clearQuoteHistory,
    recordQuoteViewed,
  };
}
