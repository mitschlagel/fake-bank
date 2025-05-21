import { Ionicons } from '@expo/vector-icons';
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
import { Account, mockAccounts, mockTransactions } from './types/account';

const getAccountActions = (account: Account) => {
  const moneyActions = [
    { id: 'transfer', label: 'Transfer', icon: 'swap-horizontal' },
    { id: 'deposit', label: 'Deposit', icon: 'arrow-down-circle' },
    { id: 'withdraw', label: 'Withdraw', icon: 'arrow-up-circle' },
  ];

  const managementActions = [
    { id: 'statements', label: 'Statements', icon: 'document-text' },
    { id: 'details', label: 'Account Details', icon: 'information-circle' },
  ];

  // Add account-specific actions
  if (account.type === 'checking') {
    moneyActions.push({ id: 'pay-bills', label: 'Pay Bills', icon: 'card' });
    managementActions.push(
      { id: 'debit-card', label: 'Debit Card', icon: 'card' },
      { id: 'alerts', label: 'Alerts', icon: 'notifications' }
    );
  } else if (account.type === 'savings') {
    moneyActions.push({ id: 'set-goal', label: 'Set Goal', icon: 'flag' });
    managementActions.push(
      { id: 'interest', label: 'Interest Details', icon: 'trending-up' },
      { id: 'alerts', label: 'Alerts', icon: 'notifications' }
    );
  } else if (account.type === 'credit') {
    moneyActions.push(
      { id: 'pay-bill', label: 'Pay Bill', icon: 'card' },
      { id: 'cash-advance', label: 'Cash Advance', icon: 'cash' }
    );
    managementActions.push(
      { id: 'credit-card', label: 'Credit Card', icon: 'card' },
      { id: 'lock-card', label: 'Lock Card', icon: 'lock-closed' },
      { id: 'rewards', label: 'Rewards', icon: 'gift' }
    );
  }

  return { moneyActions, managementActions };
};

export default function AccountDetailsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { accountId } = useLocalSearchParams<{ accountId: string }>();
  
  const account = mockAccounts.find(acc => acc.id === accountId);
  const accountTransactions = mockTransactions
    .filter(t => t.accountId === account?.id)
    .slice(0, 5); // Limit to 5 most recent transactions

  if (!account) {
    return null;
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const { moneyActions, managementActions } = getAccountActions(account);

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
            Account ending in {account.lastFourDigits}
          </Text>
          <Text style={[styles.balance, { color: theme.colors.text.primary }]}>
            {formatAmount(account.balance)}
          </Text>
          {account.type === 'credit' && account.availableCredit !== undefined && (
            <Text style={[styles.availableCredit, { color: theme.colors.text.secondary }]}>
              Available Credit: {formatAmount(account.availableCredit)}
            </Text>
          )}
        </View>

        {/* Money Movement Actions */}
        <View style={styles.actionsSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Money Movement</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.actionsRow}
          >
            {moneyActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={[styles.actionButton, { backgroundColor: theme.colors.background.primary }]}
              >
                <Ionicons name={action.icon as keyof typeof Ionicons.glyphMap} size={20} color={theme.colors.primary} />
                <Text 
                  style={[styles.actionButtonText, { color: theme.colors.primary }]}
                  numberOfLines={1}
                >
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Account Management Actions */}
        <View style={styles.actionsSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Account Management</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.actionsRow}
          >
            {managementActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={[styles.actionButton, { backgroundColor: theme.colors.background.primary }]}
              >
                <Ionicons name={action.icon as keyof typeof Ionicons.glyphMap} size={20} color={theme.colors.primary} />
                <Text 
                  style={[styles.actionButtonText, { color: theme.colors.primary }]}
                  numberOfLines={1}
                >
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Recent Transactions */}
        <View style={styles.transactionsSection}>
          <View style={styles.transactionsHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Recent Activity</Text>
            <TouchableOpacity 
              onPress={() => router.push({
                pathname: '/transactions',
                params: { accountId: account.id }
              })}
            >
              <Text style={[styles.viewAllText, { color: theme.colors.primary }]}>View All</Text>
            </TouchableOpacity>
          </View>
          {accountTransactions.map((transaction) => (
            <TouchableOpacity
              key={transaction.id}
              onPress={() => router.push({
                pathname: '/transactions',
                params: { 
                  accountId: account.id,
                  selectedTransactionId: transaction.id
                }
              })}
            >
              <TransactionListItem
                transaction={transaction}
                account={account}
              />
            </TouchableOpacity>
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
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  transactionContainer: {
    marginBottom: 8,
    borderRadius: 8,
  },
  actionsSection: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
  },
  actionButton: {
    width: 100,
    height: 80,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
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
    marginTop: 4,
    textAlign: 'center',
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 16,
    fontWeight: '600',
  },
  availableCredit: {
    fontSize: 14,
    marginTop: 8,
  },
}); 