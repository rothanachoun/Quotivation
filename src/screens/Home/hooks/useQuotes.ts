import { useCallback, useEffect, useRef, useState } from 'react';

import { getQuotesByTopicIds } from '@/database/quotes';
import { getRecentlyViewedQuoteIds } from '@/hooks/useQuoteHistory';

import { mapQuoteRow } from '../mapQuoteRow';
import type { Quote } from '../types';

const CANDIDATE_QUOTE_LIMIT = 200;

type QuotesState = {
  error: string | null;
  isLoading: boolean;
  isRefreshing: boolean;
  quotes: Quote[];
};

type UseQuotesResult = QuotesState & {
  refresh: () => void;
};

function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items];

  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[randomIndex]] = [
      result[randomIndex],
      result[index],
    ];
  }

  return result;
}

function personalizeQuotes(quotes: Quote[]): Quote[] {
  const recentIds = getRecentlyViewedQuoteIds();
  const recentPositions = new Map(
    recentIds.map((quoteId, index) => [quoteId, index]),
  );
  const unseenQuotes = quotes.filter(quote => !recentPositions.has(quote.id));
  const seenQuotes = quotes
    .filter(quote => recentPositions.has(quote.id))
    .sort(
      (left, right) =>
        (recentPositions.get(right.id) ?? 0) -
        (recentPositions.get(left.id) ?? 0),
    );

  return [...shuffle(unseenQuotes), ...seenQuotes];
}

export function useQuotes(topicIds: ReadonlySet<string>): UseQuotesResult {
  const [state, setState] = useState<QuotesState>({
    error: null,
    isLoading: true,
    isRefreshing: false,
    quotes: [],
  });
  const [requestId, setRequestId] = useState(0);
  const topicKey = [...topicIds].sort().join(',');
  const previousTopicKey = useRef<string | null>(null);
  const refresh = useCallback(() => setRequestId(id => id + 1), []);

  useEffect(() => {
    let cancelled = false;
    const topicChanged = previousTopicKey.current !== topicKey;

    previousTopicKey.current = topicKey;

    setState(currentState =>
      topicChanged
        ? {
            error: null,
            isLoading: true,
            isRefreshing: false,
            quotes: [],
          }
        : {
            ...currentState,
            error: null,
            isLoading: currentState.quotes.length === 0,
            isRefreshing: currentState.quotes.length > 0,
          },
    );

    getQuotesByTopicIds([...topicIds], CANDIDATE_QUOTE_LIMIT)
      .then(rows => {
        if (!cancelled) {
          setState({
            error: null,
            isLoading: false,
            isRefreshing: false,
            quotes: personalizeQuotes(rows.map(mapQuoteRow)),
          });
        }
      })
      .catch(error => {
        if (!cancelled) {
          setState({
            error:
              error instanceof Error ? error.message : 'Could not load quotes',
            isLoading: false,
            isRefreshing: false,
            quotes: [],
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [requestId, topicKey, topicIds]);

  return { ...state, refresh };
}
