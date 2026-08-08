import type { RootScreenProps } from '@/navigation/types';
import { Text, View } from 'react-native';
import { Paths } from '@/navigation/paths';

function Startup({ navigation: _navigation }: RootScreenProps<Paths.Startup>) {

  return (
      <View>
        <Text>Startup</Text>
      </View>
  );
}

export default Startup;
