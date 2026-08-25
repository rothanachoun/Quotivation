
import { useEffect, useState } from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, View } from 'react-native';
import { PaperProvider, useTheme, type MD3Theme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { initializeDatabase } from '@/database';
import ApplicationNavigator from '@/navigation/Application';
import { paperTheme } from '@/theme/paperTheme';

function AppContent({ isDatabaseReady }: { isDatabaseReady: boolean }) {
  const theme = useTheme<MD3Theme>();

  return (
    <SafeAreaProvider>
      <StatusBar
        backgroundColor={theme.colors.background}
        barStyle="light-content"
      />
      {isDatabaseReady ? (
        <ApplicationNavigator />
      ) : (
        <View
          style={[styles.loading, { backgroundColor: theme.colors.background }]}
        >
          <ActivityIndicator color={theme.colors.onBackground} />
        </View>
      )}
    </SafeAreaProvider>
  );
}

function App() {
  const [isDatabaseReady, setIsDatabaseReady] = useState(false);

  useEffect(() => {
    initializeDatabase()
      .then(() => setIsDatabaseReady(true))
      .catch(error => {
        console.error('Database initialization failed:', error);
      });
  }, []);

  return (
    <PaperProvider theme={paperTheme}>
      <AppContent isDatabaseReady={isDatabaseReady} />
    </PaperProvider>
  );
}

export default App;

const styles = StyleSheet.create({
  loading: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
