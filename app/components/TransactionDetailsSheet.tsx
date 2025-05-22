import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useTheme } from '../theme';
import { Account, Transaction } from '../types/account';

interface TransactionDetailsSheetProps {
  transaction: Transaction | null;
  account: Account;
  visible: boolean;
  onClose: () => void;
}

export function TransactionDetailsSheet({ transaction, account, visible, onClose }: TransactionDetailsSheetProps) {
  const theme = useTheme();

  if (!transaction) return null;

  const formatAmount = (amount: number) => {
    const formattedAmount = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(Math.abs(amount));
    
    return amount >= 0 ? `+${formattedAmount}` : formattedAmount;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTransactionIcon = () => {
    switch (transaction.type) {
      case 'deposit':
        return 'arrow-down-circle';
      case 'withdrawal':
        return 'arrow-up-circle';
      case 'transfer':
        return 'swap-horizontal';
      default:
        return 'help-circle';
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={[styles.sheet, { backgroundColor: theme.colors.background.primary }]}>
          <View style={styles.handle} />
          
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={theme.colors.text.primary} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: theme.colors.text.primary }]}>Transaction Details</Text>
          </View>

          <View style={styles.content}>
            <View style={styles.amountContainer}>
              <Ionicons
                name={getTransactionIcon()}
                size={48}
                color={transaction.amount >= 0 ? theme.colors.success : theme.colors.text.primary}
              />
              <Text style={[
                styles.amount,
                { color: transaction.amount >= 0 ? theme.colors.success : theme.colors.text.primary }
              ]}>
                {formatAmount(transaction.amount)}
              </Text>
            </View>

            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
                <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Description</Text>
                <Text style={[styles.value, { color: theme.colors.text.primary }]}>
                  {transaction.description}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Date</Text>
                <Text style={[styles.value, { color: theme.colors.text.primary }]}>
                  {formatDate(transaction.date)}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Account</Text>
                <Text style={[styles.value, { color: theme.colors.text.primary }]}>
                  {account.name}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Type</Text>
                <Text style={[styles.value, { color: theme.colors.text.primary }]}>
                  {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                </Text>
              </View>

              {transaction.category && (
                <View style={styles.detailRow}>
                  <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Category</Text>
                  <Text style={[styles.value, { color: theme.colors.text.primary }]}>
                    {transaction.category}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: 400,
    maxHeight: '80%',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
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
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 16,
  },
  content: {
    padding: 24,
  },
  amountContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  amount: {
    fontSize: 36,
    fontWeight: '700',
    marginTop: 16,
  },
  detailsContainer: {
    gap: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
  },
}); 