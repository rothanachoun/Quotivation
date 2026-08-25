import type { QuoteRow } from '@/database/quotes';

import type {
  Quote,
  QuoteSegment,
  QuoteTextStyle,
} from './types';
import { resolveDecorationName } from './decorations';

const DEFAULT_TEXT_STYLE: QuoteTextStyle = {
  color: '#FFFFFF',
  fontFamily: 'DMSerifDisplay-Regular',
  fontSize: 34,
  lineHeight: 48,
  textAlign: 'center',
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
    ...parseJson<Partial<QuoteTextStyle>>(row.style, {}),
  };

  return {
    author: {
      name: row.author ?? '',
    },
    backgroundColor: row.background_color,
    backgroundImageUrl: row.background_image_url,
    decoration: resolveDecorationName(row.decoration),
    id: row.id,
    imageUrl: row.image_url,
    segments: parseJson<QuoteSegment[]>(row.segments, [
      { text: row.text },
    ]),
    style,
    text: row.text,
    textColor: style.color,
    type: row.type,
  };
}
