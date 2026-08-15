import { useRef, type ReactNode } from 'react';
import {
  DarkTheme,
  NavigationContainer,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Animated, Pressable, StyleSheet } from 'react-native';

import { MenuIcon, ProfileIcon } from '@/components/icons';
import { Paths } from '@/navigation/paths';
import type { RootStackParamList } from '@/navigation/types';
import { colors } from '@/theme/colors';

import { Category, Explore, Home, Profile, Settings, Topics } from '@/screens';

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
  onPress: () => void;
};

type HomeHeaderNavigation = {
  navigate: (path: Paths.Explore | Paths.Profile) => void;
};

function HeaderIconButton({
  accessibilityLabel,
  children,
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
      onPressIn={() => animateTo(0.78)}
      onPressOut={() => animateTo(1)}
    >
      <Animated.View style={[styles.headerButton, { transform: [{ scale }] }]}>
        {children}
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
          presentation: "fullScreenModal"
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
          }}
        />
        <Stack.Screen
          name={Paths.Explore}
          component={Explore}
          options={{ title: '' }}
        />
        <Stack.Screen
          name={Paths.Category}
          component={Category}
          options={({ route }) => ({
            headerShown: true,
            title: route.params.categoryName,
          })}
        />
        <Stack.Screen
          name={Paths.Profile}
          component={Profile}
          options={{ title: '' }}
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
  headerButton: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
});
