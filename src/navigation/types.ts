import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import type { Paths } from '@/navigation/paths';

export type RootScreenProps<
  S extends keyof RootStackParamList = keyof RootStackParamList,
> = BottomTabScreenProps<RootStackParamList, S>;

export type RootStackParamList = {
  [Paths.Explore]: undefined;
  [Paths.Startup]: undefined;
  [Paths.Search]: undefined;
  [Paths.Home]: undefined;
  [Paths.Setting]: undefined;
  [Paths.Profile]: undefined;
};
