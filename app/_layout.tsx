import FontAwesome from '@expo/vector-icons/FontAwesome';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import 'react-native-reanimated';

import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import LoadingScreen from '@/components/LoadingScreen'; // optional spinner component
import { useColorScheme } from '@/components/useColorScheme';
import { selectIsAuthenticated } from '../features/auth/authSlice';
import { persistor, store } from '../store/store';

// Prevent splash screen auto-hide
SplashScreen.preventAutoHideAsync();

// Main entry point
export default function RootLayout() {
  const [fontsLoaded, fontsError] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Handle font loading errors
  useEffect(() => {
    if (fontsError) throw fontsError;
  }, [fontsError]);

  // Hide splash screen when fonts loaded
  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return <LoadingScreen />; // show a loader instead of blank

  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingScreen />} persistor={persistor}>
        <RootLayoutNav />
      </PersistGate>
    </Provider>
  );
}

// Component inside Redux Provider
function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const segments = useSegments();
  const router = useRouter();

  // Redirect based on auth state
  useAuthRedirect(isAuthenticated, segments, router);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </ThemeProvider>
  );
}

function useAuthRedirect(
  isAuthenticated: boolean,
  segments: string[],
  router: any
) {
  useEffect(() => {
    const currentGroup = segments[0];

    if (isAuthenticated && currentGroup !== '(tabs)') {
      router.replace('/(tabs)/home');
    } else if (!isAuthenticated && currentGroup !== '(auth)') {
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated, segments, router]);
}
