import VectorImage from 'react-native-vector-image';

import type { IconProps } from './types';

const TOPIC_ICON_SOURCES = {
  confidence: require('@/assets/icons/topic-confidence.svg'),
  focus: require('@/assets/icons/topic-focus.svg'),
  gratitude: require('@/assets/icons/topic-gratitude.svg'),
  healing: require('@/assets/icons/topic-healing.svg'),
  motivation: require('@/assets/icons/topic-motivation.svg'),
  peace: require('@/assets/icons/topic-peace.svg'),
  'personal-growth': require('@/assets/icons/topic-personal-growth.svg'),
  relationships: require('@/assets/icons/topic-relationships.svg'),
  resilience: require('@/assets/icons/topic-resilience.svg'),
  'self-love': require('@/assets/icons/topic-self-love.svg'),
} as const;

export type TopicIconName = keyof typeof TOPIC_ICON_SOURCES;

type TopicIconProps = IconProps & {
  name: TopicIconName;
};

function TopicIcon({
  accessibilityLabel,
  color = '#000000',
  name,
  size = 24,
  style,
}: TopicIconProps) {
  return (
    <VectorImage
      accessibilityLabel={accessibilityLabel}
      accessible={Boolean(accessibilityLabel)}
      source={TOPIC_ICON_SOURCES[name]}
      style={[{ height: size, tintColor: color, width: size }, style]}
    />
  );
}

export default TopicIcon;
