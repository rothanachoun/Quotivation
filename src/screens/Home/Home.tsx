import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ListRenderItem, ViewToken } from 'react-native';
import {
  ActivityIndicator,
  Animated,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import categoryGroupsData from '@/assets/db/categories.json';
import { useLovedQuotes } from '@/hooks/useLovedQuotes';
import { useFollowedCategories } from '@/hooks/useFollowedCategories';
import { useQuoteHistory } from '@/hooks/useQuoteHistory';
import { Paths } from '@/navigation/paths';
import type { RootStackParamList } from '@/navigation/types';
import { colors } from '@/theme/colors';

import QuotePage from './components/QuotePage';
import { useQuotes } from './hooks/useQuotes';
import type { Quote } from './types';

type HomeProps = NativeStackScreenProps<RootStackParamList, Paths.Home>;

type CategoryGroup = {
  categories: Array<{ id: string; name: string }>;
};

const CATEGORY_NAMES = new Map(
  (categoryGroupsData as CategoryGroup[]).flatMap(group =>
    group.categories.map(category => [category.id, category.name] as const),
  ),
);

function getShareMessage(quote: Quote): string {
  return quote.author.name
    ? `${quote.text} — ${quote.author.name}`
    : quote.text;
}

function Home({ navigation }: HomeProps) {
  const { followedCategoryNames } = useFollowedCategories();
  const headerTitle = useMemo(() => {
    const selectedNames = [...followedCategoryNames].map(
      categoryId => CATEGORY_NAMES.get(categoryId) ?? categoryId,
    );

    if (selectedNames.length === 0) {
      return 'For You';
    }

    return selectedNames.length === 1
      ? selectedNames[0]
      : `${selectedNames[0]} +${selectedNames.length - 1}`;
  }, [followedCategoryNames]);
  const { error, isLoading, isRefreshing, quotes, refresh } = useQuotes(
    followedCategoryNames,
  );
  const { isLoved, toggleLovedQuote } = useLovedQuotes();
  const { recordQuoteViewed } = useQuoteHistory();
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

  useLayoutEffect(() => {
    navigation.setOptions({ headerTitle });
  }, [headerTitle, navigation]);

  const shareQuote = useCallback((quote: Quote) => {
    Share.share({ message: getShareMessage(quote) });
  }, []);

  const refreshFeed = useCallback(() => {
    lastViewedQuoteId.current = null;
    scrollY.setValue(0);
    refresh();
  }, [refresh, scrollY]);

  const renderItem = useCallback<ListRenderItem<Quote>>(
    ({ index, item }) => (
      <QuotePage
        height={pageHeight}
        index={index}
        isLoved={isLoved(item.id)}
        onShare={shareQuote}
        onToggleLove={toggleLovedQuote}
        quote={item}
        scrollY={scrollY}
      />
    ),
    [isLoved, pageHeight, shareQuote, scrollY, toggleLovedQuote],
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
        <Text style={styles.centeredStateText}>
          {followedCategoryNames.size === 0
            ? 'Choose topics in Profile to personalize your feed.'
            : 'No quotes are available for your followed categories.'}
        </Text>
      )}
      {canRenderFeed && (
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
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true },
          )}
          onRefresh={refreshFeed}
          onViewableItemsChanged={onViewableItemsChanged}
          pagingEnabled
          refreshing={isRefreshing}
          renderItem={renderItem}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          style={styles.feed}
          windowSize={3}
          viewabilityConfig={viewabilityConfig}
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
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  feed: {
    backgroundColor: colors.background,
    flex: 1,
  },
});

export default Home;
