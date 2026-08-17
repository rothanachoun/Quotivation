
import { useEffect, useState } from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, View } from 'react-native';

import { initializeDatabase } from '@/database';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import ApplicationNavigator from '@/navigation/Application';
import { colors } from '@/theme/colors';

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
      <View style={styles.loading}>
        <StatusBar
          backgroundColor={colors.background}
          barStyle="light-content"
        />
        <ActivityIndicator color={colors.textPrimary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar
        backgroundColor={colors.background}
        barStyle="light-content"
      />
      <ApplicationNavigator />
    </SafeAreaProvider>
  );
}

export default App;

const styles = StyleSheet.create({
  loading: {
    alignItems: 'center',
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: 'center',
  },
});
