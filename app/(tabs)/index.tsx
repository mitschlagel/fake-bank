import { signOut } from '@aws-amplify/auth';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Header } from '../components/Header';
import { useTheme } from '../theme';

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.secondary }]}>
      <Header onLogout={handleLogout} />
      <ScrollView style={styles.content}>
        {/* Balance Card */}
        <View style={[styles.balanceCard, { backgroundColor: theme.colors.background.primary }]}>
          <Text style={[styles.balanceLabel, { color: theme.colors.text.secondary }]}>Total Balance</Text>
          <Text style={[styles.balanceAmount, { color: theme.colors.text.primary }]}>$12,345.67</Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.colors.background.primary }]}>
            <Text style={[styles.actionButtonText, { color: theme.colors.primary }]}>Transfer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.colors.background.primary }]}>
            <Text style={[styles.actionButtonText, { color: theme.colors.primary }]}>Pay Bills</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.colors.background.primary }]}>
            <Text style={[styles.actionButtonText, { color: theme.colors.primary }]}>Deposit</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Transactions */}
        <View style={[styles.transactionsSection, { backgroundColor: theme.colors.background.primary }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Recent Transactions</Text>
          <View style={[styles.transactionItem, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.transactionInfo}>
              <Text style={[styles.transactionTitle, { color: theme.colors.text.primary }]}>Grocery Store</Text>
              <Text style={[styles.transactionDate, { color: theme.colors.text.secondary }]}>Today</Text>
            </View>
            <Text style={[styles.transactionAmount, { color: theme.colors.error }]}>-$45.67</Text>
          </View>
          <View style={[styles.transactionItem, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.transactionInfo}>
              <Text style={[styles.transactionTitle, { color: theme.colors.text.primary }]}>Salary Deposit</Text>
              <Text style={[styles.transactionDate, { color: theme.colors.text.secondary }]}>Yesterday</Text>
            </View>
            <Text style={[styles.transactionAmount, { color: theme.colors.success }]}>+$1,500.00</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  balanceCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  balanceLabel: {
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '700',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  transactionsSection: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 14,
    fontWeight: '400',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
});
