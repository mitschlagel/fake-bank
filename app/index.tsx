import { signOut } from '@aws-amplify/auth';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AccountListItem } from './components/AccountListItem';
import { Header } from './components/Header';
import { TransactionListItem } from './components/TransactionListItem';
import { useTheme } from './theme';
import { getRecentTransactions, mockAccounts } from './types/account';

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.secondary }]}>
      <Header onLogout={handleLogout} />
      <ScrollView style={styles.content}>
        {/* Accounts Section */}
        <View style={styles.accountsSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Accounts</Text>
          {mockAccounts.map((account) => (
            <AccountListItem
              key={account.id}
              account={account}
            />
          ))}
        </View>

        {/* Activity Section */}
        <View>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Activity</Text>
          
          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <View style={styles.quickActionsRow}>
              <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.colors.background.primary }]}>
                <Text style={[styles.actionButtonText, { color: theme.colors.primary }]} numberOfLines={1}>Transfer</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.colors.background.primary }]}>
                <Text style={[styles.actionButtonText, { color: theme.colors.primary }]} numberOfLines={1}>Pay Bills</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.quickActionsRow}>
              <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.colors.background.primary }]}>
                <Text style={[styles.actionButtonText, { color: theme.colors.primary }]} numberOfLines={1}>Deposit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.colors.background.primary }]}>
                <Text style={[styles.actionButtonText, { color: theme.colors.primary }]} numberOfLines={1}>Send Money with Zelle™</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Recent Transactions */}
          <View style={[styles.activitySection, { backgroundColor: theme.colors.background.primary }]}>
            <View style={styles.recentHeader}>
              <Text style={[styles.subSectionTitle, { color: theme.colors.text.primary }]}>Recent</Text>
              <TouchableOpacity 
                onPress={() => router.push('/transactions')}
              >
                <Text style={[styles.viewAllText, { color: theme.colors.primary }]}>View All</Text>
              </TouchableOpacity>
            </View>
            {getRecentTransactions().map((transaction) => (
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
    marginBottom: 12,
    gap: 8,
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    height: 44,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  accountsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
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
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
}); 