import { signOut } from '@aws-amplify/auth';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AccountDetailsSheet } from './components/AccountDetailsSheet';
import { AccountListItem } from './components/AccountListItem';
import { Header } from './components/Header';
import { TransactionListItem } from './components/TransactionListItem';
import { useTheme } from './theme';
import { Account, getRecentTransactions, mockAccounts } from './types/account';

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleAccountPress = (account: Account) => {
    setSelectedAccount(account);
    setIsDetailsVisible(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsVisible(false);
    setSelectedAccount(null);
  };

  const getAccountById = (accountId: string) => {
    return mockAccounts.find(account => account.id === accountId) || mockAccounts[0];
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
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.colors.background.primary }]}>
              <Text style={[styles.actionButtonText, { color: theme.colors.primary }]}>Transfer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.colors.background.primary }]}>
              <Text style={[styles.actionButtonText, { color: theme.colors.primary }]}>Pay Bills</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.colors.background.primary }]}>
              <Text style={[styles.actionButtonText, { color: theme.colors.primary }]}>Deposit</Text>
            </TouchableOpacity>
          </View>

          {/* Recent Transactions */}
          <View style={[styles.activitySection, { backgroundColor: theme.colors.background.primary }]}>
            <Text style={[styles.subSectionTitle, { color: theme.colors.text.primary }]}>Recent</Text>
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

      <AccountDetailsSheet
        account={selectedAccount}
        visible={isDetailsVisible}
        onClose={handleCloseDetails}
      />
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
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
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
    fontSize: 14,
    fontWeight: '600',
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
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
}); 