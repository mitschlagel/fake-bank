import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
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
  const [showMoneyActions, setShowMoneyActions] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  
  const account = mockAccounts.find(acc => acc.id === accountId);
  const accountTransactions = mockTransactions
    .filter(t => t.accountId === account?.id)
    .slice(0, 5);

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

  const handleMoneyButtonPress = (event: any) => {
    const { pageX, pageY } = event.nativeEvent;
    setMenuPosition({ x: pageX - 200, y: pageY + 10 }); // Position menu to the left of the button
    setShowMoneyActions(true);
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
          <View style={styles.summaryContent}>
            <View style={styles.summaryText}>
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
            
            {/* Money Movement Button */}
            <TouchableOpacity
              style={[styles.moneyMovementButton, { backgroundColor: theme.colors.primary }]}
              onPress={handleMoneyButtonPress}
            >
              <Ionicons name="ellipsis-horizontal" size={32} color={theme.colors.text.light} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Account Management Actions */}
        <View style={styles.actionsSection}>
          <View style={styles.quickActions}>
            {managementActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={[styles.actionButton, { backgroundColor: theme.colors.background.primary }]}
              >
                <Ionicons name={action.icon as keyof typeof Ionicons.glyphMap} size={16} color={theme.colors.primary} />
                <Text style={[styles.actionButtonText, { color: theme.colors.primary }]} numberOfLines={1}>
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
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

      {/* Money Movement Menu */}
      {showMoneyActions && (
        <Pressable
          style={styles.menuOverlay}
          onPress={() => setShowMoneyActions(false)}
        >
          <View 
            style={[
              styles.moneyActionsMenu,
              { 
                backgroundColor: theme.colors.background.primary,
                left: menuPosition.x,
                top: menuPosition.y,
              }
            ]}
          >
            {moneyActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={[styles.moneyActionItem, { borderBottomColor: theme.colors.border }]}
                onPress={() => {
                  setShowMoneyActions(false);
                  // Handle action
                  if (action.id === 'transfer') {
                    router.push('/transfer');
                  } else if (action.id === 'deposit') {
                    router.push('/deposit');
                  } else if (action.id === 'pay-bills' || action.id === 'pay-bill') {
                    router.push('/pay-bills');
                  }
                }}
              >
                <Ionicons name={action.icon as keyof typeof Ionicons.glyphMap} size={20} color={theme.colors.primary} />
                <Text style={[styles.moneyActionText, { color: theme.colors.text.primary }]}>
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      )}
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
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    minWidth: '48%',
    height: 44,
    paddingHorizontal: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
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
  summaryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryText: {
    flex: 1,
    marginRight: 16,
  },
  moneyMovementButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
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
  menuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  moneyActionsMenu: {
    position: 'absolute',
    width: 200,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1001,
  },
  moneyActionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
    borderBottomWidth: 1,
  },
  moneyActionText: {
    fontSize: 14,
    fontWeight: '500',
  },
}); 