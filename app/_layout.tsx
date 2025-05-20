import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Amplify } from 'aws-amplify';
import Constants from 'expo-constants';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

// Configure Amplify
const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: Constants.expoConfig?.extra?.awsUserPoolId,
      userPoolClientId: Constants.expoConfig?.extra?.awsUserPoolClientId,
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

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen
          name="login"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
