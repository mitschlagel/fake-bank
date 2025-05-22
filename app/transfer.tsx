import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useTheme } from './theme';
import { mockAccounts } from './types/account';

export default function TransferScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [fromAccount, setFromAccount] = useState(mockAccounts[0]);
  const [toAccount, setToAccount] = useState(mockAccounts[1]);
  const [amount, setAmount] = useState('');

  const handleTransfer = () => {
    // TODO: Implement transfer logic
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.secondary }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.background.primary }]}>
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={() => router.back()}
        >
          <Text style={[styles.closeButtonText, { color: theme.colors.primary }]}>Cancel</Text>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>Transfer Money</Text>
        </View>
      </View>

      <View style={[styles.content, { backgroundColor: theme.colors.background.primary }]}>
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: theme.colors.text.secondary }]}>From Account</Text>
          <TouchableOpacity 
            style={[styles.accountSelector, { backgroundColor: theme.colors.background.secondary }]}
            onPress={() => {/* TODO: Show account picker */}}
          >
            <View style={styles.accountInfo}>
              <Ionicons 
                name={fromAccount.type === 'checking' ? 'wallet-outline' : 'cash-outline'} 
                size={24} 
                color={theme.colors.primary} 
              />
              <View style={styles.accountDetails}>
                <Text style={[styles.accountName, { color: theme.colors.text.primary }]}>
                  {fromAccount.name}
                </Text>
                <Text style={[styles.accountBalance, { color: theme.colors.text.secondary }]}>
                  Available: ${fromAccount.balance.toFixed(2)}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color={theme.colors.text.secondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: theme.colors.text.secondary }]}>To Account</Text>
          <TouchableOpacity 
            style={[styles.accountSelector, { backgroundColor: theme.colors.background.secondary }]}
            onPress={() => {/* TODO: Show account picker */}}
          >
            <View style={styles.accountInfo}>
              <Ionicons 
                name={toAccount.type === 'checking' ? 'wallet-outline' : 'cash-outline'} 
                size={24} 
                color={theme.colors.primary} 
              />
              <View style={styles.accountDetails}>
                <Text style={[styles.accountName, { color: theme.colors.text.primary }]}>
                  {toAccount.name}
                </Text>
                <Text style={[styles.accountBalance, { color: theme.colors.text.secondary }]}>
                  Available: ${toAccount.balance.toFixed(2)}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color={theme.colors.text.secondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: theme.colors.text.secondary }]}>Amount</Text>
          <View style={[styles.amountInput, { backgroundColor: theme.colors.background.secondary }]}>
            <Text style={[styles.currencySymbol, { color: theme.colors.text.primary }]}>$</Text>
            <TextInput
              style={[styles.input, { color: theme.colors.text.primary }]}
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor={theme.colors.text.secondary}
            />
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.transferButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleTransfer}
        >
          <Text style={[styles.transferButtonText, { color: theme.colors.text.light }]}>
            Transfer Money
          </Text>
        </TouchableOpacity>
      </View>
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
    padding: 16,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  accountSelector: {
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  accountDetails: {
    marginLeft: 12,
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  accountBalance: {
    fontSize: 14,
  },
  amountInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '600',
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 24,
    fontWeight: '600',
  },
  transferButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 44,
  },
  transferButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 