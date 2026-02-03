import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

const HomeIcon = ({ color, size }: { color: string; size: number }) => (
  <Ionicons name="home" size={size} color={color} />
);

const BookingsIcon = ({ color, size }: { color: string; size: number }) => (
  <Ionicons name="calendar" size={size} color={color} />
);

const ProfileIcon = ({ color, size }: { color: string; size: number }) => (
  <Ionicons name="person" size={size} color={color} />
);

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopWidth: 1,
          borderTopColor: colors.divider,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: HomeIcon,
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: 'My Bookings',
          tabBarIcon: BookingsIcon,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ProfileIcon,
        }}
      />
    </Tabs>
  );
}
