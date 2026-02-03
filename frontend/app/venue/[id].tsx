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
import { useTheme } from '../../context/ThemeContext';

const API_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_BACKEND_URL || process.env.EXPO_PUBLIC_BACKEND_URL;

export default function VenueDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { colors } = useTheme();
  const [venue, setVenue] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
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

  const onDateSelect = (day: { dateString: string }) => {
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
    } as any);
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!venue) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.textSecondary }]}>Venue not found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{venue.name}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.imageContainer, { backgroundColor: colors.backgroundSecondary }]}>
          <View style={[styles.imagePlaceholder, { backgroundColor: colors.accentLight }]}>
            <Ionicons name="football" size={80} color={colors.primary} />
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.background, borderBottomColor: colors.divider }]}>
          <View style={styles.titleRow}>
            <Text style={[styles.venueName, { color: colors.text }]}>{venue.name}</Text>
            <View style={styles.rating}>
              <Ionicons name="star" size={20} color="#FFB300" />
              <Text style={[styles.ratingText, { color: colors.textSecondary }]}>{venue.rating || '4.5'}</Text>
            </View>
          </View>

          <View style={styles.detail}>
            <Ionicons name="location" size={18} color={colors.textSecondary} />
            <Text style={[styles.detailText, { color: colors.textSecondary }]}>{venue.address}</Text>
          </View>

          <View style={styles.detail}>
            <Ionicons name="pricetag" size={18} color={colors.textSecondary} />
            <Text style={[styles.priceText, { color: colors.primary }]}>₹{venue.price_per_hour}/hour</Text>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.background, borderBottomColor: colors.divider }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Categories</Text>
          <View style={styles.categories}>
            {venue.categories?.map((cat: string, idx: number) => (
              <View key={idx} style={[styles.categoryBadge, { backgroundColor: colors.accentLight }]}>
                <Text style={[styles.categoryText, { color: colors.primary }]}>{cat}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.background, borderBottomColor: colors.divider }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>{venue.description}</Text>
        </View>

        <View style={[styles.section, { backgroundColor: colors.background, borderBottomColor: colors.divider }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Amenities</Text>
          <View style={styles.amenities}>
            {venue.amenities?.map((amenity: string, idx: number) => (
              <View key={idx} style={styles.amenityItem}>
                <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                <Text style={[styles.amenityText, { color: colors.textSecondary }]}>{amenity}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.background }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Book Your Slot</Text>
          <TouchableOpacity style={[styles.dateSelector, { backgroundColor: colors.backgroundSecondary }]} onPress={openDatePicker}>
            <Ionicons name="calendar" size={20} color={colors.primary} />
            <Text style={[styles.dateSelectorText, { color: colors.text }]}>
              {selectedDate || 'Select Date'}
            </Text>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>

          {selectedDate && (
            <View style={styles.slotsContainer}>
              <Text style={[styles.slotsTitle, { color: colors.text }]}>Available Slots</Text>
              <View style={styles.slots}>
                {availableSlots.map((slot, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.slotChip,
                      { borderColor: colors.primary, backgroundColor: colors.background },
                      selectedSlot === slot && { backgroundColor: colors.primary },
                    ]}
                    onPress={() => handleBookSlot(slot)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.slotText,
                        { color: colors.primary },
                        selectedSlot === slot && { color: '#FFFFFF' },
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
        backgroundStyle={{ backgroundColor: colors.backgroundCard }}
        handleIndicatorStyle={{ backgroundColor: colors.textMuted }}
      >
        <BottomSheetView style={styles.bottomSheet}>
          <Text style={[styles.bottomSheetTitle, { color: colors.text }]}>Select Date</Text>
          <Calendar
            onDayPress={onDateSelect}
            minDate={new Date().toISOString().split('T')[0]}
            markedDates={{
              [selectedDate]: { selected: true, selectedColor: colors.primary },
            }}
            theme={{
              backgroundColor: colors.backgroundCard,
              calendarBackground: colors.backgroundCard,
              textSectionTitleColor: colors.text,
              selectedDayBackgroundColor: colors.primary,
              selectedDayTextColor: '#FFFFFF',
              todayTextColor: colors.primary,
              dayTextColor: colors.text,
              textDisabledColor: colors.textMuted,
              monthTextColor: colors.text,
              arrowColor: colors.primary,
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
  },
  header: {
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
    color: '#FFFFFF',
    flex: 1,
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    height: 200,
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    padding: 24,
    borderBottomWidth: 1,
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
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    flex: 1,
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
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
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  dateSelectorText: {
    flex: 1,
    fontSize: 16,
  },
  slotsContainer: {
    marginTop: 24,
  },
  slotsTitle: {
    fontSize: 16,
    fontWeight: '600',
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
  },
  slotText: {
    fontSize: 14,
    fontWeight: '600',
  },
  bottomSheet: {
    padding: 24,
  },
  bottomSheetTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});