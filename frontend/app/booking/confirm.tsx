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

const API_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_BACKEND_URL || process.env.EXPO_PUBLIC_BACKEND_URL;

export default function ConfirmBooking() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
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
              // In real app, navigate to payment gateway
              // For now, just go to bookings
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
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirm Booking</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="calendar" size={24} color="#4CAF50" />
            <Text style={styles.cardTitle}>Booking Summary</Text>
          </View>

          <View style={styles.detail}>
            <Text style={styles.detailLabel}>Venue</Text>
            <Text style={styles.detailValue}>{venueName}</Text>
          </View>

          <View style={styles.detail}>
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>{date}</Text>
          </View>

          <View style={styles.detail}>
            <Text style={styles.detailLabel}>Time</Text>
            <Text style={styles.detailValue}>
              {startTime} - {endTime}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detail}>
            <Text style={styles.detailLabel}>Price per hour</Text>
            <Text style={styles.detailValue}>₹{pricePerHour}</Text>
          </View>

          <View style={styles.detail}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>₹{totalPrice}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="card" size={24} color="#4CAF50" />
            <Text style={styles.cardTitle}>Payment Method</Text>
          </View>

          <TouchableOpacity style={styles.paymentOption}>
            <View style={styles.paymentOptionLeft}>
              <Ionicons name="card" size={20} color="#666" />
              <Text style={styles.paymentOptionText}>Razorpay (UPI/Card/Wallet)</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <Text style={styles.note}>
            Note: Payment integration will be added once you provide the Razorpay API keys.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="information-circle" size={24} color="#4CAF50" />
            <Text style={styles.cardTitle}>Cancellation Policy</Text>
          </View>
          <Text style={styles.policyText}>
            • Free cancellation up to 24 hours before the booking
          </Text>
          <Text style={styles.policyText}>
            • 50% refund for cancellations within 24 hours
          </Text>
          <Text style={styles.policyText}>
            • No refund for no-shows
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <Text style={styles.footerLabel}>Total</Text>
          <Text style={styles.footerPrice}>₹{totalPrice}</Text>
        </View>
        <TouchableOpacity
          style={[styles.confirmButton, loading && styles.confirmButtonDisabled]}
          onPress={handleConfirmBooking}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
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
    backgroundColor: '#f8f8f8',
  },
  header: {
    backgroundColor: '#fff',
    paddingTop: 48,
    paddingHorizontal: 24,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
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
    color: '#333',
  },
  detail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  paymentOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
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
    color: '#333',
  },
  note: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  policyText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  footerLeft: {
    flex: 1,
  },
  footerLabel: {
    fontSize: 14,
    color: '#666',
  },
  footerPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    minWidth: 140,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: '#A5D6A7',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});