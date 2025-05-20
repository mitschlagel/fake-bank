import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Animated, Dimensions, Image, Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../theme';

interface HeaderProps {
  onLogout: () => void;
}

export function Header({ onLogout }: HeaderProps) {
  const theme = useTheme();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [menuAnimation] = useState(new Animated.Value(0));
  const screenWidth = Dimensions.get('window').width;

  const toggleMenu = () => {
    const toValue = isMenuVisible ? 0 : 1;
    setIsMenuVisible(!isMenuVisible);
    Animated.spring(menuAnimation, {
      toValue,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  };

  const menuTranslateX = menuAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [screenWidth, 0],
  });

  const overlayOpacity = menuAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
  });

  return (
    <>
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background.primary }]}>
        <View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
          <Image 
            source={require('../../headerLogo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <TouchableOpacity onPress={toggleMenu} style={styles.profileButton}>
            <Ionicons name="person-circle-outline" size={32} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <Modal
        visible={isMenuVisible}
        transparent
        animationType="none"
        onRequestClose={toggleMenu}
      >
        <View style={styles.modalContainer}>
          <Animated.View 
            style={[
              styles.overlay,
              { opacity: overlayOpacity },
            ]}
          >
            <TouchableOpacity 
              style={styles.overlayTouchable} 
              onPress={toggleMenu}
            />
          </Animated.View>

          <Animated.View 
            style={[
              styles.menu,
              {
                transform: [{ translateX: menuTranslateX }],
                backgroundColor: theme.colors.background.primary,
              },
            ]}
          >
            <SafeAreaView style={styles.menuSafeArea}>
              <View style={[styles.menuHeader, { borderBottomColor: theme.colors.border }]}>
                <Text style={[styles.menuTitle, { color: theme.colors.text.primary }]}>Profile</Text>
                <TouchableOpacity onPress={toggleMenu} style={styles.closeButton}>
                  <Ionicons name="close" size={28} color={theme.colors.text.primary} />
                </TouchableOpacity>
              </View>

              <View style={styles.menuContent}>
                {/* Profile Section */}
                <View style={[styles.section, { borderBottomColor: theme.colors.border }]}>
                  <View style={styles.accountInfo}>
                    <View style={[styles.avatar, { backgroundColor: theme.colors.background.secondary }]}>
                      <Ionicons name="person" size={40} color={theme.colors.primary} />
                    </View>
                    <View style={styles.accountDetails}>
                      <Text style={[styles.accountName, { color: theme.colors.text.primary }]}>Bob Alice</Text>
                      <Text style={[styles.accountNumber, { color: theme.colors.text.secondary }]}>bobalice@gmail.com</Text>
                    </View>
                  </View>
                </View>

                {/* Settings */}
                <View style={[styles.section, { borderBottomColor: theme.colors.border }]}>
                  <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>Settings</Text>
                  <TouchableOpacity style={styles.menuItem}>
                    <Ionicons name="notifications-outline" size={24} color={theme.colors.primary} />
                    <Text style={[styles.menuItemText, { color: theme.colors.text.primary }]}>Notifications</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.menuItem}>
                    <Ionicons name="shield-checkmark-outline" size={24} color={theme.colors.primary} />
                    <Text style={[styles.menuItemText, { color: theme.colors.text.primary }]}>Security</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.menuItem}>
                    <Ionicons name="help-circle-outline" size={24} color={theme.colors.primary} />
                    <Text style={[styles.menuItemText, { color: theme.colors.text.primary }]}>Help & Support</Text>
                  </TouchableOpacity>
                </View>

                {/* Logout */}
                <View style={[styles.section, { borderBottomColor: theme.colors.border }]}>
                  <TouchableOpacity 
                    style={[styles.menuItem, styles.logoutItem]} 
                    onPress={() => {
                      toggleMenu();
                      onLogout();
                    }}
                  >
                    <Ionicons name="log-out-outline" size={24} color={theme.colors.error} />
                    <Text style={[styles.menuItemText, styles.logoutText, { color: theme.colors.error }]}>Log Out</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </SafeAreaView>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: 'transparent',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  logo: {
    height: 40,
    width: 120,
  },
  profileButton: {
    padding: 4,
  },
  modalContainer: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
  },
  overlayTouchable: {
    flex: 1,
  },
  menu: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: '85%',
  },
  menuSafeArea: {
    flex: 1,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  closeButton: {
    padding: 8,
    marginRight: -8,
  },
  menuContent: {
    flex: 1,
  },
  section: {
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  accountDetails: {
    flex: 1,
  },
  accountName: {
    fontSize: 20,
    fontWeight: '600',
  },
  accountNumber: {
    fontSize: 14,
    marginTop: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 16,
  },
  logoutItem: {
    marginTop: 16,
  },
  logoutText: {
    color: 'red',
  },
}); 