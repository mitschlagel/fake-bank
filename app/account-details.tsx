import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { TransactionListItem } from './components/TransactionListItem';
import { useTheme } from './theme';
import { mockAccounts, mockTransactions } from './types/account';

export default function AccountDetailsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { accountId } = useLocalSearchParams<{ accountId: string }>();
  
  const account = mockAccounts.find(acc => acc.id === accountId) || mockAccounts[0];
  const accountTransactions = mockTransactions.filter(t => t.accountId === account.id);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.secondary }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.background.primary }]}>
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={() => router.back()}
        >
          <Text style={[styles.closeButtonText, { color: theme.colors.primary }]}>Close</Text>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>Account Details</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Account Summary */}
        <View style={[styles.summaryCard, { backgroundColor: theme.colors.background.primary }]}>
          <Text style={[styles.accountName, { color: theme.colors.text.primary }]}>{account.name}</Text>
          <Text style={[styles.accountNumber, { color: theme.colors.text.secondary }]}>
            Account ending in {account.accountNumber.slice(-4)}
          </Text>
          <Text style={[styles.balance, { color: theme.colors.text.primary }]}>
            {formatAmount(account.balance)}
          </Text>
        </View>

        {/* Account Transactions */}
        <View style={styles.transactionsSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Transactions</Text>
          {accountTransactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionContainer}>
              <TransactionListItem
                transaction={transaction}
                account={account}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  closeButton: {
    padding: 8,
    position: 'absolute',
    left: 8,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  summaryCard: {
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  accountName: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
  },
  accountNumber: {
    fontSize: 14,
    marginBottom: 16,
  },
  balance: {
    fontSize: 32,
    fontWeight: '700',
  },
  transactionsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  transactionContainer: {
    marginBottom: 8,
    borderRadius: 8,
  },
}); 