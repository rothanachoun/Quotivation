import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { ImageRequireSource } from 'react-native';
import VectorImage from 'react-native-vector-image';

import { Paths } from '@/navigation/paths';
import type { RootStackParamList } from '@/navigation/types';
import { colors } from '@/theme/colors';

import { Category, Explore, Home, Profile, Settings, Topics } from '@/screens';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootStackParamList>();

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

function resolveIcon(source: ImageRequireSource) {
  const icon = VectorImage.resolveAssetSource(source);

  if (!icon) {
    throw new Error(
      'Unable to resolve a tab icon. Run `npx react-native-vector-image generate` and rebuild the app.',
    );
  }

  return icon;
}

const exploreIcon = resolveIcon(require('@/assets/icons/explore.svg'));
const homeIcon = resolveIcon(require('@/assets/icons/house.svg'));
const profileIcon = resolveIcon(require('@/assets/icons/profile.svg'));

function ExploreStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        contentStyle: { backgroundColor: APP_BACKGROUND_COLOR },
        headerBackButtonDisplayMode: 'minimal',
        headerShown: false,
      }}
    >
      <Stack.Screen name={Paths.Explore} component={Explore} />
      <Stack.Screen
        name={Paths.Category}
        component={Category}
        options={({ route }) => ({
          headerShown: true,
          headerShadowVisible: false,
          headerStyle: { backgroundColor: 'transparent' },
          headerTintColor: colors.textPrimary,
          headerTransparent: true,
          headerTitleStyle: {
            fontFamily: 'Manrope-SemiBold',
          },
          title: route.params.categoryName,
        })}
      />
    </Stack.Navigator>
  );
}

function ProfileStackNavigator() {
  return (
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
        name={Paths.Profile}
        component={Profile}
        options={{ headerShown: false }}
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
  );
}

function ApplicationNavigator() {
  return (
    <NavigationContainer theme={navigationTheme}>
      <Tab.Navigator
        screenOptions={{
          sceneStyle: { backgroundColor: APP_BACKGROUND_COLOR },
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.textSecondary,
        }}
      >
        <Tab.Screen
          name={Paths.Home}
          component={Home}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: {
              type: 'image',
              source: homeIcon,
            },
          }}
        />

        <Tab.Screen
          name={Paths.Search}
          component={ExploreStackNavigator}
          options={{
            tabBarLabel: 'Explore',
            tabBarIcon: {
              type: 'image',
              source: exploreIcon,
            },
          }}
        />
        <Tab.Screen
          name={Paths.Profile}
          component={ProfileStackNavigator}
          options={{
            tabBarLabel: 'Profile',
            tabBarIcon: {
              type: 'image',
              source: profileIcon,
            },
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default ApplicationNavigator;
