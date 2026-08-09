import { personalizationKeys } from '@/storage/personalizationStorage';

import { useStoredStringSet } from './useStoredStringSet';

export function useLovedQuotes() {
  const lovedQuotes = useStoredStringSet(personalizationKeys.lovedQuotes);

  return {
    isLoved: lovedQuotes.contains,
    loveQuote: lovedQuotes.add,
    lovedQuoteIds: lovedQuotes.values,
    removeLovedQuote: lovedQuotes.remove,
    toggleLovedQuote: lovedQuotes.toggle,
  };
}
