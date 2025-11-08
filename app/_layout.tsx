import FontAwesome from '@expo/vector-icons/FontAwesome';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router'; // <-- 1. Import router hooks
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';

import { Provider, useSelector } from 'react-redux'; // <-- 2. Import useSelector
import { PersistGate } from 'redux-persist/integration/react';
import { selectIsAuthenticated } from '../features/auth/authSlice'; // <-- 3. Import selector
import { persistor, store } from '../store/store';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  // Wrap the main app in the Redux Provider
  return (
    <Provider store={store}>
      {/* PersistGate waits for Redux state to be loaded from storage */}
      <PersistGate loading={null} persistor={persistor}>
        <RootLayoutNav />
      </PersistGate>
    </Provider>
  );
}

// This component runs *inside* the Provider, so it can access Redux
function RootLayoutNav() {
  const colorScheme = useColorScheme();

  // 4. Get auth state from Redux
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const segments = useSegments(); // Gets the current route path
  const router = useRouter();

  // 5. Add effect to handle redirection
  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';

    if (isAuthenticated && !inAuthGroup) {
      // User is logged in but not in the main app, send them to home
      router.replace('/(tabs)/home');
    } else if (!isAuthenticated && !inAuthGroup) {
      // User is logged out and not in the auth flow, send them to login
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated, segments, router]); // Re-run when auth state changes

  // 6. Render the correct layout
  //    The useEffect above will handle redirection
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
