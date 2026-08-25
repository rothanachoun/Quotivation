import { useEffect, useMemo, useState } from 'react';
import { useTheme, type MD3Theme } from 'react-native-paper';
import {
  isLiquidGlassSupported,
  LiquidGlassView,
} from '@callstack/liquid-glass';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { getQuoteTopics, type QuoteTopic } from '@/database/quotes';
import { useFollowedTopics } from '@/hooks/useFollowedTopics';

function Topics() {
  const theme = useTheme<MD3Theme>();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { isFollowingTopic, toggleFollowedTopic } = useFollowedTopics();
  const [topics, setTopics] = useState<QuoteTopic[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getQuoteTopics()
      .then(result => !cancelled && setTopics(result))
      .catch(loadError => {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : 'Could not load topics');
        }
      })
      .finally(() => !cancelled && setIsLoading(false));
    return () => { cancelled = true; };
  }, []);

  if (isLoading) return <View style={styles.container}><ActivityIndicator style={styles.state} /></View>;
  if (error) return <View style={styles.container}><Text style={styles.stateText}>{error}</Text></View>;

  return (
    <FlatList
      ListHeaderComponent={<Text style={styles.subtitle}>Follow topics to personalize your quotes.</Text>}
      contentContainerStyle={styles.content}
      data={topics}
      keyExtractor={topic => topic.id}
      renderItem={({ item }) => {
        const selected = isFollowingTopic(item.id);
        return (
          <View style={styles.topicRow}>
            <View style={styles.copy}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.description}>{item.description}</Text>
              <Text style={styles.count}>{item.quoteCount} quotes</Text>
            </View>
            <Pressable
              accessibilityLabel={`${selected ? 'Unfollow' : 'Follow'} ${item.name}`}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => toggleFollowedTopic(item.id)}
            >
              <LiquidGlassView
                colorScheme="dark"
                effect="regular"
                interactive
                style={[styles.button, !isLiquidGlassSupported && styles.buttonFallback]}
                tintColor={selected ? undefined : theme.colors.primary}
              >
                <Text style={[styles.buttonText, !selected && styles.buttonTextAccent]}>
                  {selected ? 'Following' : 'Follow'}
                </Text>
              </LiquidGlassView>
            </Pressable>
          </View>
        );
      }}
      showsVerticalScrollIndicator={false}
      style={styles.container}
    />
  );
}

const createStyles = (theme: MD3Theme) => StyleSheet.create({
  button: { alignItems: 'center', borderRadius: 18, height: 36, justifyContent: 'center', width: 96 },
  buttonFallback: { backgroundColor: theme.colors.elevation.level2, borderColor: theme.colors.outline, borderWidth: StyleSheet.hairlineWidth },
  buttonText: { color: theme.colors.onSurface, fontFamily: 'Manrope-SemiBold', fontSize: 14 },
  buttonTextAccent: { color: theme.colors.onPrimary },
  container: { backgroundColor: theme.colors.background, flex: 1 },
  content: { paddingBottom: 120, paddingHorizontal: 20 },
  copy: { flex: 1, gap: 4 },
  count: { color: theme.colors.onSurfaceDisabled, fontFamily: 'Manrope-Regular', fontSize: 12 },
  description: { color: theme.colors.onSurfaceVariant, fontFamily: 'Manrope-Regular', fontSize: 13, lineHeight: 18 },
  name: { color: theme.colors.onSurface, fontFamily: 'Manrope-SemiBold', fontSize: 17 },
  state: { marginTop: 48 },
  stateText: { color: theme.colors.onSurfaceVariant, marginTop: 48, textAlign: 'center' },
  subtitle: { color: theme.colors.onSurfaceVariant, fontFamily: 'Manrope-Regular', fontSize: 15, lineHeight: 21, paddingBottom: 18, paddingTop: 16 },
  topicRow: { alignItems: 'center', borderBottomColor: theme.colors.outline, borderBottomWidth: StyleSheet.hairlineWidth, flexDirection: 'row', gap: 16, minHeight: 96, paddingVertical: 14 },
});

export default Topics;
