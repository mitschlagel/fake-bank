import { signOut } from '@aws-amplify/auth';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AccountListItem } from './components/AccountListItem';
import { Header } from './components/Header';
import { TransactionListItem } from './components/TransactionListItem';
import { useTheme } from './theme';
import { getRecentTransactions, mockAccounts } from './types/account';

const VISIBLE_ACCOUNTS_KEY = '@visible_accounts';
const ACCOUNT_ORDER_KEY = '@account_order';

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

  const recentTransactions = getRecentTransactions().slice(0, 3);

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

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.secondary }]}>
      <Header onLogout={handleLogout} />
      <ScrollView style={styles.content}>
        {/* Accounts Section */}
        <View style={styles.accountsSection}>
          <View style={styles.accountsHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Accounts</Text>
            <TouchableOpacity 
              onPress={() => router.push('/manage-accounts')}
              style={styles.manageButton}
            >
              <Text style={[styles.manageButtonText, { color: theme.colors.primary }]}>Manage</Text>
            </TouchableOpacity>
          </View>
          {displayedAccounts.map((account) => (
            <AccountListItem
              key={account.id}
              account={account}
            />
          ))}
        </View>

        {/* Activity Section */}
        <View style={styles.activitySectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Activities</Text>
          
          {/* Quick Actions */}
          <View style={styles.quickActions}>
            {[
              { id: 'transfer', label: 'Transfer', icon: 'swap-horizontal' },
              { id: 'pay-bills', label: 'Pay Bills', icon: 'card' },
              { id: 'deposit', label: 'Deposit', icon: 'arrow-down-circle' },
              { id: 'zelle', label: 'Send Money with Zelle™', icon: 'paper-plane' }
            ].map((action) => (
              <TouchableOpacity
                key={action.id}
                style={[styles.actionButton, { backgroundColor: theme.colors.background.primary }]}
              >
                <Ionicons name={action.icon as keyof typeof Ionicons.glyphMap} size={16} color={theme.colors.primary} />
                <Text style={[styles.actionButtonText, { color: theme.colors.primary }]} numberOfLines={1}>
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Recent Transactions */}
          <View style={styles.recentHeader}>
            <Text style={[styles.subSectionTitle, { color: theme.colors.text.primary }]}>Recent Transactions</Text>
            <TouchableOpacity 
              onPress={() => router.push('/transactions')}
            >
              <Text style={[styles.viewAllText, { color: theme.colors.primary }]}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.activitySection, { backgroundColor: theme.colors.background.primary }]}>
            {recentTransactions.map((transaction) => (
              <TouchableOpacity
                key={transaction.id}
                onPress={() => router.push({
                  pathname: '/transactions',
                  params: { selectedTransactionId: transaction.id }
                })}
              >
                <TransactionListItem
                  transaction={transaction}
                  account={mockAccounts.find(acc => acc.id === transaction.accountId) || mockAccounts[0]}
                />
              </TouchableOpacity>
            ))}
          </View>
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
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 40,
  },
  actionButton: {
    flex: 1,
    minWidth: '48%',
    height: 44,
    paddingHorizontal: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  accountsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  activitySection: {
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    marginTop: 8,
  },
  activitySectionContainer: {
    marginBottom: 24,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 0,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  accountsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  manageButton: {
    // Keep this style for potential future adjustments, but remove padding here too
    marginTop: -12, // Adjust vertical alignment
  },
  manageButtonText: {
    fontSize: 14, // Match nearby text size
    fontWeight: '600', // Match nearby text weight
    // Add any other specific text styles if needed
  },
}); 