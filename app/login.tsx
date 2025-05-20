import { confirmSignUp, signIn, signUp } from '@aws-amplify/auth';
import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';

export default function LoginScreen({ navigation, onLogin }: any) {
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
        Alert.alert('Login Success', 'You are now logged in!');
        if (onLogin) onLogin();
        else navigation.replace('(tabs)');
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
      <View style={styles.container}>
        <Text style={styles.title}>Confirm Sign Up</Text>
        <TextInput
          style={styles.input}
          placeholder="Confirmation Code"
          value={confirmationCode}
          onChangeText={setConfirmationCode}
          keyboardType="number-pad"
        />
        <Button 
          title={loading ? 'Confirming...' : 'Confirm'} 
          onPress={handleConfirmSignUp} 
          disabled={loading} 
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isSignUp ? 'Sign Up' : 'Login'}</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button 
        title={loading ? 'Please wait...' : (isSignUp ? 'Sign Up' : 'Login')} 
        onPress={isSignUp ? handleSignUp : handleLogin} 
        disabled={loading} 
      />
      <Button 
        title={isSignUp ? 'Already have an account? Login' : 'Need an account? Sign Up'} 
        onPress={() => setIsSignUp(!isSignUp)} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  input: {
    width: '100%',
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    fontSize: 18,
  },
}); 