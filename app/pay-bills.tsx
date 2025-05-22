import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useTheme } from './theme';
import { mockAccounts } from './types/account';

// Mock billers data
const mockBillers = [
  { id: '1', name: 'Electric Company', accountNumber: '1234567890', icon: 'flash-outline' },
  { id: '2', name: 'Water Utility', accountNumber: '0987654321', icon: 'water-outline' },
  { id: '3', name: 'Internet Provider', accountNumber: '5555555555', icon: 'wifi-outline' },
  { id: '4', name: 'Phone Company', accountNumber: '4444444444', icon: 'phone-portrait-outline' },
];

export default function PayBillsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [selectedBiller, setSelectedBiller] = useState<typeof mockBillers[0] | null>(null);
  const [fromAccount, setFromAccount] = useState(mockAccounts[0]);
  const [amount, setAmount] = useState('');

  const handlePayment = () => {
    // TODO: Implement payment logic
    router.back();
  };

  const renderBiller = ({ item: biller }: { item: typeof mockBillers[0] }) => (
    <TouchableOpacity
      style={[
        styles.billerItem,
        { backgroundColor: theme.colors.background.secondary },
        selectedBiller?.id === biller.id && { borderColor: theme.colors.primary, borderWidth: 2 }
      ]}
      onPress={() => setSelectedBiller(biller)}
    >
      <View style={styles.billerInfo}>
        <Ionicons name={biller.icon as any} size={24} color={theme.colors.primary} />
        <View style={styles.billerDetails}>
          <Text style={[styles.billerName, { color: theme.colors.text.primary }]}>
            {biller.name}
          </Text>
          <Text style={[styles.billerAccount, { color: theme.colors.text.secondary }]}>
            Account: {biller.accountNumber}
          </Text>
        </View>
      </View>
      {selectedBiller?.id === biller.id && (
        <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
      )}
    </TouchableOpacity>
  );

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
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>Pay Bills</Text>
        </View>
      </View>

      <View style={[styles.content, { backgroundColor: theme.colors.background.primary }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
          Select Biller
        </Text>
        <FlatList
          data={mockBillers}
          renderItem={renderBiller}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.billerList}
        />

        {selectedBiller && (
          <>
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
              style={[styles.payButton, { backgroundColor: theme.colors.primary }]}
              onPress={handlePayment}
            >
              <Text style={[styles.payButtonText, { color: theme.colors.text.light }]}>
                Pay Bill
              </Text>
            </TouchableOpacity>
          </>
        )}
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  billerList: {
    gap: 12,
  },
  billerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
  },
  billerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  billerDetails: {
    marginLeft: 12,
    flex: 1,
  },
  billerName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  billerAccount: {
    fontSize: 14,
  },
  formGroup: {
    marginTop: 24,
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
  payButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 44,
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 