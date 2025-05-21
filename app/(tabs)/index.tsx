import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../app/theme';
import { TransactionListItem } from '../components/TransactionListItem';
import { mockAccounts, mockTransactions } from '../types/account';

const RecentTransactions = () => {
  const router = useRouter();
  const theme = useTheme();
  const [recentTransactions] = useState(mockTransactions.slice(0, 5));

  return (
    <View style={styles.transactionsSection}>
      <View style={styles.transactionsHeader}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Recent</Text>
        <TouchableOpacity 
          onPress={() => router.push('/transactions')}
        >
          <Text style={[styles.viewAllText, { color: theme.colors.primary }]}>View All</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.transactionsList}>
        {recentTransactions.map((transaction) => (
          <TouchableOpacity
            key={transaction.id}
            onPress={() => router.push({
              pathname: '/transactions',
              params: { selectedTransactionId: transaction.id }
            })}
            style={styles.transactionItem}
          >
            <TransactionListItem
              transaction={transaction}
              account={mockAccounts.find(acc => acc.id === transaction.accountId) || mockAccounts[0]}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  transactionsSection: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  transactionsList: {
    gap: 4,
  },
  transactionItem: {
    marginBottom: 4,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
});

export default RecentTransactions; 