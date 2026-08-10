import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SettingsIcon } from '@/components/icons';
import { Paths } from '@/navigation/paths';
import type { RootStackParamList } from '@/navigation/types';
import { colors } from '@/theme/colors';

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

  return (
    <ScrollView
      automaticallyAdjustContentInsets={false}
      contentInsetAdjustmentBehavior="never"
      contentContainerStyle={[
        styles.content,
        {
          paddingBottom: insets.bottom + 120,
          paddingTop: insets.top + 16,
        },
      ]}
      style={styles.container}
    >
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.subtitle}>
            Make Quotivation feel personal to you.
          </Text>
        </View>

        <Pressable
          accessibilityLabel="Open settings"
          accessibilityRole="button"
          hitSlop={8}
          onPress={() => navigation.navigate(Paths.Settings)}
          style={({ pressed }) => [
            styles.settingsButton,
            pressed && styles.settingsButtonPressed,
          ]}
        >
          <SettingsIcon color={colors.textPrimary} size={22} />
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personalization</Text>
        <View style={styles.settingsCard}>
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

const styles = StyleSheet.create({
  chevron: {
    color: colors.textMuted,
    fontFamily: 'Manrope-Regular',
    fontSize: 30,
  },
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 16,
  },
  headerCopy: {
    flex: 1,
    gap: 8,
  },
  section: {
    gap: 10,
    marginTop: 28,
  },
  sectionTitle: {
    color: colors.textMuted,
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
    color: colors.textSecondary,
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
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  settingTitle: {
    color: colors.textPrimary,
    fontFamily: 'Manrope-SemiBold',
    fontSize: 16,
  },
  settingsCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  settingsButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 22,
    borderWidth: StyleSheet.hairlineWidth,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  settingsButtonPressed: {
    opacity: 0.6,
  },
  statusBadge: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusText: {
    color: colors.textSecondary,
    fontFamily: 'Manrope-SemiBold',
    fontSize: 11,
  },
  subtitle: {
    color: colors.textSecondary,
    fontFamily: 'Manrope-Regular',
    fontSize: 15,
    lineHeight: 21,
  },
  title: {
    color: colors.textPrimary,
    fontFamily: 'Manrope-ExtraBold',
    fontSize: 32,
    lineHeight: 38,
  },
});

export default Profile;
