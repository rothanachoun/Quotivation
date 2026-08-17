import { memo, useRef, type ReactNode } from 'react';
import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { HeartIcon, QuoteIcon, ShareIcon } from '@/components/icons';
import { colors } from '@/theme/colors';

import { DECORATION_PRESETS } from '../decorations';
import type { DecorationName, Quote } from '../types';

type QuotePageProps = {
  height: number;
  index: number;
  isLoved: boolean;
  onShare: (quote: Quote) => void;
  onToggleLove: (quoteId: string) => void;
  quote: Quote;
  scrollY: Animated.Value;
};

type DecorationProps = {
  color: string;
  name: DecorationName;
};

type IconButtonProps = {
  accessibilityLabel: string;
  children: ReactNode;
  onPress: () => void;
  selected?: boolean;
};

function IconButton({
  accessibilityLabel,
  children,
  onPress,
  selected,
}: IconButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (toValue: number) => {
    Animated.spring(scale, {
      damping: 14,
      mass: 0.45,
      stiffness: 260,
      toValue,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={selected === undefined ? undefined : { selected }}
      hitSlop={8}
      onPress={onPress}
      onPressIn={() => animateTo(0.78)}
      onPressOut={() => animateTo(1)}
    >
      <Animated.View style={[styles.iconButton, { transform: [{ scale }] }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

function Decoration({ color, name }: DecorationProps) {
  const preset = DECORATION_PRESETS[name];

  return (
    <View pointerEvents="none" style={styles.symbolLayer}>
      <View
        style={[
          styles.symbolPosition,
          preset.placement === 'top' && styles.symbolTop,
          preset.placement === 'bottom' && styles.symbolBottom,
          preset.placement === 'background' && styles.symbolBackground,
          preset.alignment === 'left' && styles.symbolAlignLeft,
          preset.alignment === 'center' && styles.symbolAlignCenter,
        ]}
      >
        <QuoteIcon
          color={color}
          name={preset.icon}
          size={preset.size}
          style={
            preset.placement === 'background'
              ? styles.symbolImageBackground
              : styles.symbolImage
          }
        />
      </View>
    </View>
  );
}

function QuotePage({
  height,
  index,
  isLoved,
  onShare,
  onToggleLove,
  quote,
  scrollY,
}: QuotePageProps) {
  const actionsOpacity = scrollY.interpolate({
    inputRange: [
      (index - 1) * height,
      (index - 0.5) * height,
      index * height,
      (index + 0.5) * height,
      (index + 1) * height,
    ],
    outputRange: [0, 0, 1, 0, 0],
    extrapolate: 'clamp',
  });

  const accessibilityLabel = quote.author.name
    ? `${quote.text} — ${quote.author.name}`
    : quote.text;

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      style={[
        styles.quotePage,
        { backgroundColor: quote.backgroundColor, height },
      ]}
    >
      {quote.type === 'image' && quote.imageUrl ? (
        <Image
          resizeMode="cover"
          source={{ cache: 'force-cache', uri: quote.imageUrl }}
          style={styles.backgroundImage}
        />
      ) : (
        <>
          {quote.backgroundImageUrl && (
            <Image
              resizeMode="cover"
              source={{
                cache: 'force-cache',
                uri: quote.backgroundImageUrl,
              }}
              style={styles.backgroundImage}
            />
          )}
          {quote.backgroundImageUrl && (
            <View pointerEvents="none" style={styles.imageOverlay} />
          )}
          <View style={styles.quoteContent}>
            <Decoration color={quote.style.color} name={quote.decoration} />
            <View style={styles.quoteCopy}>
              <Text
                accessibilityLabel={quote.text}
                style={[styles.quoteText, quote.style]}
              >
                {quote.segments.map((segment, segmentIndex) => (
                  <Text
                    key={`${quote.id}-segment-${segmentIndex}`}
                    style={segment.style}
                  >
                    {segment.text}
                  </Text>
                ))}
              </Text>
              {quote.author.name && (
                <Text
                  style={[
                    styles.author,
                    {
                      color: quote.style.color,
                      fontFamily: quote.style.fontFamily,
                      textAlign: quote.style.textAlign,
                    },
                  ]}
                >
                  — {quote.author.name}
                </Text>
              )}
            </View>
            <Animated.View
              pointerEvents="box-none"
              style={[styles.actions, { opacity: actionsOpacity }]}
            >
              <View style={styles.actionContainer}>
                <IconButton
                  accessibilityLabel={
                    isLoved ? 'Remove from favorites' : 'Love quote'
                  }
                  onPress={() => onToggleLove(quote.id)}
                  selected={isLoved}
                >
                  <HeartIcon
                    color={isLoved ? colors.danger : quote.textColor}
                    size={32}
                  />
                </IconButton>

                <IconButton
                  accessibilityLabel="Share quote"
                  onPress={() => onShare(quote)}
                >
                  <ShareIcon color={quote.textColor} size={32} />
                </IconButton>
              </View>
            </Animated.View>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  actionContainer: {
    flexDirection: 'row',
    gap: 14,
  },
  actions: {
    alignItems: 'center',
    marginTop: 28,
  },
  author: {
    alignSelf: 'stretch',
    fontSize: 15,
    lineHeight: 21,
    marginTop: 28,
    opacity: 0.72,
  },
  backgroundImage: {
    bottom: 0,
    height: '100%',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    width: '100%',
  },
  iconButton: {
    alignItems: 'center',
    height: 54,
    justifyContent: 'center',
    width: 54,
  },
  imageOverlay: {
    backgroundColor: colors.overlay,
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  quoteContent: {
    justifyContent: 'center',
    paddingHorizontal: 36,
    paddingVertical: 48,
    position: 'relative',
  },
  quoteCopy: {
    paddingTop: 72,
    zIndex: 1,
  },
  quotePage: {
    backgroundColor: colors.background,
    justifyContent: 'center',
    overflow: 'hidden',
    width: '100%',
  },
  quoteText: {
    letterSpacing: 0,
    textAlign: 'center',
  },
  symbolAlignCenter: {
    justifyContent: 'center',
  },
  symbolAlignLeft: {
    justifyContent: 'flex-start',
    left: 16
  },
  symbolBackground: {
    bottom: 0,
    top: 0,
  },
  symbolBottom: {
    bottom: 0,
  },
  symbolImage: {
    opacity: 0.55,
  },
  symbolImageBackground: {
    opacity: 0.1,
  },
  symbolLayer: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 0,
  },
  symbolPosition: {
    alignItems: 'center',
    flexDirection: 'row',
    left: 0,
    position: 'absolute',
    right: 0,
  },
  symbolTop: {
    top: 0,
  },
});

export default memo(QuotePage);
