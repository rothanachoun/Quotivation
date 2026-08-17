import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { Paths } from '@/navigation/paths';

export type RootScreenProps<
  S extends keyof RootStackParamList = keyof RootStackParamList,
> = NativeStackScreenProps<RootStackParamList, S>;

export type RootStackParamList = {
  [Paths.Explore]: undefined;
  [Paths.Home]: undefined;
  [Paths.Settings]: undefined;
  [Paths.Profile]: undefined;
  [Paths.Topics]: undefined;
};
