import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { ImageRequireSource } from 'react-native';
import VectorImage from 'react-native-vector-image';

import { Paths } from '@/navigation/paths';
import type { RootStackParamList } from '@/navigation/types';

import { Explore, Home, Profile } from '@/screens';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootStackParamList>();

function resolveIcon(source: ImageRequireSource) {
  const icon = VectorImage.resolveAssetSource(source);

  if (!icon) {
    throw new Error(
      'Unable to resolve a tab icon. Run `npx react-native-vector-image generate` and rebuild the app.',
    );
  }

  return icon;
}

const exploreIcon = resolveIcon(
  require('@/assets/icons/explore.svg'),
);
const homeIcon = resolveIcon(
  require('@/assets/icons/house.svg'),
);
const profileIcon = resolveIcon(
  require('@/assets/icons/profile.svg'),
);

function ExploreStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={Paths.Explore} component={Explore} />
    </Stack.Navigator>
  );
}

function ApplicationNavigator() {

  return (
    <NavigationContainer>
      <Tab.Navigator>
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
          component={Profile}
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
