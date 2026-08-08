import type { RootScreenProps } from '@/navigation/types';
import { Text, View } from 'react-native';
import { Paths } from '@/navigation/paths';

function Example({ navigation: _navigation }: RootScreenProps<Paths.Example>) {

  return (
      <View>
        <Text>Example</Text>
      </View>
  );
}

export default Example;
