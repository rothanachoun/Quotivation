import VectorImage from 'react-native-vector-image';

import type { IconProps } from './types';

function SettingsIcon({
  accessibilityLabel,
  color = '#000000',
  size = 24,
  style,
}: IconProps) {
  return (
    <VectorImage
      accessibilityLabel={accessibilityLabel}
      accessible={Boolean(accessibilityLabel)}
      source={require('@/assets/icons/settings.svg')}
      style={[{ height: size, tintColor: color, width: size }, style]}
    />
  );
}

export default SettingsIcon;
