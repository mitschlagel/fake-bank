import { confirmSignUp, getCurrentUser, signIn, signOut, signUp } from '@aws-amplify/auth';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from './theme';

export default function LoginScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const { isSignUpComplete, userId, nextStep } = await signUp({
        username,
        password,
        options: {
          userAttributes: {
            email: username // Using email as username
          }
        }
      });
      
      if (isSignUpComplete) {
        Alert.alert('Success', 'Account created! Please log in.');
        setIsSignUp(false);
      } else if (nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
        setNeedsConfirmation(true);
      }
    } catch (error: any) {
      Alert.alert('Sign Up Failed', error.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmSignUp = async () => {
    setLoading(true);
    try {
      const { isSignUpComplete } = await confirmSignUp({
        username,
        confirmationCode
      });
      
      if (isSignUpComplete) {
        Alert.alert('Success', 'Account confirmed! Please log in.');
        setNeedsConfirmation(false);
        setIsSignUp(false);
      }
    } catch (error: any) {
      Alert.alert('Confirmation Failed', error.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      // First check if there's a user already signed in
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          console.log('Found existing user, signing out first');
          await signOut();
        }
      } catch (error) {
        // If getCurrentUser throws, it means no user is signed in, which is fine
        console.log('No existing user found');
      }

      console.log('Attempting login with:', { username });
      const { isSignedIn, nextStep } = await signIn({
        username,
        password,
        options: {
          authFlowType: 'USER_PASSWORD_AUTH'
        }
      });
      console.log('Sign in response:', { isSignedIn, nextStep });
      
      if (isSignedIn) {
        router.replace('/');
      } else {
        console.log('Login failed - not signed in');
        Alert.alert('Login Failed', 'Authentication failed.');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      Alert.alert('Login Failed', error.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  if (needsConfirmation) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background.secondary }]}>
        <Image source={require('../logo.png')} style={styles.logo} />
        <View style={[styles.card, { backgroundColor: theme.colors.background.primary }]}>
          <Text style={[styles.title, { color: theme.colors.primary }]}>Verify Your Email</Text>
          <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>Enter the code sent to your email</Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: theme.colors.background.secondary,
              color: theme.colors.text.primary,
              borderColor: theme.colors.border
            }]}
            placeholder="Confirmation Code"
            value={confirmationCode}
            onChangeText={setConfirmationCode}
            keyboardType="number-pad"
            placeholderTextColor={theme.colors.text.secondary}
          />
          <TouchableOpacity 
            style={[
              styles.button, 
              { backgroundColor: theme.colors.primary },
              loading && { backgroundColor: theme.colors.primaryDark, opacity: 0.7 }
            ]} 
            onPress={handleConfirmSignUp} 
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={theme.colors.text.light} />
            ) : (
              <Text style={[styles.buttonText, { color: theme.colors.text.light }]}>Confirm</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.secondary }]}>
      <Image source={require('../logoDark.png')} style={styles.logo} />
      <View style={[styles.card, { backgroundColor: theme.colors.background.primary }]}>
        <Text style={[styles.title, { color: theme.colors.primary }]}>
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
          {isSignUp ? 'Sign up to get started' : 'Sign in to your account'}
        </Text>
        
        <TextInput
          style={[styles.input, { 
            backgroundColor: theme.colors.background.secondary,
            color: theme.colors.text.primary,
            borderColor: theme.colors.border
          }]}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={username}
          onChangeText={setUsername}
          placeholderTextColor={theme.colors.text.secondary}
        />
        <TextInput
          style={[styles.input, { 
            backgroundColor: theme.colors.background.secondary,
            color: theme.colors.text.primary,
            borderColor: theme.colors.border
          }]}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholderTextColor={theme.colors.text.secondary}
        />
        
        <TouchableOpacity 
          style={[
            styles.button, 
            { backgroundColor: theme.colors.primary },
            loading && { backgroundColor: theme.colors.primaryDark, opacity: 0.7 }
          ]} 
          onPress={isSignUp ? handleSignUp : handleLogin} 
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={theme.colors.text.light} />
          ) : (
            <Text style={[styles.buttonText, { color: theme.colors.text.light }]}>
              {isSignUp ? 'Create Account' : 'Sign In'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.switchButton} 
          onPress={() => setIsSignUp(!isSignUp)}
        >
          <Text style={[styles.switchButtonText, { color: theme.colors.primary }]}>
            {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
          </Text>
        </TouchableOpacity>

        {/* Development Bypass Button */}
        <TouchableOpacity 
          style={[styles.devButton, { borderColor: theme.colors.primary }]} 
          onPress={() => router.replace('/')}
        >
          <Text style={[styles.devButtonText, { color: theme.colors.primary }]}>
            Development: Skip Login
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  logo: {
    width: 280,
    height: 280,
    alignSelf: 'center',
    marginBottom: 24,
    resizeMode: 'contain',
  },
  card: {
    borderRadius: 16,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 32,
  },
  input: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  button: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  switchButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  switchButtonText: {
    fontSize: 14,
  },
  devButton: {
    marginTop: 24,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  devButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
}); 