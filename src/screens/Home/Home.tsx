import { useCallback, useRef, useState } from 'react';
import type { ListRenderItem } from 'react-native';
import {
  ActivityIndicator,
  Animated,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import QuotePage from './components/QuotePage';
import { useQuotes } from './hooks/useQuotes';
import type { Quote } from './types';

const TAB_BAR_CLEARANCE = 68;
const MINIMUM_ACTION_INSET = 12;

function getShareMessage(quote: Quote): string {
  return quote.author.name
    ? `${quote.text} — ${quote.author.name}`
    : quote.text;
}

function Home() {
  const insets = useSafeAreaInsets();
  const { error, isLoading, quotes } = useQuotes();
  const [lovedQuoteIds, setLovedQuoteIds] = useState<Set<string>>(new Set());
  const [pageHeight, setPageHeight] = useState(0);
  const scrollY = useRef(new Animated.Value(0)).current;
  const actionBottom =
    Math.max(insets.bottom, MINIMUM_ACTION_INSET) + TAB_BAR_CLEARANCE;

  const toggleLovedQuote = useCallback((quoteId: string) => {
    setLovedQuoteIds(currentIds => {
      const nextIds = new Set(currentIds);

      if (nextIds.has(quoteId)) {
        nextIds.delete(quoteId);
      } else {
        nextIds.add(quoteId);
      }

      return nextIds;
    });
  }, []);

  const shareQuote = useCallback((quote: Quote) => {
    Share.share({ message: getShareMessage(quote) });
  }, []);

  const renderItem = useCallback<ListRenderItem<Quote>>(
    ({ index, item }) => (
      <QuotePage
        actionBottom={actionBottom}
        height={pageHeight}
        index={index}
        isLoved={lovedQuoteIds.has(item.id)}
        onShare={shareQuote}
        onToggleLove={toggleLovedQuote}
        quote={item}
        scrollY={scrollY}
      />
    ),
    [
      actionBottom,
      lovedQuoteIds,
      pageHeight,
      shareQuote,
      scrollY,
      toggleLovedQuote,
    ],
  );

  const canRenderFeed =
    !isLoading && !error && pageHeight > 0 && quotes.length > 0;

  return (
    <View
      onLayout={event => setPageHeight(event.nativeEvent.layout.height)}
      style={styles.container}
    >
      {isLoading && <ActivityIndicator style={styles.centeredState} />}
      {!isLoading && error && (
        <Text style={styles.centeredStateText}>{error}</Text>
      )}
      {!isLoading && !error && quotes.length === 0 && (
        <Text style={styles.centeredStateText}>No quotes available.</Text>
      )}
      {canRenderFeed && (
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
  container: {
    flex: 1,
  },
});

export default Home;
