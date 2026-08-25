import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons/static';
import { useEffect, useMemo, useState } from 'react';
import { useTheme, type MD3Theme } from 'react-native-paper';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TopicIcon, type TopicIconName } from '@/components/icons';
import { getQuoteTopics, type QuoteTopic } from '@/database/quotes';
import {
  PERSONALIZED_FEED_ID,
  useSelectedTopic,
} from '@/hooks/useSelectedTopic';
import { Paths } from '@/navigation/paths';
import type { RootStackParamList } from '@/navigation/types';

type ExploreProps = NativeStackScreenProps<RootStackParamList, Paths.Explore>;

function Explore({ navigation }: ExploreProps) {
  const theme = useTheme<MD3Theme>();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const insets = useSafeAreaInsets();
  const { selectedTopicId, selectTopic } = useSelectedTopic();
  const [topics, setTopics] = useState<QuoteTopic[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    getQuoteTopics()
      .then(result => {
        if (!cancelled) setTopics(result);
      })
      .catch(loadError => {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Could not load topics',
          );
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 120 },
        ]}
        contentInsetAdjustmentBehavior="automatic"
        columnWrapperStyle={styles.topicRow}
        data={isLoading || error ? [] : topics}
        keyExtractor={topic => topic.id}
        ListHeaderComponent={
          <Pressable
            accessibilityHint="Shows quotes from all topics you follow on Home"
            accessibilityRole="button"
            accessibilityState={{
              selected: selectedTopicId === PERSONALIZED_FEED_ID,
            }}
            onPress={() => {
              selectTopic(PERSONALIZED_FEED_ID);
              navigation.goBack();
            }}
            style={({ pressed }) => [
              styles.personalizedCard,
              selectedTopicId === PERSONALIZED_FEED_ID && styles.selectedCard,
              pressed && styles.pressedCard,
            ]}
          >
            <View style={styles.personalizedCopy}>
              <Text style={styles.personalizedName}>Personalized</Text>
              <Text style={styles.personalizedDescription}>
                Quotes from the topics you follow
              </Text>
            </View>
            <MaterialDesignIcons
              color={theme.colors.onSurfaceVariant}
              name="account-heart-outline"
              size={46}
              style={styles.personalizedIcon}
            />
            {selectedTopicId === PERSONALIZED_FEED_ID && (
              <View
                accessibilityElementsHidden
                pointerEvents="none"
                style={styles.selectedBadge}
              >
                <MaterialDesignIcons
                  color={theme.colors.onPrimary}
                  name="check"
                  size={14}
                />
              </View>
            )}
          </Pressable>
        }
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator style={styles.centeredState} />
          ) : (
            <Text style={styles.centeredStateText}>
              {error ?? 'No topics found.'}
            </Text>
          )
        }
        numColumns={2}
        renderItem={({ item }) => {
          const selected = selectedTopicId === item.id;

          return (
            <Pressable
              accessibilityHint="Shows only this topic on Home"
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => {
                selectTopic(item.id);
                navigation.goBack();
              }}
              style={({ pressed }) => [
                styles.topicCardShell,
                selected && styles.selectedCard,
                pressed && styles.pressedCard,
              ]}
            >
              <Text numberOfLines={2} style={styles.topicName}>
                {item.name}
              </Text>
              <TopicIcon
                color={theme.colors.onSurfaceVariant}
                name={item.id as TopicIconName}
                size={42}
                style={styles.topicIcon}
              />
              {selected && (
                <View
                  accessibilityElementsHidden
                  pointerEvents="none"
                  style={styles.selectedBadge}
                >
                  <MaterialDesignIcons
                    color={theme.colors.onPrimary}
                    name="check"
                    size={14}
                  />
                </View>
              )}
            </Pressable>
          );
        }}
        showsVerticalScrollIndicator={false}
        style={styles.list}
      />
    </View>
  );
}

const createStyles = (theme: MD3Theme) => StyleSheet.create({
  centeredState: { marginTop: 48 },
  centeredStateText: {
    color: theme.colors.onSurfaceVariant,
    marginTop: 48,
    textAlign: 'center',
  },
  container: { backgroundColor: theme.colors.background, flex: 1 },
  list: { backgroundColor: 'transparent', flex: 1 },
  listContent: { paddingHorizontal: 20 },
  topicIcon: {
    alignSelf: 'flex-end',
    opacity: 0.88,
  },
  pressedCard: {
    backgroundColor: theme.colors.surfaceVariant,
    transform: [{ scale: 0.98 }],
  },
  personalizedCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.outlineVariant,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: 'space-between',
    marginBottom: 20,
    minHeight: 116,
    overflow: 'hidden',
    padding: 18,
    width: '100%',
  },
  personalizedCopy: {
    gap: 6,
    maxWidth: '72%',
  },
  personalizedDescription: {
    color: theme.colors.onSurfaceVariant,
    fontFamily: 'Manrope-Regular',
    fontSize: 13,
    lineHeight: 18,
  },
  personalizedName: {
    color: theme.colors.onSurface,
    fontFamily: 'Manrope-SemiBold',
    fontSize: 19,
    lineHeight: 23,
  },
  personalizedIcon: {
    bottom: 16,
    opacity: 0.88,
    position: 'absolute',
    right: 16,
  },
  selectedCard: {
    backgroundColor: theme.colors.surfaceVariant,
    borderColor: theme.colors.primary,
  },
  selectedBadge: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: 11,
    height: 22,
    justifyContent: 'center',
    position: 'absolute',
    right: 12,
    top: 12,
    width: 22,
  },
  topicCardShell: {
    aspectRatio: 1.65,
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.outlineVariant,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: 'space-between',
    overflow: 'hidden',
    padding: 16,
    width: '48%',
  },
  topicName: {
    color: theme.colors.onSurface,
    fontFamily: 'Manrope-SemiBold',
    fontSize: 16,
    lineHeight: 19,
    maxWidth: '78%',
  },
  topicRow: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
});

export default Explore;
