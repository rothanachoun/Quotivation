export type QuoteTextStyle = {
  color: string;
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  textAlign?: 'center' | 'left' | 'right';
};

export type QuoteAuthor = {
  name: string;
};

export type DecorationName =
  | 'block'
  | 'classic'
  | 'compact'
  | 'soft'
  | 'round';

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
  decoration: DecorationName;
  id: string;
  imageUrl: string | null;
  segments: QuoteSegment[];
  style: QuoteTextStyle;
  text: string;
  textColor: string;
  type: 'image' | 'text';
};
