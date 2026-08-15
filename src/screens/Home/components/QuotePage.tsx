import { memo } from 'react';
import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  isLiquidGlassSupported,
  LiquidGlassContainerView,
  LiquidGlassView,
} from '@callstack/liquid-glass';

import { HeartIcon, QuoteIcon, ShareIcon } from '@/components/icons';

import type { Quote, QuoteSymbol } from '../types';

type QuotePageProps = {
  height: number;
  index: number;
  isLoved: boolean;
  onShare: (quote: Quote) => void;
  onToggleLove: (quoteId: string) => void;
  quote: Quote;
  scrollY: Animated.Value;
};

type QuoteSymbolViewProps = {
  color: string;
  symbol: QuoteSymbol;
};

function QuoteSymbolView({ color, symbol }: QuoteSymbolViewProps) {
  return (
    <View pointerEvents="none" style={styles.symbolLayer}>
      <View
        style={[
          styles.symbolPosition,
          symbol.placement === 'top' && styles.symbolTop,
          symbol.placement === 'bottom' && styles.symbolBottom,
          symbol.placement === 'background' && styles.symbolBackground,
          symbol.alignment === 'left' && styles.symbolAlignLeft,
          symbol.alignment === 'center' && styles.symbolAlignCenter,
          symbol.alignment === 'right' && styles.symbolAlignRight,
        ]}
      >
        <QuoteIcon
          color={color}
          name={symbol.icon}
          size={symbol.size}
          style={
            symbol.placement === 'background'
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
            <QuoteSymbolView color={quote.style.color} symbol={quote.symbol} />
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
                <Text style={[styles.author, quote.author.style]}>
                  — {quote.author.name}
                </Text>
              )}
            </View>
            <Animated.View
              pointerEvents="box-none"
              style={[styles.actions, { opacity: actionsOpacity }]}
            >
              <LiquidGlassContainerView
                spacing={12}
                style={styles.actionContainer}
              >
                <Pressable
                  accessibilityLabel={
                    isLoved ? 'Remove from favorites' : 'Love quote'
                  }
                  accessibilityRole="button"
                  accessibilityState={{ selected: isLoved }}
                  hitSlop={8}
                  onPress={() => onToggleLove(quote.id)}
                >
                  <LiquidGlassView
                    effect="regular"
                    interactive
                    style={[
                      styles.glassButton,
                      !isLiquidGlassSupported && styles.glassButtonFallback,
                    ]}
                  >
                    <HeartIcon
                      color={isLoved ? '#E5484D' : quote.textColor}
                      size={25}
                    />
                  </LiquidGlassView>
                </Pressable>

                <Pressable
                  accessibilityLabel="Share quote"
                  accessibilityRole="button"
                  hitSlop={8}
                  onPress={() => onShare(quote)}
                >
                  <LiquidGlassView
                    effect="regular"
                    interactive
                    style={[
                      styles.glassButton,
                      !isLiquidGlassSupported && styles.glassButtonFallback,
                    ]}
                  >
                    <ShareIcon color={quote.textColor} size={25} />
                  </LiquidGlassView>
                </Pressable>
              </LiquidGlassContainerView>
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
  glassButton: {
    alignItems: 'center',
    borderRadius: 27,
    height: 54,
    justifyContent: 'center',
    width: 54,
  },
  glassButtonFallback: {
    backgroundColor: 'rgba(255, 255, 255, 0.58)',
    borderColor: 'rgba(255, 255, 255, 0.75)',
    borderWidth: StyleSheet.hairlineWidth,
  },
  imageOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.42)',
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
    paddingTop: 104,
    zIndex: 1,
  },
  quotePage: {
    backgroundColor: '#111111',
    justifyContent: 'center',
    overflow: 'hidden',
    width: '100%',
  },
  quoteText: {
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  symbolAlignCenter: {
    justifyContent: 'center',
  },
  symbolAlignLeft: {
    justifyContent: 'flex-start',
    left: 16
  },
  symbolAlignRight: {
    justifyContent: 'flex-end',
    right: 16
  },
  symbolBackground: {
    bottom: 0,
    top: 0,
  },
  symbolBottom: {
    bottom: 0,
  },
  symbolImage: {
    opacity: 0.8,
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
