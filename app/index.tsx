import { signOut } from '@aws-amplify/auth';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Header } from './components/Header';
import AccountSection from './components/sections/AccountSection';
import ActivitySection from './components/sections/ActivitySection';
import RecentTransactionsSection from './components/sections/RecentTransactionsSection';
import { useTheme } from './theme';
import { getRecentTransactions, mockAccounts } from './types/account';

const VISIBLE_ACCOUNTS_KEY = '@visible_accounts';
const ACCOUNT_ORDER_KEY = '@account_order';

interface Action {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [visibleAccounts, setVisibleAccounts] = useState<Set<string>>(new Set());
  const [orderedAccounts, setOrderedAccounts] = useState<string[]>([]);

  // useFocusEffect to reload data when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadAccountData();
    }, [])
  );

  const loadAccountData = async () => {
    try {
      // Load visibility
      const storedVisible = await AsyncStorage.getItem(VISIBLE_ACCOUNTS_KEY);
      if (storedVisible) {
        setVisibleAccounts(new Set(JSON.parse(storedVisible)));
      } else {
        // If no preferences are stored, show all accounts by default
        const allAccountIds = mockAccounts.map(acc => acc.id);
        setVisibleAccounts(new Set(allAccountIds));
      }

      // Load order
      const storedOrder = await AsyncStorage.getItem(ACCOUNT_ORDER_KEY);
      if (storedOrder) {
        setOrderedAccounts(JSON.parse(storedOrder));
      } else {
         // If no order is stored, use the default order
         setOrderedAccounts(mockAccounts.map(acc => acc.id));
      }

    } catch (error) {
      console.error('Error loading account data:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const recentTransactions = getRecentTransactions().slice(0, 5);

  // Filter and sort accounts based on preferences
  const displayedAccounts = mockAccounts
    .filter(account => visibleAccounts.has(account.id))
    .sort((a, b) => {
      const indexA = orderedAccounts.indexOf(a.id);
      const indexB = orderedAccounts.indexOf(b.id);
      if (indexA === -1 && indexB === -1) return 0; // Both not in order, maintain original relative order
      if (indexA === -1) return 1; // b is in order, a is not, a comes after b
      if (indexB === -1) return -1; // a is in order, b is not, a comes before b
      return indexA - indexB; // Both in order, sort by order index
    });

  const quickActions: Action[] = [
    {
      id: 'transfer',
      label: 'Transfer',
      icon: 'swap-horizontal-outline',
      onPress: () => router.push('/transfer'),
    },
    {
      id: 'pay-bills',
      label: 'Pay Bills',
      icon: 'receipt-outline',
      onPress: () => router.push('/pay-bills'),
    },
    {
      id: 'deposit',
      label: 'Deposit',
      icon: 'add-circle-outline',
      onPress: () => router.push('/deposit'),
    },
    {
      id: 'zelle',
      label: 'Send Money with Zelle™',
      icon: 'paper-plane-outline',
      onPress: () => router.push('/zelle'),
    },
  ];

  const getAccountById = (accountId: string) => {
    return mockAccounts.find(account => account.id === accountId) || mockAccounts[0];
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.secondary }]}>
      <Header onLogout={handleLogout} />
      <ScrollView style={styles.content}>
        <AccountSection accounts={displayedAccounts} />
        <ActivitySection quickActions={quickActions} />
        <RecentTransactionsSection 
          transactions={recentTransactions}
          getAccountById={getAccountById}
        />
        <View style={{ marginTop: 32, paddingHorizontal: 8, marginBottom: 32, paddingBottom: 24 }}>
          <Text style={{ fontSize: 12, color: theme.colors.text.secondary, textAlign: 'center', opacity: 0.7 }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Sed dictum, urna eu cursus dictum, enim erat dictum urna, nec dictum enim urna eu enim. 
            
            1234 Main Street, Springfield, USA 12345. 
            
            All transactions are subject to review and approval. Balances may not reflect all pending activity. This is not a statement of account. For questions, contact support. 
            
            © 2024 Fake Bank. All rights reserved. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. 
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  // Remove all the section styles that were moved to individual components
}); 