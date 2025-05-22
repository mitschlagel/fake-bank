import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../theme';
import { Account } from '../../types/account';
import { AccountListItem } from '../AccountListItem';

interface AccountSectionProps {
  accounts: Account[];
}

export default function AccountSection({ accounts }: AccountSectionProps) {
  const router = useRouter();
  const theme = useTheme();

  return (
    <View style={styles.accountsSection}>
      <View style={styles.accountsHeader}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Accounts</Text>
        <TouchableOpacity 
          onPress={() => router.push('/manage-accounts')}
          style={styles.manageButton}
        >
          <Text style={[styles.manageButtonText, { color: theme.colors.primary }]}>Manage</Text>
        </TouchableOpacity>
      </View>
      {accounts.map((account) => (
        <AccountListItem
          key={account.id}
          account={account}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  accountsSection: {
    marginBottom: 24,
  },
  accountsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  manageButton: {
    marginTop: -12, // Adjust vertical alignment
  },
  manageButtonText: {
    fontSize: 14, // Match nearby text size
    fontWeight: '600', // Match nearby text weight
  },
}); 