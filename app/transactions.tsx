import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
    FlatList,
    Keyboard,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { TransactionDetailsSheet } from './components/TransactionDetailsSheet';
import { TransactionListItem } from './components/TransactionListItem';
import { useTheme } from './theme';
import { mockAccounts, mockTransactions } from './types/account';

export default function TransactionsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { selectedTransactionId } = useLocalSearchParams<{ selectedTransactionId: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<typeof mockTransactions[0] | null>(null);

  // Set the selected transaction when the screen loads with a selectedTransactionId
  React.useEffect(() => {
    if (selectedTransactionId) {
      const transaction = mockTransactions.find(t => t.id === selectedTransactionId);
      if (transaction) {
        setSelectedTransaction(transaction);
      }
    }
  }, [selectedTransactionId]);

  const getAccountById = (accountId: string) => {
    return mockAccounts.find(account => account.id === accountId) || mockAccounts[0];
  };

  const filteredTransactions = useMemo(() => {
    let filtered = mockTransactions;

    // Filter by account if selected
    if (selectedAccountId) {
      filtered = filtered.filter(t => t.accountId === selectedAccountId);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(transaction => {
        const account = getAccountById(transaction.accountId);
        const date = new Date(transaction.date).toLocaleDateString();
        const amount = Math.abs(transaction.amount).toFixed(2);
        
        return (
          transaction.description.toLowerCase().includes(query) ||
          account.name.toLowerCase().includes(query) ||
          date.includes(query) ||
          amount.includes(query) ||
          transaction.type.toLowerCase().includes(query) ||
          (transaction.category?.toLowerCase().includes(query) ?? false)
        );
      });
    }

    return filtered;
  }, [searchQuery, selectedAccountId]);

  const renderTransaction = ({ item: transaction }: { item: typeof mockTransactions[0] }) => {
    const isSelected = transaction.id === selectedTransactionId;
    
    return (
      <TouchableOpacity
        onPress={() => setSelectedTransaction(transaction)}
        style={[
          styles.transactionContainer,
          isSelected && { backgroundColor: theme.colors.background.secondary }
        ]}
      >
        <TransactionListItem
          transaction={transaction}
          account={getAccountById(transaction.accountId)}
        />
      </TouchableOpacity>
    );
  };

  const renderAccountFilter = () => (
    <View style={styles.accountFilterContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TouchableOpacity
          style={[
            styles.accountFilterButton,
            !selectedAccountId 
              ? { backgroundColor: theme.colors.primary }
              : { backgroundColor: theme.colors.background.primary }
          ]}
          onPress={() => setSelectedAccountId(null)}
        >
          <Text style={[
            styles.accountFilterText,
            !selectedAccountId 
              ? { color: theme.colors.text.light }
              : { color: theme.colors.text.primary }
          ]}>
            All Accounts
          </Text>
        </TouchableOpacity>
        {mockAccounts.map(account => (
          <TouchableOpacity
            key={account.id}
            style={[
              styles.accountFilterButton,
              selectedAccountId === account.id 
                ? { backgroundColor: theme.colors.primary }
                : { backgroundColor: theme.colors.background.primary }
            ]}
            onPress={() => setSelectedAccountId(account.id)}
          >
            <Text style={[
              styles.accountFilterText,
              selectedAccountId === account.id 
                ? { color: theme.colors.text.light }
                : { color: theme.colors.text.primary }
            ]}>
              {account.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

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
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>Transactions</Text>
        </View>
      </View>

      <View style={[styles.searchContainer, { backgroundColor: theme.colors.background.primary }]}>
        <TextInput
          style={[
            styles.searchInput,
            { 
              backgroundColor: theme.colors.background.secondary,
              color: theme.colors.text.primary,
              borderColor: theme.colors.border
            }
          ]}
          placeholder="Search transactions..."
          placeholderTextColor={theme.colors.text.secondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {renderAccountFilter()}

      <FlatList
        data={filteredTransactions}
        renderItem={renderTransaction}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        keyboardDismissMode="on-drag"
        onScrollBeginDrag={Keyboard.dismiss}
      />

      <TransactionDetailsSheet
        transaction={selectedTransaction}
        account={selectedTransaction ? getAccountById(selectedTransaction.accountId) : mockAccounts[0]}
        visible={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
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
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  searchInput: {
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    borderWidth: 1,
  },
  accountFilterContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  accountFilterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  accountFilterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  transactionContainer: {
    marginBottom: 8,
    borderRadius: 8,
  },
}); 