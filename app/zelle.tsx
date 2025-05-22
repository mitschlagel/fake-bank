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

// Mock contacts data
const mockContacts = [
  { id: '1', name: 'John Smith', email: 'john.smith@email.com', phone: '(555) 123-4567' },
  { id: '2', name: 'Sarah Johnson', email: 'sarah.j@email.com', phone: '(555) 234-5678' },
  { id: '3', name: 'Michael Brown', email: 'm.brown@email.com', phone: '(555) 345-6789' },
];

export default function ZelleScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [selectedContact, setSelectedContact] = useState<typeof mockContacts[0] | null>(null);
  const [fromAccount, setFromAccount] = useState(mockAccounts[0]);
  const [amount, setAmount] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSend = () => {
    // TODO: Implement Zelle send logic
    router.back();
  };

  const filteredContacts = mockContacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone.includes(searchQuery)
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
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>Send Money with Zelle™</Text>
        </View>
      </View>

      <View style={[styles.content, { backgroundColor: theme.colors.background.primary }]}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={theme.colors.text.secondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text.primary }]}
            placeholder="Search contacts..."
            placeholderTextColor={theme.colors.text.secondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.contactsList}>
          {filteredContacts.map(contact => (
            <TouchableOpacity
              key={contact.id}
              style={[
                styles.contactItem,
                { backgroundColor: theme.colors.background.secondary },
                selectedContact?.id === contact.id && { borderColor: theme.colors.primary, borderWidth: 2 }
              ]}
              onPress={() => setSelectedContact(contact)}
            >
              <View style={styles.contactInfo}>
                <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
                  <Text style={[styles.avatarText, { color: theme.colors.text.light }]}>
                    {contact.name.charAt(0)}
                  </Text>
                </View>
                <View style={styles.contactDetails}>
                  <Text style={[styles.contactName, { color: theme.colors.text.primary }]}>
                    {contact.name}
                  </Text>
                  <Text style={[styles.contactEmail, { color: theme.colors.text.secondary }]}>
                    {contact.email}
                  </Text>
                </View>
              </View>
              {selectedContact?.id === contact.id && (
                <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {selectedContact && (
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
              style={[styles.sendButton, { backgroundColor: theme.colors.primary }]}
              onPress={handleSend}
            >
              <Text style={[styles.sendButtonText, { color: theme.colors.text.light }]}>
                Send Money
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  contactsList: {
    gap: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '600',
  },
  contactDetails: {
    marginLeft: 12,
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  contactEmail: {
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
  sendButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 44,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 