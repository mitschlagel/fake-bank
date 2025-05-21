import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme';
import { Account, Transaction } from '../types/account';

interface TransactionListItemProps {
  transaction: Transaction;
  account: Account;
}

export function TransactionListItem({ transaction, account }: TransactionListItemProps) {
  const theme = useTheme();

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getTransactionIcon = () => {
    switch (transaction.type) {
      case 'deposit':
        return 'arrow-down-circle' as keyof typeof Ionicons.glyphMap;
      case 'withdrawal':
        return 'arrow-up-circle' as keyof typeof Ionicons.glyphMap;
      case 'transfer':
        return 'swap-horizontal' as keyof typeof Ionicons.glyphMap;
      default:
        return 'help-circle' as keyof typeof Ionicons.glyphMap;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <View style={styles.iconContainer}>
        <Ionicons
          name={getTransactionIcon()}
          size={24}
          color={theme.colors.text.secondary}
        />
      </View>
      <View style={styles.detailsContainer}>
        <View style={styles.mainInfo}>
          <Text style={[styles.description, { color: theme.colors.text.primary }]}>
            {transaction.description}
          </Text>
          <Text style={[styles.amount, { color: transaction.amount >= 0 ? theme.colors.success : theme.colors.mutedError }]}>
            {formatAmount(transaction.amount)}
          </Text>
        </View>
        <View style={styles.secondaryInfo}>
          <Text style={[styles.date, { color: theme.colors.text.secondary }]}>
            {formatDate(transaction.date)}
          </Text>
          <Text style={[styles.account, { color: theme.colors.text.secondary }]}>
            {account.name}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailsContainer: {
    flex: 1,
  },
  mainInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  description: {
    fontSize: 16,
    fontWeight: '500',
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 14,
  },
  account: {
    fontSize: 14,
  },
}); 