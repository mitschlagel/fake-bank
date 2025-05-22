import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
    FlatList,
    Keyboard,
    Modal,
    Pressable,
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

type DateFilter = 'all' | 'today' | 'week' | 'month' | 'year';

const getDateRange = (filter: DateFilter) => {
  const now = new Date();
  const start = new Date();
  
  switch (filter) {
    case 'today':
      start.setHours(0, 0, 0, 0);
      break;
    case 'week':
      start.setDate(now.getDate() - 7);
      break;
    case 'month':
      start.setMonth(now.getMonth() - 1);
      break;
    case 'year':
      start.setFullYear(now.getFullYear() - 1);
      break;
    default:
      return { start: new Date(0), end: now };
  }
  
  return { start, end: now };
};

export default function TransactionsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { selectedTransactionId } = useLocalSearchParams<{ selectedTransactionId: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<typeof mockTransactions[0] | null>(null);
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [showDateRangeModal, setShowDateRangeModal] = useState(false);

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

    // Apply date filter
    if (dateFilter !== 'all') {
      const { start, end } = getDateRange(dateFilter);
      filtered = filtered.filter(t => {
        const date = new Date(t.date);
        return date >= start && date <= end;
      });
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

    // Sort transactions
    filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA; // Always sort newest first
    });

    return filtered;
  }, [selectedAccountId, dateFilter, searchQuery]);

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

  const renderDateFilter = () => (
    <View style={styles.dateFilterContainer}>
      <Modal
        visible={showDateRangeModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDateRangeModal(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setShowDateRangeModal(false)}
        >
          <Pressable 
            style={[styles.dateRangeModalContent, { backgroundColor: theme.colors.background.primary }]}
            onPress={e => e.stopPropagation()}
          >
            <View style={styles.dateRangeModalHeader}>
              <Text style={[styles.dateRangeModalTitle, { color: theme.colors.text.primary }]}>
                Select Date Range
              </Text>
              <Pressable
                onPress={() => setShowDateRangeModal(false)}
                style={({ pressed }) => [
                  styles.dateRangeCloseButton,
                  { opacity: pressed ? 0.7 : 1 }
                ]}
              >
                <Ionicons name="close" size={24} color={theme.colors.text.primary} />
              </Pressable>
            </View>

            <View style={styles.dateRangeOptions}>
              {['All', 'Today', 'Week', 'Month', 'Year'].map((option) => (
                <Pressable
                  key={option}
                  onPress={() => {
                    setDateFilter(option.toLowerCase() as DateFilter);
                    setShowDateRangeModal(false);
                  }}
                  style={({ pressed }) => [
                    styles.dateRangeOption,
                    dateFilter === option.toLowerCase() && styles.dateRangeOptionSelected,
                    { opacity: pressed ? 0.7 : 1 }
                  ]}
                >
                  <Text
                    style={[
                      styles.dateRangeOptionText,
                      { color: theme.colors.text.primary },
                      dateFilter === option.toLowerCase() && { color: theme.colors.primary }
                    ]}
                  >
                    {option}
                  </Text>
                </Pressable>
              ))}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
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
        <TouchableOpacity 
          style={styles.calendarButton}
          onPress={() => setShowDateRangeModal(true)}
        >
          <Ionicons name="calendar-outline" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
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
      {renderDateFilter()}

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
  dateFilterContainer: {
    // display: 'none',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  dateRangeModalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: '80%',
  },
  dateRangeModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateRangeModalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  dateRangeCloseButton: {
    padding: 4,
  },
  dateRangeOptions: {
    gap: 8,
  },
  dateRangeOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  dateRangeOptionSelected: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  dateRangeOptionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  calendarButton: {
    padding: 8,
    position: 'absolute',
    right: 8,
    zIndex: 1,
  },
}); 