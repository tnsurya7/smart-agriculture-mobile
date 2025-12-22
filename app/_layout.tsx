import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SmartFarmProvider } from '../context/SmartFarmContext';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useFonts } from 'expo-font';

// Initialize i18n


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    // Load fonts here if needed, for now we can skip or add if asset exists
    // SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'), 
  });

  useEffect(() => {
    // If we're not waiting for specific fonts, we can hide splash immediately or after a small timeout
    SplashScreen.hideAsync();
  }, [loaded]);

  return (
    <SmartFarmProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
      </Stack>
      <StatusBar style="dark" />
    </SmartFarmProvider>
  );
}
