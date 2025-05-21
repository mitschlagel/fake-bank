import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
    FlatList,
    Keyboard,
    Modal,
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

type DateFilter = 'all' | 'today' | 'week' | 'month' | 'year' | 'custom';
type SortOrder = 'newest' | 'oldest';

const getDateRange = (filter: DateFilter, customStartDate?: Date, customEndDate?: Date) => {
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
    case 'custom':
      if (customStartDate && customEndDate) {
        return { start: customStartDate, end: customEndDate };
      }
      return { start: new Date(0), end: now };
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
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [customStartDate, setCustomStartDate] = useState(new Date());
  const [customEndDate, setCustomEndDate] = useState(new Date());
  const [isSelectingStartDate, setIsSelectingStartDate] = useState(true);

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

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      if (isSelectingStartDate) {
        setCustomStartDate(selectedDate);
        setIsSelectingStartDate(false);
      } else {
        setCustomEndDate(selectedDate);
        setShowDatePicker(false);
        setIsSelectingStartDate(true);
      }
    }
  };

  const openDatePicker = (isStart: boolean) => {
    setIsSelectingStartDate(isStart);
    setShowDatePicker(true);
  };

  const filteredTransactions = useMemo(() => {
    let filtered = mockTransactions;

    // Filter by account if selected
    if (selectedAccountId) {
      filtered = filtered.filter(t => t.accountId === selectedAccountId);
    }

    // Apply date filter
    if (dateFilter !== 'all') {
      const { start, end } = getDateRange(dateFilter, customStartDate, customEndDate);
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
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [selectedAccountId, dateFilter, searchQuery, sortOrder, customStartDate, customEndDate]);

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

  const renderDatePickerModal = () => (
    <Modal
      visible={showDatePicker}
      transparent={true}
      animationType="slide"
    >
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, { backgroundColor: theme.colors.background.primary }]}>
          <Text style={[styles.modalTitle, { color: theme.colors.text.primary }]}>
            {isSelectingStartDate ? 'Select Start Date' : 'Select End Date'}
          </Text>
          <DateTimePicker
            value={isSelectingStartDate ? customStartDate : customEndDate}
            mode="date"
            display="spinner"
            onChange={handleDateChange}
            maximumDate={new Date()}
            minimumDate={isSelectingStartDate ? new Date(0) : customStartDate}
          />
          <TouchableOpacity
            style={[styles.modalButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => setShowDatePicker(false)}
          >
            <Text style={[styles.modalButtonText, { color: theme.colors.text.light }]}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderCustomDateRange = () => (
    <View style={styles.customDateContainer}>
      <TouchableOpacity
        style={[styles.dateButton, { backgroundColor: theme.colors.background.primary }]}
        onPress={() => openDatePicker(true)}
      >
        <Text style={[styles.dateButtonText, { color: theme.colors.text.primary }]}>
          {customStartDate.toLocaleDateString()}
        </Text>
      </TouchableOpacity>
      <Text style={[styles.dateRangeSeparator, { color: theme.colors.text.secondary }]}>to</Text>
      <TouchableOpacity
        style={[styles.dateButton, { backgroundColor: theme.colors.background.primary }]}
        onPress={() => openDatePicker(false)}
      >
        <Text style={[styles.dateButtonText, { color: theme.colors.text.primary }]}>
          {customEndDate.toLocaleDateString()}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderDateFilter = () => (
    <View style={styles.dateFilterContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TouchableOpacity
          style={[
            styles.dateFilterButton,
            dateFilter === 'all' 
              ? { backgroundColor: theme.colors.primary }
              : { backgroundColor: theme.colors.background.primary }
          ]}
          onPress={() => setDateFilter('all')}
        >
          <Text style={[
            styles.dateFilterText,
            dateFilter === 'all' 
              ? { color: theme.colors.text.light }
              : { color: theme.colors.text.primary }
          ]}>
            All Time
          </Text>
        </TouchableOpacity>
        {(['today', 'week', 'month', 'year'] as DateFilter[]).map(filter => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.dateFilterButton,
              dateFilter === filter 
                ? { backgroundColor: theme.colors.primary }
                : { backgroundColor: theme.colors.background.primary }
            ]}
            onPress={() => setDateFilter(filter)}
          >
            <Text style={[
              styles.dateFilterText,
              dateFilter === filter 
                ? { color: theme.colors.text.light }
                : { color: theme.colors.text.primary }
            ]}>
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={[
            styles.dateFilterButton,
            dateFilter === 'custom' 
              ? { backgroundColor: theme.colors.primary }
              : { backgroundColor: theme.colors.background.primary }
          ]}
          onPress={() => setDateFilter('custom')}
        >
          <Text style={[
            styles.dateFilterText,
            dateFilter === 'custom' 
              ? { color: theme.colors.text.light }
              : { color: theme.colors.text.primary }
          ]}>
            Custom Range
          </Text>
        </TouchableOpacity>
      </ScrollView>
      <TouchableOpacity
        style={[styles.sortButton, { backgroundColor: theme.colors.background.primary }]}
        onPress={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
      >
        <Text style={[styles.sortButtonText, { color: theme.colors.primary }]}>
          {sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}
        </Text>
      </TouchableOpacity>
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
      {renderDateFilter()}
      {dateFilter === 'custom' && renderCustomDateRange()}

      <FlatList
        data={filteredTransactions}
        renderItem={renderTransaction}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        keyboardDismissMode="on-drag"
        onScrollBeginDrag={Keyboard.dismiss}
      />

      {renderDatePickerModal()}
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateFilterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  dateFilterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  sortButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  modalButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  customDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },
  dateButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  dateButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  dateRangeSeparator: {
    fontSize: 14,
    fontWeight: '500',
  },
}); 