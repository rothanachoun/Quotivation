import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useMemo } from 'react';
import { useTheme, type MD3Theme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useQuoteHistory } from '@/hooks/useQuoteHistory';

function Settings() {
  const theme = useTheme<MD3Theme>();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const insets = useSafeAreaInsets();
  const { clearQuoteHistory } = useQuoteHistory();

  const confirmHistoryReset = () => {
    Alert.alert(
      'Reset viewed quote history?',
      'Quotes you have already seen may appear sooner in your Home feed.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: clearQuoteHistory,
        },
      ],
    );
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.content,
        { paddingBottom: insets.bottom + 40 },
      ]}
      style={styles.container}
    >
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Feed</Text>
        <View style={styles.card}>
          <Pressable
            accessibilityHint="Allows recently viewed quotes to appear sooner"
            accessibilityRole="button"
            onPress={confirmHistoryReset}
            style={({ pressed }) => [
              styles.row,
              pressed && styles.pressedRow,
            ]}
          >
            <View style={styles.rowCopy}>
              <Text style={styles.rowTitle}>Reset viewed quote history</Text>
              <Text style={styles.rowDescription}>
                Clear the local list used to reduce repeated quotes.
              </Text>
            </View>
          </Pressable>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowCopy}>
              <Text style={styles.rowTitle}>Theme</Text>
              <Text style={styles.rowDescription}>
                The app currently uses its dark appearance.
              </Text>
            </View>
            <Text style={styles.value}>Dark</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.rowTitle}>Quotivation</Text>
            <Text style={styles.value}>Version 1.0</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const createStyles = (theme: MD3Theme) => StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.outline,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  container: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  content: {
    gap: 28,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  pressedRow: {
    opacity: 0.6,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
    minHeight: 76,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  rowCopy: {
    flex: 1,
    gap: 5,
  },
  rowDescription: {
    color: theme.colors.onSurfaceVariant,
    fontFamily: 'Manrope-Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  rowTitle: {
    color: theme.colors.onSurface,
    fontFamily: 'Manrope-SemiBold',
    fontSize: 16,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    color: theme.colors.onSurfaceDisabled,
    fontFamily: 'Manrope-SemiBold',
    fontSize: 13,
    letterSpacing: 0.6,
    paddingHorizontal: 4,
    textTransform: 'uppercase',
  },
  value: {
    color: theme.colors.onSurfaceVariant,
    fontFamily: 'Manrope-Regular',
    fontSize: 14,
  },
});

export default Settings;
