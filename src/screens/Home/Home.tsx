import type { RootScreenProps } from '@/navigation/types';
import { Text, View } from 'react-native';
import { Paths } from '@/navigation/paths';

function Home({ navigation: _navigation }: RootScreenProps<Paths.Home>) {

  return (
      <View>
        <Text>Home</Text>
      </View>
  );
}

export default Home;
