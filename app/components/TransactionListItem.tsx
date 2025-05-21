import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme';
import { Account, Transaction } from '../types/account';

interface TransactionListItemProps {
  transaction: Transaction;
  account: Account;
}

const BUSINESS_LOGOS: { [key: string]: string } = {
  'Starbucks': 'cafe',
  'Chipotle': 'restaurant',
  'Whole Foods': 'nutrition',
  'Trader Joe\'s': 'basket',
  'Amazon': 'cart',
  'Best Buy': 'desktop',
  'Nike': 'walk',
  'Apple Store': 'phone-portrait',
  'Netflix': 'film',
  'Spotify': 'musical-notes',
  'Uber': 'car',
  'Lyft': 'car',
  'Shell': 'water',
  'Exxon': 'water',
  'AT&T': 'call',
  'Verizon': 'call',
  'Comcast': 'tv',
  'CVS Pharmacy': 'medical',
  'Walgreens': 'medical',
  'Airbnb': 'home',
  'Expedia': 'airplane',
  'Delta Airlines': 'airplane',
  'Marriott': 'bed',
  'Hilton': 'bed',
  'Udemy': 'school',
  'Coursera': 'school',
  'Barnes & Noble': 'book',
  'PayPal': 'wallet',
  'Venmo': 'wallet',
  'Square': 'card',
  'Stripe': 'card',
};

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
    if (transaction.type === 'withdrawal' && transaction.description in BUSINESS_LOGOS) {
      return BUSINESS_LOGOS[transaction.description] as keyof typeof Ionicons.glyphMap;
    }
    
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
          color={transaction.amount >= 0 ? theme.colors.success : theme.colors.error}
        />
      </View>
      <View style={styles.detailsContainer}>
        <View style={styles.mainInfo}>
          <Text style={[styles.description, { color: theme.colors.text.primary }]}>
            {transaction.description}
          </Text>
          <Text style={[styles.amount, { color: transaction.amount >= 0 ? theme.colors.success : theme.colors.error }]}>
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