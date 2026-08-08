import type { ImageStyle, StyleProp } from 'react-native';

export type IconProps = {
  /** Accessible description. Omit for purely decorative icons. */
  accessibilityLabel?: string;
  /** Icon tint. SVG artwork should be monochrome for predictable tinting. */
  color?: string;
  /** Rendered width and height. */
  size?: number;
  style?: StyleProp<ImageStyle>;
};
