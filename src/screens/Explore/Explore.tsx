import type { NativeStackScreenProps } from '@react-navigation/native-stack';
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
import { useSelectedTopic } from '@/hooks/useSelectedTopic';
import { Paths } from '@/navigation/paths';
import type { RootStackParamList } from '@/navigation/types';

type ExploreProps = NativeStackScreenProps<RootStackParamList, Paths.Explore>;

const TOPIC_CARD_COLORS: Record<string, string> = {
  confidence: '#FCF1CD',
  focus: '#E5F7F0',
  gratitude: '#FFF3E1',
  healing: '#F4EBFC',
  motivation: '#FFE7CD',
  peace: '#E5F5FC',
  'personal-growth': '#EDF8DC',
  relationships: '#FCE4E6',
  resilience: '#E9E8FB',
  'self-love': '#FCE9F0',
};

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
        renderItem={({ item }) => (
          <Pressable
            accessibilityHint="Shows only this topic on Home"
            accessibilityRole="button"
            accessibilityState={{ selected: selectedTopicId === item.id }}
            onPress={() => {
              selectTopic(item.id);
              navigation.goBack();
            }}
            style={({ pressed }) => [
              styles.topicCardShell,
              {
                backgroundColor: TOPIC_CARD_COLORS[item.id] ?? '#D8D8D8',
              },
              selectedTopicId === item.id && styles.selectedCard,
              pressed && styles.pressedCard,
            ]}
          >
            <Text numberOfLines={2} style={styles.topicName}>{item.name}</Text>
            <TopicIcon
              color="#111111"
              name={item.id as TopicIconName}
              size={46}
              style={styles.topicIcon}
            />
          </Pressable>
        )}
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
    opacity: 0.72,
    transform: [{ scale: 0.97 }],
  },
  selectedCard: {
    borderColor: theme.colors.onSurface,
    borderWidth: 3,
  },
  topicCardShell: {
    aspectRatio: 1.65,
    borderRadius: 22,
    justifyContent: 'space-between',
    overflow: 'hidden',
    padding: 16,
    width: '48%',
  },
  topicName: {
    color: '#111111',
    fontFamily: 'Manrope-ExtraBold',
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
