import type { ImageStyle, StyleProp } from 'react-native';
import VectorImage from 'react-native-vector-image';

export type QuoteIconName =
  | 'quote-1'
  | 'quote-2'
  | 'quote-3'
  | 'quote-4'
  | 'quote-5';

type QuoteIconProps = {
  color?: string;
  name: QuoteIconName;
  size?: number;
  style?: StyleProp<ImageStyle>;
};

const SOURCES = {
  'quote-1': require('@/assets/icons/quote-1.svg'),
  'quote-2': require('@/assets/icons/quote-2.svg'),
  'quote-3': require('@/assets/icons/quote-3.svg'),
  'quote-4': require('@/assets/icons/quote-4.svg'),
  'quote-5': require('@/assets/icons/quote-5.svg'),
} as const;

function QuoteIcon({
  color = '#000000',
  name,
  size = 24,
  style,
}: QuoteIconProps) {
  return (
    <VectorImage
      accessible={false}
      source={SOURCES[name]}
      style={[{ height: size, tintColor: color, width: size * (4 / 3) }, style]}
    />
  );
}

export default QuoteIcon;
