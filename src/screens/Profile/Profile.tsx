import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Paths } from '@/navigation/paths';
import type { RootStackParamList } from '@/navigation/types';
import { useTheme, type MD3Theme } from 'react-native-paper';

type ProfileSetting = {
  description: string;
  path?: Paths.Topics;
  title: string;
};

const PERSONALIZATION_SETTINGS: ProfileSetting[] = [
  {
    title: 'Topics',
    description: 'Choose the topics that personalize your Home feed.',
    path: Paths.Topics,
  },
  {
    title: 'Reminders',
    description: 'Schedule daily quote notifications.',
  },
  {
    title: 'App Icon',
    description: 'Choose how Quotivation looks on your Home Screen.',
  },
  {
    title: 'Home Screen Widgets',
    description: 'Keep meaningful quotes visible throughout your day.',
  },
];

type SettingRowProps = {
  isLast: boolean;
  onPress?: () => void;
  setting: ProfileSetting;
};

function SettingRow({ isLast, onPress, setting }: SettingRowProps) {
  const theme = useTheme<MD3Theme>();
  const styles = useMemo(() => createStyles(theme), [theme]);
  return (
    <Pressable
      accessibilityLabel={`${setting.title}. ${setting.description}${
        onPress ? '' : '. Coming soon.'
      }`}
      accessibilityRole={onPress ? 'button' : undefined}
      disabled={!onPress}
      onPress={onPress}
      style={[styles.settingRow, !isLast && styles.settingRowBorder]}
    >
      <View style={styles.settingCopy}>
        <Text style={styles.settingTitle}>{setting.title}</Text>
        <Text style={styles.settingDescription}>{setting.description}</Text>
      </View>

      {onPress ? (
        <Text accessibilityElementsHidden style={styles.chevron}>
          ›
        </Text>
      ) : (
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>Coming soon</Text>
        </View>
      )}
    </Pressable>
  );
}

type ProfileProps = NativeStackScreenProps<RootStackParamList, Paths.Profile>;

function Profile({ navigation }: ProfileProps) {
  const insets = useSafeAreaInsets();
  const theme = useTheme<MD3Theme>();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={[
        styles.content,
        {
          paddingBottom: insets.bottom + 120,
        },
      ]}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.header}>
        <Text style={styles.subtitle}>
          Make Quotivation feel personal to you.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personalization</Text>
        <View style={[styles.settingsCard, { backgroundColor: theme.colors.surface }]}>
          {PERSONALIZATION_SETTINGS.map((setting, index) => (
            <SettingRow
              isLast={index === PERSONALIZATION_SETTINGS.length - 1}
              key={setting.title}
              onPress={
                setting.path === Paths.Topics
                  ? () => navigation.navigate(Paths.Topics)
                  : undefined
              }
              setting={setting}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const createStyles = (theme: MD3Theme) => StyleSheet.create({
  chevron: {
    color: theme.colors.onSurfaceDisabled,
    fontFamily: 'Manrope-Regular',
    fontSize: 30,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 12,
  },
  section: {
    gap: 10,
    marginTop: 28,
  },
  sectionTitle: {
    color: theme.colors.onSurfaceDisabled,
    fontFamily: 'Manrope-SemiBold',
    fontSize: 13,
    letterSpacing: 0.6,
    paddingHorizontal: 4,
    textTransform: 'uppercase',
  },
  settingCopy: {
    flex: 1,
    gap: 5,
  },
  settingDescription: {
    color: theme.colors.onSurfaceVariant,
    fontFamily: 'Manrope-Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  settingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
    minHeight: 92,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  settingRowBorder: {
    borderBottomColor: theme.colors.outline,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  settingTitle: {
    color: theme.colors.onSurface,
    fontFamily: 'Manrope-SemiBold',
    fontSize: 16,
  },
  settingsCard: {
    borderColor: theme.colors.outline,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  statusBadge: {
    backgroundColor: theme.colors.elevation.level2,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusText: {
    color: theme.colors.onSurfaceVariant,
    fontFamily: 'Manrope-SemiBold',
    fontSize: 11,
  },
  subtitle: {
    color: theme.colors.onSurfaceVariant,
    fontFamily: 'Manrope-Regular',
    fontSize: 15,
    lineHeight: 21,
  },
});

export default Profile;
