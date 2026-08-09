import { useEffect, useState } from 'react';

import { getQuotes } from '@/database/quotes';

import { mapQuoteRow } from '../mapQuoteRow';
import type { Quote } from '../types';

const INITIAL_QUOTE_LIMIT = 50;

type QuotesState = {
  error: string | null;
  isLoading: boolean;
  quotes: Quote[];
};

export function useQuotes(): QuotesState {
  const [state, setState] = useState<QuotesState>({
    error: null,
    isLoading: true,
    quotes: [],
  });

  useEffect(() => {
    let cancelled = false;

    getQuotes(INITIAL_QUOTE_LIMIT)
      .then(rows => {
        if (!cancelled) {
          setState({
            error: null,
            isLoading: false,
            quotes: rows.map(mapQuoteRow),
          });
        }
      })
      .catch(error => {
        if (!cancelled) {
          setState({
            error:
              error instanceof Error ? error.message : 'Could not load quotes',
            isLoading: false,
            quotes: [],
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
