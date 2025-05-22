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
    const isPositive = amount >= 0;
    const formattedAmount = Math.abs(amount).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
    return `${isPositive ? '+' : ''}${formattedAmount}`;
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
          color={theme.colors.primary}
        />
      </View>
      <View style={styles.detailsContainer}>
        <View style={styles.mainInfo}>
          <Text style={[styles.description, { color: theme.colors.text.primary }]}>
            {transaction.description}
          </Text>
          <Text style={[
            styles.amount,
            { color: transaction.amount >= 0 ? theme.colors.success : theme.colors.text.primary }
          ]}>
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
    padding: 4,
    borderRadius: 8,
    marginVertical: 4
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
    fontSize: 14,
    fontWeight: '500',
  },
  amount: {
    fontSize: 14,
    fontWeight: '600',
    paddingRight: 4
  },
  secondaryInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 4
  },
  date: {
    fontSize: 12,
  },
  account: {
    fontSize: 12,
  },
}); 