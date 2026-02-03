import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function Profile() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { colors, isDark, toggleTheme } = useTheme();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  const menuItems = [
    { icon: 'person-circle', title: 'Edit Profile', route: null },
    { icon: 'notifications', title: 'Notifications', route: null },
    { icon: 'card', title: 'Payment Methods', route: null },
    { icon: 'help-circle', title: 'Help & Support', route: null },
    { icon: 'information-circle', title: 'About', route: null },
  ];

  if (user?.role === 'owner') {
    menuItems.unshift(
      { icon: 'business', title: 'My Venues', route: null },
      { icon: 'stats-chart', title: 'Dashboard', route: null }
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}>
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.profileCard, { backgroundColor: colors.background }]}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Ionicons name="person" size={48} color="#FFFFFF" />
          </View>
          <Text style={[styles.name, { color: colors.text }]}>{user?.name}</Text>
          <Text style={[styles.phone, { color: colors.textSecondary }]}>{user?.phone}</Text>
          <View style={[styles.roleBadge, { backgroundColor: colors.accentLight }]}>
            <Text style={[styles.roleText, { color: colors.primary }]}>
              {user?.role === 'owner' ? 'Venue Owner' : 'Customer'}
            </Text>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.background }]}>
          <View style={styles.themeToggle}>
            <View style={styles.themeToggleLeft}>
              <Ionicons name={isDark ? 'moon' : 'sunny'} size={24} color={colors.primary} />
              <Text style={[styles.menuItemText, { color: colors.text }]}>Dark Mode</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.divider, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <View style={[styles.menu, { backgroundColor: colors.background }]}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem, { borderBottomColor: colors.divider }]}
              onPress={() => item.route && router.push(item.route as any)}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name={item.icon as any} size={24} color={colors.primary} />
                <Text style={[styles.menuItemText, { color: colors.text }]}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={[styles.logoutButton, { backgroundColor: colors.background }]} onPress={handleLogout}>
          <Ionicons name="log-out" size={24} color={colors.error} />
          <Text style={[styles.logoutText, { color: colors.error }]}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 48,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  profileCard: {
    padding: 32,
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  phone: {
    fontSize: 16,
    marginBottom: 12,
  },
  roleBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  roleText: {
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 16,
    padding: 16,
  },
  themeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  themeToggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  menu: {
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  menuItemText: {
    fontSize: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 24,
    marginVertical: 24,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
  },
});