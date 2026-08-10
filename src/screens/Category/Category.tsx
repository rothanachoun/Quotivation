import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useMemo, useRef, useState } from 'react';
import type { ListRenderItem, ViewToken } from 'react-native';
import {
  ActivityIndicator,
  Animated,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useLovedQuotes } from '@/hooks/useLovedQuotes';
import { useQuoteHistory } from '@/hooks/useQuoteHistory';
import { Paths } from '@/navigation/paths';
import type { RootStackParamList } from '@/navigation/types';
import QuotePage from '@/screens/Home/components/QuotePage';
import { useQuotes } from '@/screens/Home/hooks/useQuotes';
import type { Quote } from '@/screens/Home/types';
import { colors } from '@/theme/colors';

type CategoryProps = NativeStackScreenProps<RootStackParamList, Paths.Category>;

const TAB_BAR_CLEARANCE = 68;
const MINIMUM_ACTION_INSET = 12;

function Category({ route }: CategoryProps) {
  const { categoryId } = route.params;
  const categories = useMemo(() => new Set([categoryId]), [categoryId]);
  const { error, isLoading, isRefreshing, quotes, refresh } =
    useQuotes(categories);
  const { isLoved, toggleLovedQuote } = useLovedQuotes();
  const { recordQuoteViewed } = useQuoteHistory();
  const insets = useSafeAreaInsets();
  const [pageHeight, setPageHeight] = useState(0);
  const scrollY = useRef(new Animated.Value(0)).current;
  const lastViewedQuoteId = useRef<string | null>(null);
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 60,
    minimumViewTime: 250,
  }).current;
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken<Quote>[] }) => {
      const visibleQuote = viewableItems.find(item => item.isViewable)?.item;
      if (visibleQuote && lastViewedQuoteId.current !== visibleQuote.id) {
        lastViewedQuoteId.current = visibleQuote.id;
        recordQuoteViewed(visibleQuote.id);
      }
    },
  ).current;
  const actionBottom =
    Math.max(insets.bottom, MINIMUM_ACTION_INSET) + TAB_BAR_CLEARANCE;

  const shareQuote = useCallback((quote: Quote) => {
    Share.share({
      message: quote.author.name
        ? `${quote.text} — ${quote.author.name}`
        : quote.text,
    });
  }, []);

  const refreshQuotes = useCallback(() => {
    lastViewedQuoteId.current = null;
    scrollY.setValue(0);
    refresh();
  }, [refresh, scrollY]);

  const renderItem = useCallback<ListRenderItem<Quote>>(
    ({ index, item }) => (
      <QuotePage
        actionBottom={actionBottom}
        height={pageHeight}
        index={index}
        isLoved={isLoved(item.id)}
        onShare={shareQuote}
        onToggleLove={toggleLovedQuote}
        quote={item}
        scrollY={scrollY}
      />
    ),
    [actionBottom, isLoved, pageHeight, scrollY, shareQuote, toggleLovedQuote],
  );

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
        <Text style={styles.centeredStateText}>
          No quotes are available in this category yet.
        </Text>
      )}
      {!isLoading && !error && pageHeight > 0 && quotes.length > 0 && (
        <Animated.FlatList
          automaticallyAdjustContentInsets={false}
          contentInsetAdjustmentBehavior="never"
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
          onRefresh={refreshQuotes}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true },
          )}
          onViewableItemsChanged={onViewableItemsChanged}
          pagingEnabled
          refreshing={isRefreshing}
          renderItem={renderItem}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          viewabilityConfig={viewabilityConfig}
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
    color: colors.textSecondary,
    left: 24,
    position: 'absolute',
    right: 24,
    textAlign: 'center',
    top: '50%',
  },
  container: { backgroundColor: colors.background, flex: 1 },
});

export default Category;
