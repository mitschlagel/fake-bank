import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../theme';
import { Account } from '../types/account';

interface AccountListItemProps {
  account: Account;
}

export function AccountListItem({ account }: AccountListItemProps) {
  const router = useRouter();
  const theme = useTheme();

  const getAccountIcon = () => {
    switch (account.type) {
      case 'checking':
        return 'wallet-outline';
      case 'savings':
        return 'cash-outline';
      case 'credit':
        return 'card-outline';
      default:
        return 'wallet-outline';
    }
  };

  const formatBalance = (balance: number) => {
    const isNegative = balance < 0;
    const formattedBalance = Math.abs(balance).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
    return `${isNegative ? '-' : ''}${formattedBalance}`;
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: theme.colors.background.primary }]}
      onPress={() => router.push({
        pathname: '/account-details',
        params: { accountId: account.id }
      })}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={getAccountIcon()} size={24} color={theme.colors.primary} />
      </View>
      <View style={styles.details}>
        <Text style={[styles.name, { color: theme.colors.text.primary }]}>{account.name}</Text>
        <Text style={[styles.accountNumber, { color: theme.colors.text.secondary }]}>
          •••• {account.accountNumber.slice(-4)}
        </Text>
      </View>
      <View style={styles.balanceContainer}>
        <Text
          style={[
            styles.balance,
            { color: account.balance < 0 ? theme.colors.error : theme.colors.text.primary },
          ]}
        >
          {formatBalance(account.balance)}
        </Text>
        {account.type === 'credit' && (
          <Text style={[styles.availableCredit, { color: theme.colors.text.secondary }]}>
            Available: {formatBalance(account.availableCredit || 0)}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  accountNumber: {
    fontSize: 14,
  },
  balanceContainer: {
    alignItems: 'flex-end',
  },
  balance: {
    fontSize: 16,
    fontWeight: '600',
  },
  availableCredit: {
    fontSize: 12,
    marginTop: 4,
  },
}); 