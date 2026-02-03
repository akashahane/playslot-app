import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import Constants from 'expo-constants';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const API_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_BACKEND_URL || process.env.EXPO_PUBLIC_BACKEND_URL;

type Tab = 'upcoming' | 'past';

export default function Bookings() {
  const [activeTab, setActiveTab] = useState<Tab>('upcoming');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { colors } = useTheme();

  useEffect(() => {
    fetchBookings();
  }, [activeTab]);

  const fetchBookings = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/api/bookings/user/${user.id}?status=${activeTab}`
      );
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return colors.primary;
      case 'pending':
        return colors.warning;
      case 'cancelled':
        return colors.error;
      default:
        return colors.textMuted;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>My Bookings</Text>
      </View>

      <View style={[styles.tabs, { backgroundColor: colors.background, borderBottomColor: colors.divider }]}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'upcoming' && { borderBottomColor: colors.primary }]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text
            style={[
              styles.tabText,
              { color: colors.textMuted },
              activeTab === 'upcoming' && { color: colors.primary },
            ]}
          >
            Upcoming
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'past' && { borderBottomColor: colors.primary }]}
          onPress={() => setActiveTab('past')}
        >
          <Text
            style={[
              styles.tabText,
              { color: colors.textMuted },
              activeTab === 'past' && { color: colors.primary },
            ]}
          >
            Past
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 32 }} />
        ) : bookings.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={64} color={colors.textMuted} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No bookings yet</Text>
            <Text style={[styles.emptySubtext, { color: colors.textMuted }]}>
              {activeTab === 'upcoming'
                ? 'Book your first venue now!'
                : 'Your past bookings will appear here'}
            </Text>
          </View>
        ) : (
          bookings.map((booking: any) => (
            <View key={booking._id} style={[styles.bookingCard, { backgroundColor: colors.backgroundCard }]}>
              <View style={styles.bookingHeader}>
                <Text style={[styles.venueName, { color: colors.text }]}>{booking.venue_name}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: `${getStatusColor(booking.status)}20` },
                  ]}
                >
                  <Text style={[styles.statusText, { color: getStatusColor(booking.status) }]}>
                    {booking.status}
                  </Text>
                </View>
              </View>

              <View style={styles.bookingDetail}>
                <Ionicons name="calendar" size={16} color={colors.textSecondary} />
                <Text style={[styles.detailText, { color: colors.textSecondary }]}>{booking.date}</Text>
              </View>

              <View style={styles.bookingDetail}>
                <Ionicons name="time" size={16} color={colors.textSecondary} />
                <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                  {booking.start_time} - {booking.end_time}
                </Text>
              </View>

              <View style={styles.bookingDetail}>
                <Ionicons name="cash" size={16} color={colors.textSecondary} />
                <Text style={[styles.detailText, { color: colors.textSecondary }]}>₹{booking.total_price}</Text>
              </View>

              {activeTab === 'upcoming' && booking.status === 'confirmed' && (
                <View style={styles.actions}>
                  <TouchableOpacity style={[styles.actionButton, { borderColor: colors.primary }]}>
                    <Text style={[styles.actionText, { color: colors.primary }]}>Reschedule</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, { borderColor: colors.error }]}
                  >
                    <Text style={[styles.actionText, { color: colors.error }]}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))
        )}
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
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 16,
    gap: 16,
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  bookingCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  venueName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  bookingDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  detailText: {
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
  },
});