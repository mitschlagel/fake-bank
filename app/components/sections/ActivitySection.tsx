import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../theme';

export interface Action {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}

interface ActivitySectionProps {
  quickActions: Action[];
}

export default function ActivitySection({ quickActions }: ActivitySectionProps) {
  const theme = useTheme();

  return (
    <View style={styles.activitySectionContainer}> {/* New container for Activity and Recent Transactions */}
      <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Activity</Text>
      
      {/* Quick Actions */}
      <View style={styles.quickActions}>
        {quickActions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={[styles.actionButton, { backgroundColor: theme.colors.background.primary }]}
            onPress={action.onPress}
          >
            <Ionicons name={action.icon} size={16} color={theme.colors.primary} />
            <Text style={[styles.actionButtonText, { color: theme.colors.primary }]} numberOfLines={1}>
              {String(action.label)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  activitySectionContainer: {
    marginBottom: 24, // Increased spacing
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16, // Adjusted spacing to match other sections
  },
  actionButton: {
    flex: 1,
    minWidth: '48%',
    height: 44,
    paddingHorizontal: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
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
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
}); 