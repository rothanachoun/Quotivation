
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import ApplicationNavigator from '@/navigation/Application';

function App() {

  return (
    <SafeAreaProvider>
      <ApplicationNavigator />
    </SafeAreaProvider>
  );
}

export default App;
