import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../theme';
import { Account } from '../types/account';

interface AccountDetailsSheetProps {
  account: Account | null;
  visible: boolean;
  onClose: () => void;
}

export function AccountDetailsSheet({ account, visible, onClose }: AccountDetailsSheetProps) {
  const theme = useTheme();

  if (!account) return null;

  const formatBalance = (balance: number) => {
    const isNegative = balance < 0;
    const formattedBalance = Math.abs(balance).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
    return `${isNegative ? '-' : ''}${formattedBalance}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={[styles.sheet, { backgroundColor: theme.colors.background.primary }]}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={theme.colors.text.primary} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: theme.colors.text.primary }]}>{account.name}</Text>
          </View>

          {/* Account Details */}
          <View style={styles.content}>
            <View style={[styles.balanceSection, { borderBottomColor: theme.colors.border }]}>
              <Text style={[styles.balanceLabel, { color: theme.colors.text.secondary }]}>Current Balance</Text>
              <Text
                style={[
                  styles.balanceAmount,
                  { color: account.balance < 0 ? theme.colors.error : theme.colors.text.primary },
                ]}
              >
                {formatBalance(account.balance)}
              </Text>
            </View>

            <View style={styles.detailsSection}>
              <View style={[styles.detailRow, { borderBottomColor: theme.colors.border }]}>
                <Text style={[styles.detailLabel, { color: theme.colors.text.secondary }]}>Account Number</Text>
                <Text style={[styles.detailValue, { color: theme.colors.text.primary }]}>
                  •••• {account.lastFourDigits}
                </Text>
              </View>

              {account.type === 'savings' && account.interestRate && (
                <View style={[styles.detailRow, { borderBottomColor: theme.colors.border }]}>
                  <Text style={[styles.detailLabel, { color: theme.colors.text.secondary }]}>Interest Rate</Text>
                  <Text style={[styles.detailValue, { color: theme.colors.text.primary }]}>
                    {account.interestRate}% APY
                  </Text>
                </View>
              )}

              {account.type === 'credit' && (
                <>
                  <View style={[styles.detailRow, { borderBottomColor: theme.colors.border }]}>
                    <Text style={[styles.detailLabel, { color: theme.colors.text.secondary }]}>Available Credit</Text>
                    <Text style={[styles.detailValue, { color: theme.colors.text.primary }]}>
                      {formatBalance(account.availableCredit || 0)}
                    </Text>
                  </View>
                  <View style={[styles.detailRow, { borderBottomColor: theme.colors.border }]}>
                    <Text style={[styles.detailLabel, { color: theme.colors.text.secondary }]}>Minimum Payment</Text>
                    <Text style={[styles.detailValue, { color: theme.colors.text.primary }]}>
                      {formatBalance(account.minimumPayment || 0)}
                    </Text>
                  </View>
                  <View style={[styles.detailRow, { borderBottomColor: theme.colors.border }]}>
                    <Text style={[styles.detailLabel, { color: theme.colors.text.secondary }]}>Payment Due Date</Text>
                    <Text style={[styles.detailValue, { color: theme.colors.text.primary }]}>
                      {account.dueDate ? formatDate(account.dueDate) : 'N/A'}
                    </Text>
                  </View>
                </>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: '50%',
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  closeButton: {
    padding: 8,
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  balanceSection: {
    paddingBottom: 24,
    marginBottom: 24,
    borderBottomWidth: 1,
  },
  balanceLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: '700',
  },
  detailsSection: {
    gap: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  detailLabel: {
    fontSize: 16,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
  },
}); 