import type { QuoteRow } from '@/database/quotes';

import type {
  Quote,
  QuoteAuthor,
  QuoteSegment,
  QuoteSymbol,
  QuoteTextStyle,
} from './types';

const DEFAULT_TEXT_STYLE: QuoteTextStyle = {
  color: '#FFFFFF',
  fontFamily: 'DMSerifDisplay-Regular',
  fontSize: 34,
  lineHeight: 48,
  textAlign: 'center',
};

const DEFAULT_AUTHOR_STYLE: QuoteTextStyle = {
  color: '#FFFFFF',
  fontFamily: 'Manrope-SemiBold',
  fontSize: 17,
  lineHeight: 24,
  textAlign: 'left',
};

const DEFAULT_SYMBOL: QuoteSymbol = {
  alignment: 'left',
  icon: 'quote-1',
  placement: 'top',
  size: 72,
};

function parseJson<T>(value: string | null, fallback: T): T {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function mapQuoteRow(row: QuoteRow): Quote {
  const style: QuoteTextStyle = {
    ...DEFAULT_TEXT_STYLE,
    ...parseJson<Partial<QuoteTextStyle>>(row.style_json, {}),
  };
  const authorData = parseJson<Partial<QuoteAuthor>>(row.author_json, {});

  return {
    author: {
      name: authorData.name ?? '',
      style: {
        ...DEFAULT_AUTHOR_STYLE,
        ...authorData.style,
      },
    },
    backgroundColor: row.background_color,
    backgroundImageUrl: row.background_image_url,
    id: row.id,
    imageUrl: row.image_url,
    segments: parseJson<QuoteSegment[]>(row.segments_json, [
      { text: row.text },
    ]),
    style,
    symbol: {
      ...DEFAULT_SYMBOL,
      ...parseJson<Partial<QuoteSymbol>>(row.symbol_json, {}),
    },
    text: row.text,
    textColor: style.color,
    type: row.type,
  };
}
