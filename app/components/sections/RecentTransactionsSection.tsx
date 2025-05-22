import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../theme';
import { Account, Transaction } from '../../types/account';
import { TransactionListItem } from '../TransactionListItem';

interface RecentTransactionsSectionProps {
  transactions: Transaction[];
  getAccountById: (accountId: string) => Account;
}

export default function RecentTransactionsSection({ transactions, getAccountById }: RecentTransactionsSectionProps) {
  const router = useRouter();
  const theme = useTheme();

  return (
    <View>
      {/* Recent Transactions */}
      <View style={styles.recentHeader}>
        <Text style={[styles.subSectionTitle, { color: theme.colors.text.primary }]}>Recent Transactions</Text>
        <TouchableOpacity 
          onPress={() => router.push('/transactions')}
        >
          <Text style={[styles.viewAllText, { color: theme.colors.primary }]}>View All</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.activitySection, { backgroundColor: theme.colors.background.primary }]}> {/* Keep the container for the list */}
        {transactions.map((transaction) => (
          <TouchableOpacity
            key={transaction.id}
            onPress={() => router.push({
              pathname: '/transactions',
              params: { selectedTransactionId: transaction.id }
            })}
          >
            <TransactionListItem
              transaction={transaction}
              account={getAccountById(transaction.accountId)}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    marginTop: 8, // Keep space between header and list
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
}); 