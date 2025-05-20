import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Amplify } from 'aws-amplify';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import 'react-native-reanimated';
import LoginScreen from './login';

import { useColorScheme } from '@/hooks/useColorScheme';

// Configure Amplify
const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: 'us-east-1_ESnMhdDx4', // Replace with your User Pool ID
      userPoolClientId: '4oticvosrbiu40gl0iqcd9fst2', // Replace with your Client ID
      signUpVerificationMethod: 'code' as const,
      loginWith: {
        email: true,
        phone: false,
        username: false
      }
    }
  }
};

console.log('Configuring Amplify with:', amplifyConfig);
Amplify.configure(amplifyConfig);

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Log the current Amplify configuration
    console.log('Current Amplify config:', Amplify.getConfig());
  }, []);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  if (!isAuthenticated) {
    return <LoginScreen onLogin={(isLoggedIn = true) => setIsAuthenticated(isLoggedIn)} />;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen 
          name="(tabs)" 
          options={{ headerShown: false }} 
          initialParams={{ onLogout: () => setIsAuthenticated(false) }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
