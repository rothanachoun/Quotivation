
import { useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

import { initializeDatabase } from '@/database';

import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import ApplicationNavigator from '@/navigation/Application';

function App() {
  const [isDatabaseReady, setIsDatabaseReady] = useState(false);

  useEffect(() => {
    initializeDatabase()
      .then(() => setIsDatabaseReady(true))
      .catch(error => {
        console.error('Database initialization failed:', error);
      });
  }, []);

  if (!isDatabaseReady) {
    return (
      <View
        style={styles.loading}
      >
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ApplicationNavigator />
    </SafeAreaProvider>
  );
}

export default App;

const styles = StyleSheet.create({
  loading: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  }
})