import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import DraggableFlatList, {
    RenderItemParams,
    ScaleDecorator
} from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useTheme } from './theme';
import { Account, mockAccounts } from './types/account';

const VISIBLE_ACCOUNTS_KEY = '@visible_accounts';
const ACCOUNT_ORDER_KEY = '@account_order';

export default function ManageAccountsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [visibleAccounts, setVisibleAccounts] = useState<Set<string>>(new Set());
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    loadAccountData();
  }, []);

  const loadAccountData = async () => {
    try {
      // Load visibility
      const storedVisible = await AsyncStorage.getItem(VISIBLE_ACCOUNTS_KEY);
      let initialVisible = new Set<string>();
      if (storedVisible) {
        initialVisible = new Set(JSON.parse(storedVisible));
      } else {
        // Default to all visible
        initialVisible = new Set(mockAccounts.map(acc => acc.id));
        await AsyncStorage.setItem(VISIBLE_ACCOUNTS_KEY, JSON.stringify([...initialVisible]));
      }
      setVisibleAccounts(initialVisible);

      // Load order
      const storedOrder = await AsyncStorage.getItem(ACCOUNT_ORDER_KEY);
      let orderedAccounts = [...mockAccounts];
      if (storedOrder) {
        const accountOrder: string[] = JSON.parse(storedOrder);
        // Sort mockAccounts based on the stored order
        orderedAccounts = mockAccounts.sort((a, b) => {
          const indexA = accountOrder.indexOf(a.id);
          const indexB = accountOrder.indexOf(b.id);
          if (indexA === -1 && indexB === -1) return 0;
          if (indexA === -1) return 1; // b is in order, a is not, a comes after b
          if (indexB === -1) return -1; // a is in order, b is not, a comes before b
          return indexA - indexB;
        });
      } else {
         // If no order is stored, save the default order
         await AsyncStorage.setItem(ACCOUNT_ORDER_KEY, JSON.stringify(mockAccounts.map(acc => acc.id)));
      }
      setAccounts(orderedAccounts);

    } catch (error) {
      console.error('Error loading account data:', error);
    }
  };

  const toggleAccountVisibility = async (accountId: string) => {
    const newVisibleAccounts = new Set(visibleAccounts);
    if (newVisibleAccounts.has(accountId)) {
      newVisibleAccounts.delete(accountId);
    } else {
      newVisibleAccounts.add(accountId);
    }
    setVisibleAccounts(newVisibleAccounts);
    
    try {
      await AsyncStorage.setItem(VISIBLE_ACCOUNTS_KEY, JSON.stringify([...newVisibleAccounts]));
    } catch (error) {
      console.error('Error saving visible accounts:', error);
    }
  };

  const handleDragEnd = async ({ data }: { data: Account[] }) => {
    setAccounts(data);
    try {
        await AsyncStorage.setItem(ACCOUNT_ORDER_KEY, JSON.stringify(data.map(acc => acc.id)));
    } catch (error) {
        console.error('Error saving account order:', error);
    }
  };

  const renderItem = useCallback(
    ({ item, drag, isActive }: RenderItemParams<Account>) => (
      <ScaleDecorator>
        <TouchableOpacity
          disabled={isActive}
          style={[styles.accountItem, isActive && { backgroundColor: theme.colors.background.secondary, opacity: 0.8 }, { borderBottomColor: theme.colors.border }]} // Adjusted style for drag state
        >
          <View style={styles.accountItemContent}>
            <View style={styles.accountInfo}>
               <Ionicons 
                    name={item.type === 'checking' ? 'card' : item.type === 'savings' ? 'wallet' : 'cash'} 
                    size={24} 
                    color={theme.colors.primary} 
                  />
              <View style={styles.accountDetails}>
                <Text style={[styles.accountName, { color: theme.colors.text.primary }]}>
                  {item.name}
                </Text>
                <Text style={[styles.accountNumber, { color: theme.colors.text.secondary }]}>
                  Account ending in {item.lastFourDigits}
                </Text>
              </View>
            </View>
            <Switch
              value={visibleAccounts.has(item.id)}
              onValueChange={() => toggleAccountVisibility(item.id)}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={theme.colors.background.primary}
            />
            <TouchableOpacity onPressIn={drag} style={styles.dragHandle}>
              <Ionicons name="reorder-three-outline" size={24} color={theme.colors.text.secondary} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </ScaleDecorator>
    ),
    [visibleAccounts, toggleAccountVisibility, theme] // Added dependencies
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={[styles.container, { backgroundColor: theme.colors.background.secondary }]}>
        <View style={[styles.header, { backgroundColor: theme.colors.background.primary }]}>
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={() => router.back()}
          >
            <Text style={[styles.closeButtonText, { color: theme.colors.primary }]}>Done</Text>
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: theme.colors.text.primary }]}>Manage Accounts</Text>
          </View>
        </View>

        <View style={styles.content}> {/* Changed ScrollView to View to accommodate DraggableFlatList */}
          <View style={[styles.accountsList, { backgroundColor: theme.colors.background.primary }]}>
            <DraggableFlatList
              data={accounts}
              onDragEnd={handleDragEnd}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              contentContainerStyle={{ paddingBottom: 20 }} // Add some padding at the bottom
            />
          </View>
        </View>
      </View>
    </GestureHandlerRootView>
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
  accountsList: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  accountItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    paddingRight: 12,
  },
  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
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
  accountNumber: {
    fontSize: 14,
  },
  dragHandle: {
    paddingLeft: 12,
  },
}); 