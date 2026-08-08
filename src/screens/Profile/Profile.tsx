import type { RootScreenProps } from '@/navigation/types';
import { Text, View } from 'react-native';
import { Paths } from '@/navigation/paths';

function Profile({ navigation: _navigation }: RootScreenProps<Paths.Profile>) {

  return (
      <View>
        <Text>Profile</Text>
      </View>
  );
}

export default Profile;
