import { ToastProvider } from "@/components/ToastProvider";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ApiProvider, useAuthState } from "@/context/ApiContext";
import { PaymentProvider } from "@/features/payments";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Slot, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";
import "react-native-reanimated";
import { Colors } from "@/constants/theme";

// Custom Paper themes merged with brand colors
const customLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: Colors.light.primary,
    secondary: Colors.light.secondary,
    error: Colors.light.error,
    background: Colors.light.background,
    surface: Colors.light.surface,
    onPrimary: Colors.light.onPrimary,
    onSecondary: Colors.light.text,
    onSurface: Colors.light.text,
    onBackground: Colors.light.text,
    outline: Colors.light.border,
    surfaceVariant: Colors.light.muted,
    onSurfaceVariant: Colors.light.textMuted,
  },
};

const customDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: Colors.dark.primary,
    secondary: Colors.dark.secondary,
    error: Colors.dark.error,
    background: Colors.dark.background,
    surface: Colors.dark.surface,
    onPrimary: Colors.dark.onPrimary,
    onSecondary: Colors.dark.text,
    onSurface: Colors.dark.text,
    onBackground: Colors.dark.text,
    outline: Colors.dark.border,
    surfaceVariant: Colors.dark.muted,
    onSurfaceVariant: Colors.dark.textMuted,
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ErrorBoundary>
      <ApiProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <PaperProvider
            theme={colorScheme === "dark" ? customDarkTheme : customLightTheme}
          >
            <ThemeProvider
              value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
            >
              <ToastProvider>
                <PaymentProvider>
                  <RootNavigator />
                  <StatusBar style="auto" />
                </PaymentProvider>
              </ToastProvider>
            </ThemeProvider>
          </PaperProvider>
        </GestureHandlerRootView>
      </ApiProvider>
    </ErrorBoundary>
  );
}

/**
 * Root Navigator Component
 * Handles auth-based routing and splash screen
 * Separated from RootLayout to access ApiContext
 */
function RootNavigator() {
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const segments = useSegments();

  // Get auth state from ApiContext (managed by Django auth)
  const { isAuthenticated, isAuthLoading } = useAuthState();

  useEffect(() => {
    async function prepare() {
      try {
        // Add any async initialization here if needed
        // For example: preload fonts, images, etc.

        // Wait a bit for auth state to initialize
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (e) {
        console.warn("Error during app initialization:", e);
      } finally {
        setIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    // Hide splash screen once ready and auth is loaded
    if (isReady && !isAuthLoading) {
      SplashScreen.hideAsync();
    }
  }, [isReady, isAuthLoading]);

  useEffect(() => {
    // Don't navigate until ready and auth is loaded
    if (!isReady || isAuthLoading) return;

    const inDrawerGroup = segments[0] === "(drawer)";
    const inAuthScreen = segments[0] === "auth";

    // Redirect authenticated users from auth screen to home
    if (isAuthenticated && inAuthScreen) {
      console.log('Authenticated user on auth screen, redirecting to home...');
      router.replace("/(drawer)/home");
    }

    // Protect drawer routes - redirect to auth if not authenticated
    if (!isAuthenticated && inDrawerGroup) {
      console.log('Unauthenticated user on drawer screen, redirecting to auth...');
      router.replace("/auth");
    }
  }, [isAuthenticated, segments, isReady, isAuthLoading, router]);

  // Show nothing while initializing
  if (!isReady || isAuthLoading) {
    return null;
  }

  return <Slot />;
}
