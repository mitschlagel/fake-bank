import { signOut } from '@aws-amplify/auth';
import { useRouter } from 'expo-router';
import { Alert, Button, ScrollView, StyleSheet } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      Alert.alert('Success', 'You have been logged out');
      router.replace('/login');
    } catch (error: any) {
      console.error('Logout error:', error);
      Alert.alert('Logout Failed', error.message || 'Unknown error');
    }
  };

  return (
    <ScrollView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="subtitle">You are logged in!</ThemedText>
        <Button title="Log Out" onPress={handleLogout} />
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingTop: 100
  },
});
