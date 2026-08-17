import { useRef, type ReactNode } from 'react';
import {
  DarkTheme,
  NavigationContainer,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  isLiquidGlassSupported,
  LiquidGlassView,
} from '@callstack/liquid-glass';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';

import { MenuIcon, ProfileIcon, SettingsIcon } from '@/components/icons';
import { Paths } from '@/navigation/paths';
import type { RootStackParamList } from '@/navigation/types';
import { colors } from '@/theme/colors';

import { Explore, Home, Profile, Settings, Topic, Topics } from '@/screens';

const Stack = createNativeStackNavigator<RootStackParamList>();

const APP_BACKGROUND_COLOR = colors.background;
const navigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: APP_BACKGROUND_COLOR,
    border: colors.border,
    card: APP_BACKGROUND_COLOR,
    notification: colors.accent,
    primary: colors.accent,
    text: colors.textPrimary,
  },
};

type HeaderIconButtonProps = {
  accessibilityLabel: string;
  children: ReactNode;
  glass?: boolean;
  onPress: () => void;
};

type HomeHeaderNavigation = {
  goBack: () => void;
  navigate: (path: Paths.Explore | Paths.Profile | Paths.Settings) => void;
};

function HeaderIconButton({
  accessibilityLabel,
  children,
  glass = false,
  onPress,
}: HeaderIconButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (toValue: number) => {
    Animated.spring(scale, {
      damping: 14,
      mass: 0.45,
      stiffness: 260,
      toValue,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      hitSlop={8}
      onPress={onPress}
      onPressIn={() => animateTo(glass ? 0.94 : 0.78)}
      onPressOut={() => animateTo(1)}
    >
      <Animated.View style={[styles.headerButton, { transform: [{ scale }] }]}> 
        {glass ? (
          <LiquidGlassView
            colorScheme="dark"
            effect="regular"
            interactive
            style={[
              styles.headerGlass,
              !isLiquidGlassSupported && styles.headerGlassFallback,
            ]}
          >
            {children}
          </LiquidGlassView>
        ) : (
          children
        )}
      </Animated.View>
    </Pressable>
  );
}

function ExploreHeaderButton() {
  const navigation = useNavigation() as unknown as HomeHeaderNavigation;

  return (
    <HeaderIconButton
      accessibilityLabel="Open Explore"
      onPress={() => navigation.navigate(Paths.Explore)}
    >
      <MenuIcon color={colors.textPrimary} size={22} />
    </HeaderIconButton>
  );
}

function ProfileHeaderButton() {
  const navigation = useNavigation() as unknown as HomeHeaderNavigation;

  return (
    <HeaderIconButton
      accessibilityLabel="Open Profile"
      onPress={() => navigation.navigate(Paths.Profile)}
    >
      <ProfileIcon color={colors.textPrimary} size={22} />
    </HeaderIconButton>
  );
}

function SettingsHeaderButton() {
  const navigation = useNavigation() as unknown as HomeHeaderNavigation;

  return (
    <HeaderIconButton
      accessibilityLabel="Open settings"
      glass
      onPress={() => navigation.navigate(Paths.Settings)}
    >
      <SettingsIcon color={colors.textPrimary} size={22} />
    </HeaderIconButton>
  );
}

function CloseHeaderButton() {
  const navigation = useNavigation() as unknown as HomeHeaderNavigation;

  return (
    <HeaderIconButton
      accessibilityLabel="Close"
      glass
      onPress={() => navigation.goBack()}
    >
      <Text accessibilityElementsHidden style={styles.closeIcon}>
        ×
      </Text>
    </HeaderIconButton>
  );
}

function ApplicationNavigator() {
  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        screenOptions={{
          contentStyle: { backgroundColor: APP_BACKGROUND_COLOR },
          headerBackButtonDisplayMode: 'minimal',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: APP_BACKGROUND_COLOR },
          headerTintColor: colors.textPrimary,
        }}
      >
        <Stack.Screen
          name={Paths.Home}
          component={Home}
          options={{
            headerLeft: ExploreHeaderButton,
            headerRight: ProfileHeaderButton,
            headerStyle: { backgroundColor: 'transparent' },
            headerTitle: 'For You',
            headerTransparent: true,
          }}
        />
        <Stack.Screen
          name={Paths.Explore}
          component={Explore}
          options={({ navigation }) => ({
            headerLeft: CloseHeaderButton,
            headerStyle: { backgroundColor: 'transparent' },
            headerTitleStyle: { color: colors.exploreAccent },
            headerTransparent: true,
            presentation: 'fullScreenModal',
            title: 'Explore',
            unstable_headerLeftItems: () => [
              {
                accessibilityLabel: 'Close',
                icon: { name: 'xmark', type: 'sfSymbol' },
                label: 'Close',
                onPress: () => navigation.goBack(),
                tintColor: colors.textPrimary,
                type: 'button',
              },
            ],
          })}
        />
        <Stack.Screen
          name={Paths.Topic}
          component={Topic}
          options={({ route }) => ({
            headerShown: true,
            title: route.params.topicName,
          })}
        />
        <Stack.Screen
          name={Paths.Profile}
          component={Profile}
          options={({ navigation }) => ({
            headerStyle: { backgroundColor: 'transparent' },
            headerLeft: CloseHeaderButton,
            headerRight: SettingsHeaderButton,
            headerTransparent: true,
            presentation: 'fullScreenModal',
            title: 'Profile',
            unstable_headerLeftItems: () => [
              {
                accessibilityLabel: 'Close',
                icon: { name: 'xmark', type: 'sfSymbol' },
                label: 'Close',
                onPress: () => navigation.goBack(),
                tintColor: colors.textPrimary,
                type: 'button',
              },
            ],
            unstable_headerRightItems: () => [
              {
                accessibilityLabel: 'Open settings',
                icon: { name: 'gearshape', type: 'sfSymbol' },
                label: 'Settings',
                onPress: () => navigation.navigate(Paths.Settings),
                tintColor: colors.textPrimary,
                type: 'button',
              },
            ],
          })}
        />
        <Stack.Screen
          name={Paths.Topics}
          component={Topics}
          options={{ title: 'Topics' }}
        />
        <Stack.Screen
          name={Paths.Settings}
          component={Settings}
          options={{ title: 'Settings' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default ApplicationNavigator;

const styles = StyleSheet.create({
  closeIcon: {
    color: colors.textPrimary,
    fontFamily: 'Manrope-Regular',
    fontSize: 27,
    lineHeight: 30,
    marginTop: -2,
  },
  headerButton: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  headerGlass: {
    alignItems: 'center',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    overflow: 'hidden',
    width: 40,
  },
  headerGlassFallback: {
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.border,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
