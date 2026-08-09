import type { QuoteIconName } from '@/components/icons';

export type QuoteTextStyle = {
  color: string;
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  textAlign?: 'center' | 'left' | 'right';
};

export type QuoteAuthor = {
  name: string;
  style: QuoteTextStyle;
};

export type QuoteSymbol = {
  alignment: 'center' | 'left' | 'right';
  icon: QuoteIconName;
  placement: 'background' | 'bottom' | 'top';
  size: number;
};

export type QuoteSegment = {
  style?: {
    color?: string;
    fontFamily?: string;
    fontSize?: number;
    fontStyle?: 'italic' | 'normal';
  };
  text: string;
};

export type Quote = {
  author: QuoteAuthor;
  backgroundColor: string;
  backgroundImageUrl: string | null;
  id: string;
  imageUrl: string | null;
  segments: QuoteSegment[];
  style: QuoteTextStyle;
  symbol: QuoteSymbol;
  text: string;
  textColor: string;
  type: 'image' | 'text';
};
