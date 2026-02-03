import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import Constants from 'expo-constants';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const API_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_BACKEND_URL || process.env.EXPO_PUBLIC_BACKEND_URL;

export default function ConfirmBooking() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);

  const { venueId, venueName, date, startTime, endTime, pricePerHour } = params;

  const calculatePrice = () => {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return hours * parseFloat(pricePerHour as string);
  };

  const totalPrice = calculatePrice();

  const handleConfirmBooking = async () => {
    if (!user) {
      Alert.alert('Error', 'Please login to continue');
      return;
    }

    setLoading(true);
    try {
      const bookingData = {
        user_id: user.id,
        venue_id: venueId,
        date: date,
        start_time: startTime,
        end_time: endTime,
      };

      const response = await axios.post(`${API_URL}/api/bookings`, bookingData);
      
      Alert.alert(
        'Booking Created!',
        'Your booking has been created. Proceed to payment to confirm.',
        [
          {
            text: 'OK',
            onPress: () => {
              router.push('/(tabs)/bookings');
            },
          },
        ]
      );
    } catch (error) {
      console.error('Booking error:', error);
      Alert.alert('Error', 'Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}>
      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.divider }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Confirm Booking</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: colors.background }]}>
          <View style={styles.cardHeader}>
            <Ionicons name="calendar" size={24} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>Booking Summary</Text>
          </View>

          <View style={styles.detail}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Venue</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>{venueName}</Text>
          </View>

          <View style={styles.detail}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Date</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>{date}</Text>
          </View>

          <View style={styles.detail}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Time</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {startTime} - {endTime}
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.divider }]} />

          <View style={styles.detail}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Price per hour</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>₹{pricePerHour}</Text>
          </View>

          <View style={styles.detail}>
            <Text style={[styles.totalLabel, { color: colors.text }]}>Total Amount</Text>
            <Text style={[styles.totalValue, { color: colors.primary }]}>₹{totalPrice}</Text>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.background }]}>
          <View style={styles.cardHeader}>
            <Ionicons name="card" size={24} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>Payment Method</Text>
          </View>

          <TouchableOpacity style={[styles.paymentOption, { backgroundColor: colors.backgroundSecondary }]}>
            <View style={styles.paymentOptionLeft}>
              <Ionicons name="card" size={20} color={colors.textSecondary} />
              <Text style={[styles.paymentOptionText, { color: colors.text }]}>Razorpay (UPI/Card/Wallet)</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>

          <Text style={[styles.note, { color: colors.textMuted }]}>
            Note: Payment integration will be added once you provide the Razorpay API keys.
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.background }]}>
          <View style={styles.cardHeader}>
            <Ionicons name="information-circle" size={24} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>Cancellation Policy</Text>
          </View>
          <Text style={[styles.policyText, { color: colors.textSecondary }]}>
            • Free cancellation up to 24 hours before the booking
          </Text>
          <Text style={[styles.policyText, { color: colors.textSecondary }]}>
            • 50% refund for cancellations within 24 hours
          </Text>
          <Text style={[styles.policyText, { color: colors.textSecondary }]}>
            • No refund for no-shows
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.divider }]}>
        <View style={styles.footerLeft}>
          <Text style={[styles.footerLabel, { color: colors.textSecondary }]}>Total</Text>
          <Text style={[styles.footerPrice, { color: colors.text }]}>₹{totalPrice}</Text>
        </View>
        <TouchableOpacity
          style={[styles.confirmButton, { backgroundColor: colors.primary }, loading && styles.confirmButtonDisabled]}
          onPress={handleConfirmBooking}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.confirmButtonText}>Confirm & Pay</Text>
          )}
        </TouchableOpacity>
      </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  detail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  paymentOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  paymentOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  paymentOptionText: {
    fontSize: 14,
  },
  note: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  policyText: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
  },
  footerLeft: {
    flex: 1,
  },
  footerLabel: {
    fontSize: 14,
  },
  footerPrice: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  confirmButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    minWidth: 140,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    opacity: 0.6,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});