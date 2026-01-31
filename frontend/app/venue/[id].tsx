import React, { useState, useEffect, useRef } from 'react';
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
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Calendar } from 'react-native-calendars';
import axios from 'axios';
import Constants from 'expo-constants';
import { useAuth } from '../../context/AuthContext';

const API_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_BACKEND_URL || process.env.EXPO_PUBLIC_BACKEND_URL;

export default function VenueDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [venue, setVenue] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const bottomSheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    fetchVenueDetails();
  }, [id]);

  useEffect(() => {
    if (selectedDate) {
      generateTimeSlots();
    }
  }, [selectedDate]);

  const fetchVenueDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/venues/${id}`);
      setVenue(response.data);
    } catch (error) {
      console.error('Error fetching venue:', error);
      Alert.alert('Error', 'Failed to load venue details');
    } finally {
      setLoading(false);
    }
  };

  const generateTimeSlots = () => {
    // Generate hourly slots from 6 AM to 11 PM
    const slots = [];
    for (let hour = 6; hour <= 22; hour++) {
      const startTime = `${hour.toString().padStart(2, '0')}:00`;
      const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
      slots.push(`${startTime} - ${endTime}`);
    }
    setAvailableSlots(slots);
  };

  const openDatePicker = () => {
    bottomSheetRef.current?.expand();
  };

  const onDateSelect = (day: any) => {
    setSelectedDate(day.dateString);
    bottomSheetRef.current?.close();
  };

  const handleBookSlot = (slot: string) => {
    if (!user) {
      Alert.alert('Login Required', 'Please login to book a slot');
      return;
    }
    setSelectedSlot(slot);
    const [startTime, endTime] = slot.split(' - ');
    router.push({
      pathname: '/booking/confirm',
      params: {
        venueId: id,
        venueName: venue.name,
        date: selectedDate,
        startTime,
        endTime,
        pricePerHour: venue.price_per_hour,
      },
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4EC0D6" />
      </View>
    );
  }

  if (!venue) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Venue not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{venue.name}</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.imageContainer}>
          <View style={styles.imagePlaceholder}>
            <Ionicons name="football" size={80} color="#4EC0D6" />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.titleRow}>
            <Text style={styles.venueName}>{venue.name}</Text>
            <View style={styles.rating}>
              <Ionicons name="star" size={20} color="#FFB300" />
              <Text style={styles.ratingText}>{venue.rating || '4.5'}</Text>
            </View>
          </View>

          <View style={styles.detail}>
            <Ionicons name="location" size={18} color="#666" />
            <Text style={styles.detailText}>{venue.address}</Text>
          </View>

          <View style={styles.detail}>
            <Ionicons name="pricetag" size={18} color="#666" />
            <Text style={styles.priceText}>₹{venue.price_per_hour}/hour</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.categories}>
            {venue.categories?.map((cat: string, idx: number) => (
              <View key={idx} style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{cat}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>{venue.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Amenities</Text>
          <View style={styles.amenities}>
            {venue.amenities?.map((amenity: string, idx: number) => (
              <View key={idx} style={styles.amenityItem}>
                <Ionicons name="checkmark-circle" size={20} color="#4EC0D6" />
                <Text style={styles.amenityText}>{amenity}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Book Your Slot</Text>
          <TouchableOpacity style={styles.dateSelector} onPress={openDatePicker}>
            <Ionicons name="calendar" size={20} color="#4EC0D6" />
            <Text style={styles.dateSelectorText}>
              {selectedDate || 'Select Date'}
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          {selectedDate && (
            <View style={styles.slotsContainer}>
              <Text style={styles.slotsTitle}>Available Slots</Text>
              <View style={styles.slots}>
                {availableSlots.map((slot, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.slotChip,
                      selectedSlot === slot && styles.slotChipSelected,
                    ]}
                    onPress={() => handleBookSlot(slot)}
                  >
                    <Text
                      style={[
                        styles.slotText,
                        selectedSlot === slot && styles.slotTextSelected,
                      ]}
                    >
                      {slot}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={['50%']}
        enablePanDownToClose
      >
        <BottomSheetView style={styles.bottomSheet}>
          <Text style={styles.bottomSheetTitle}>Select Date</Text>
          <Calendar
            onDayPress={onDateSelect}
            minDate={new Date().toISOString().split('T')[0]}
            markedDates={{
              [selectedDate]: { selected: true, selectedColor: '#4EC0D6' },
            }}
            theme={{
              todayTextColor: '#4EC0D6',
              selectedDayBackgroundColor: '#4EC0D6',
              arrowColor: '#4EC0D6',
            }}
          />
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorText: {
    fontSize: 18,
    color: '#999',
  },
  header: {
    backgroundColor: '#4EC0D6',
    paddingTop: 48,
    paddingHorizontal: 24,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    height: 200,
    backgroundColor: '#f5f5f5',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0F7FA',
  },
  section: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  venueName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4EC0D6',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryBadge: {
    backgroundColor: '#E0F7FA',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  categoryText: {
    fontSize: 14,
    color: '#3AA5BA',
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  amenities: {
    gap: 12,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  amenityText: {
    fontSize: 14,
    color: '#666',
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    gap: 12,
  },
  dateSelectorText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  slotsContainer: {
    marginTop: 24,
  },
  slotsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  slots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  slotChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4EC0D6',
    backgroundColor: '#fff',
  },
  slotChipSelected: {
    backgroundColor: '#4EC0D6',
  },
  slotText: {
    fontSize: 14,
    color: '#4EC0D6',
    fontWeight: '600',
  },
  slotTextSelected: {
    color: '#fff',
  },
  bottomSheet: {
    padding: 24,
  },
  bottomSheetTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
});