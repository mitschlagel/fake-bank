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

type DepositType = 'check' | 'cash';

export default function DepositScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [depositType, setDepositType] = useState<DepositType>('check');
  const [toAccount, setToAccount] = useState(mockAccounts[0]);
  const [amount, setAmount] = useState('');

  const handleDeposit = () => {
    // TODO: Implement deposit logic
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
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>Make a Deposit</Text>
        </View>
      </View>

      <View style={[styles.content, { backgroundColor: theme.colors.background.primary }]}>
        <View style={styles.depositTypeContainer}>
          <TouchableOpacity
            style={[
              styles.depositTypeButton,
              { backgroundColor: theme.colors.background.secondary },
              depositType === 'check' && { borderColor: theme.colors.primary, borderWidth: 2 }
            ]}
            onPress={() => setDepositType('check')}
          >
            <Ionicons name="document-text-outline" size={32} color={theme.colors.primary} />
            <Text style={[styles.depositTypeText, { color: theme.colors.text.primary }]}>
              Mobile Check Deposit
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.depositTypeButton,
              { backgroundColor: theme.colors.background.secondary },
              depositType === 'cash' && { borderColor: theme.colors.primary, borderWidth: 2 }
            ]}
            onPress={() => setDepositType('cash')}
          >
            <Ionicons name="cash-outline" size={32} color={theme.colors.primary} />
            <Text style={[styles.depositTypeText, { color: theme.colors.text.primary }]}>
              Cash Deposit
            </Text>
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

        {depositType === 'check' && (
          <View style={styles.checkInstructions}>
            <Text style={[styles.instructionsTitle, { color: theme.colors.text.primary }]}>
              How to deposit a check:
            </Text>
            <Text style={[styles.instruction, { color: theme.colors.text.secondary }]}>
              1. Sign the back of your check
            </Text>
            <Text style={[styles.instruction, { color: theme.colors.text.secondary }]}>
              2. Write &quot;For mobile deposit only&quot; below your signature
            </Text>
            <Text style={[styles.instruction, { color: theme.colors.text.secondary }]}>
              3. Take clear photos of the front and back
            </Text>
          </View>
        )}

        <TouchableOpacity 
          style={[styles.depositButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleDeposit}
        >
          <Text style={[styles.depositButtonText, { color: theme.colors.text.light }]}>
            {depositType === 'check' ? 'Take Photos' : 'Find ATM'}
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
  depositTypeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  depositTypeButton: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  depositTypeText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
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
  checkInstructions: {
    marginTop: 24,
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  instruction: {
    fontSize: 14,
    marginBottom: 8,
  },
  depositButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 44,
  },
  depositButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 