import { useCallback, useEffect, useRef, useState } from 'react';
import type { ListRenderItem } from 'react-native';
import {
  Animated,
  ActivityIndicator,
  Image,
  Pressable,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  isLiquidGlassSupported,
  LiquidGlassContainerView,
  LiquidGlassView,
} from '@callstack/liquid-glass';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { QuoteIconName } from '@/components/icons';
import { HeartIcon, QuoteIcon, ShareIcon } from '@/components/icons';
import { getQuotes, type QuoteRow } from '@/database/quotes';

type QuoteTextStyle = {
  color: string;
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  textAlign?: 'center' | 'left' | 'right';
};

type QuoteAuthor = {
  name: string;
  style: QuoteTextStyle;
};

type QuoteSymbol = {
  alignment: 'center' | 'left' | 'right';
  icon: QuoteIconName;
  placement: 'background' | 'bottom' | 'top';
  size: number;
};

type QuoteSegment = {
  style?: {
    color?: string;
    fontFamily?: string;
    fontSize?: number;
    fontStyle?: 'italic' | 'normal';
  };
  text: string;
};

type Quote = {
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

function mapQuoteRow(row: QuoteRow): Quote {
  const style = {
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


type QuotePageProps = {
  actionBottom: number;
  height: number;
  index: number;
  isLoved: boolean;
  onShare: () => void;
  onToggleLove: () => void;
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
          style={[
            symbol.placement === 'background'
              ? styles.symbolImageBackground
              : styles.symbolImage,
          ]}
        />
      </View>
    </View>
  );
}

function QuotePage({
  actionBottom,
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

  return (
    <View
      accessibilityLabel={`${quote.text} — ${quote.author.name}`}
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
          </View>
        </>
      )}

      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.actions,
          { bottom: actionBottom, opacity: actionsOpacity },
        ]}
      >
        <LiquidGlassContainerView spacing={12} style={styles.actionContainer}>
          <Pressable
            accessibilityLabel={
              isLoved ? 'Remove from favorites' : 'Love quote'
            }
            accessibilityRole="button"
            accessibilityState={{ selected: isLoved }}
            hitSlop={8}
            onPress={onToggleLove}
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
            onPress={onShare}
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
  );
}

function Home() {
  const insets = useSafeAreaInsets();
  const [databaseError, setDatabaseError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lovedQuoteIds, setLovedQuoteIds] = useState<Set<string>>(new Set());
  const [pageHeight, setPageHeight] = useState(0);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const scrollY = useRef(new Animated.Value(0)).current;
  const actionBottom = Math.max(insets.bottom, 12) + 68;

  useEffect(() => {
    let isMounted = true;

    getQuotes(50)
      .then(rows => {
        if (isMounted) {
          setQuotes(rows.map(mapQuoteRow));
        }
      })
      .catch(error => {
        if (isMounted) {
          setDatabaseError(
            error instanceof Error ? error.message : 'Could not load quotes',
          );
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const renderItem = useCallback<ListRenderItem<Quote>>(
    ({ index, item }) => (
      <QuotePage
        actionBottom={actionBottom}
        height={pageHeight}
        index={index}
        isLoved={lovedQuoteIds.has(item.id)}
        onShare={() => {
          Share.share({
            message: item.author.name
              ? `${item.text} — ${item.author.name}`
              : item.text,
          });
        }}
        onToggleLove={() => {
          setLovedQuoteIds(currentIds => {
            const nextIds = new Set(currentIds);

            if (nextIds.has(item.id)) {
              nextIds.delete(item.id);
            } else {
              nextIds.add(item.id);
            }

            return nextIds;
          });
        }}
        quote={item}
        scrollY={scrollY}
      />
    ),
    [actionBottom, lovedQuoteIds, pageHeight, scrollY],
  );

  return (
    <View
      onLayout={event => setPageHeight(event.nativeEvent.layout.height)}
      style={styles.container}
    >
      {isLoading && <ActivityIndicator style={styles.centeredState} />}
      {!isLoading && databaseError && (
        <Text style={styles.centeredStateText}>{databaseError}</Text>
      )}
      {!isLoading && !databaseError && quotes.length === 0 && (
        <Text style={styles.centeredStateText}>No quotes available.</Text>
      )}
      {!isLoading && !databaseError && pageHeight > 0 && quotes.length > 0 && (
        <Animated.FlatList
          data={quotes}
          decelerationRate="fast"
          disableIntervalMomentum
          getItemLayout={(_data, index) => ({
            index,
            length: pageHeight,
            offset: pageHeight * index,
          })}
          initialNumToRender={2}
          keyExtractor={item => item.id}
          maxToRenderPerBatch={3}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true },
          )}
          pagingEnabled
          renderItem={renderItem}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          windowSize={3}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  actionContainer: {
    gap: 14,
  },
  actions: {
    position: 'absolute',
    right: 18,
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
  container: {
    flex: 1,
  },
  centeredState: {
    left: 0,
    position: 'absolute',
    right: 0,
    top: '50%',
  },
  centeredStateText: {
    color: '#555555',
    left: 24,
    position: 'absolute',
    right: 24,
    textAlign: 'center',
    top: '50%',
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
  quotePage: {
    backgroundColor: '#111111',
    overflow: 'hidden',
    justifyContent: 'center',
    width: '100%',
  },
  quoteCopy: {
    paddingBottom: 82,
    paddingTop: 104,
    zIndex: 1,
  },
  quoteText: {
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  symbolLayer: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 0,
  },
  symbolBackground: {
    bottom: 0,
    top: 0,
  },
  symbolAlignCenter: {
    justifyContent: 'center',
  },
  symbolAlignLeft: {
    justifyContent: 'flex-start',
  },
  symbolAlignRight: {
    justifyContent: 'flex-end',
  },
  symbolBottom: {
    bottom: 0,
  },
  symbolPosition: {
    alignItems: 'center',
    flexDirection: 'row',
    left: 0,
    position: 'absolute',
    right: 0,
  },
  symbolImage: {
    opacity: 0.8,
  },
  symbolImageBackground: {
    opacity: 0.1,
  },
  symbolTop: {
    top: 0,
  },
});

export default Home;
