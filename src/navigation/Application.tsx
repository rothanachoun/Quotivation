import { useMemo, useRef, type ReactNode } from 'react';
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
import { useTheme, type MD3Theme } from 'react-native-paper';

import { MenuIcon, ProfileIcon, SettingsIcon } from '@/components/icons';
import { Paths } from '@/navigation/paths';
import type { RootStackParamList } from '@/navigation/types';

import { Explore, Home, Profile, Settings, Topics } from '@/screens';

const Stack = createNativeStackNavigator<RootStackParamList>();

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
  const theme = useTheme<MD3Theme>();
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
              !isLiquidGlassSupported && {
                backgroundColor: theme.colors.elevation.level2,
                borderColor: theme.colors.outline,
                borderWidth: StyleSheet.hairlineWidth,
              },
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
  const theme = useTheme<MD3Theme>();

  return (
    <HeaderIconButton
      accessibilityLabel="Open Explore"
      onPress={() => navigation.navigate(Paths.Explore)}
    >
      <MenuIcon color={theme.colors.onSurface} size={22} />
    </HeaderIconButton>
  );
}

function ProfileHeaderButton() {
  const navigation = useNavigation() as unknown as HomeHeaderNavigation;
  const theme = useTheme<MD3Theme>();

  return (
    <HeaderIconButton
      accessibilityLabel="Open Profile"
      onPress={() => navigation.navigate(Paths.Profile)}
    >
      <ProfileIcon color={theme.colors.onSurface} size={22} />
    </HeaderIconButton>
  );
}

function SettingsHeaderButton() {
  const navigation = useNavigation() as unknown as HomeHeaderNavigation;
  const theme = useTheme<MD3Theme>();

  return (
    <HeaderIconButton
      accessibilityLabel="Open settings"
      glass
      onPress={() => navigation.navigate(Paths.Settings)}
    >
      <SettingsIcon color={theme.colors.onSurface} size={22} />
    </HeaderIconButton>
  );
}

function CloseHeaderButton() {
  const navigation = useNavigation() as unknown as HomeHeaderNavigation;
  const theme = useTheme<MD3Theme>();

  return (
    <HeaderIconButton
      accessibilityLabel="Close"
      glass
      onPress={() => navigation.goBack()}
    >
      <Text
        accessibilityElementsHidden
        style={[styles.closeIcon, { color: theme.colors.onSurface }]}
      >
        ×
      </Text>
    </HeaderIconButton>
  );
}

function ApplicationNavigator() {
  const theme = useTheme<MD3Theme>();
  const navigationTheme = useMemo(() => ({
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: theme.colors.background,
      border: theme.colors.outline,
      card: theme.colors.background,
      notification: theme.colors.error,
      primary: theme.colors.primary,
      text: theme.colors.onBackground,
    },
  }), [theme]);
  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        screenOptions={{
          contentStyle: { backgroundColor: theme.colors.background },
          headerBackButtonDisplayMode: 'minimal',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.onSurface,
        }}
      >
        <Stack.Screen
          name={Paths.Home}
          component={Home}
          options={{
            headerLeft: ExploreHeaderButton,
            headerRight: ProfileHeaderButton,
            headerStyle: { backgroundColor: 'transparent' },
            headerTitle: '',
            headerTransparent: true,
            scrollEdgeEffects: {
              bottom: 'hidden',
              left: 'hidden',
              right: 'hidden',
              top: 'hidden',
            },
          }}
        />
        <Stack.Screen
          name={Paths.Explore}
          component={Explore}
          options={({ navigation }) => ({
            headerLeft: CloseHeaderButton,
            headerStyle: { backgroundColor: 'transparent' },
            headerTitleStyle: { color: theme.colors.primary },
            headerTransparent: true,
            presentation: 'fullScreenModal',
            title: 'Explore',
            unstable_headerLeftItems: () => [
              {
                accessibilityLabel: 'Close',
                icon: { name: 'xmark', type: 'sfSymbol' },
                label: 'Close',
                onPress: () => navigation.goBack(),
                tintColor: theme.colors.onSurface,
                type: 'button',
              },
            ],
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
                tintColor: theme.colors.onSurface,
                type: 'button',
              },
            ],
            unstable_headerRightItems: () => [
              {
                accessibilityLabel: 'Open settings',
                icon: { name: 'gearshape', type: 'sfSymbol' },
                label: 'Settings',
                onPress: () => navigation.navigate(Paths.Settings),
                tintColor: theme.colors.onSurface,
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
});
