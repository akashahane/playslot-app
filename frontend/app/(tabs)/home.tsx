import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Calendar } from 'react-native-calendars';
import axios from 'axios';
import Constants from 'expo-constants';
import { useTheme } from '../../context/ThemeContext';

const API_URL = Constants.expoConfig?.extra?.EXPO_PUBLIC_BACKEND_URL || process.env.EXPO_PUBLIC_BACKEND_URL;

const categories = [
  { id: 'all', name: 'All', icon: 'grid' },
  { id: 'football', name: 'Football', icon: 'football' },
  { id: 'cricket', name: 'Cricket', icon: 'baseball' },
  { id: 'gaming', name: 'Gaming', icon: 'game-controller' },
  { id: 'other', name: 'Other', icon: 'fitness' },
];

export default function Home() {
  const [location, setLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const router = useRouter();
  const { colors } = useTheme();

  useEffect(() => {
    fetchVenues();
  }, [selectedCategory, selectedDate]);

  const fetchVenues = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (selectedCategory !== 'all') params.category = selectedCategory;
      if (selectedDate) params.date = selectedDate;
      if (location) params.location = location;

      const response = await axios.get(`${API_URL}/api/venues/search`, { params });
      setVenues(response.data);
    } catch (error) {
      console.error('Error fetching venues:', error);
      Alert.alert('Error', 'Failed to load venues');
    } finally {
      setLoading(false);
    }
  };

  const openFilters = () => {
    bottomSheetRef.current?.expand();
  };

  const onDateSelect = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
    bottomSheetRef.current?.close();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Text style={styles.headerTitle}>Playslot</Text>
        <Text style={styles.headerSubtitle}>Book your game now!</Text>
      </View>

      <View style={[styles.searchSection, { backgroundColor: colors.background }]}>
        <View style={[styles.searchBar, { backgroundColor: colors.backgroundSecondary }]}>
          <Ionicons name="search" size={20} color={colors.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search location..."
            placeholderTextColor={colors.textMuted}
            value={location}
            onChangeText={setLocation}
            onSubmitEditing={fetchVenues}
          />
        </View>
        <TouchableOpacity style={[styles.filterButton, { backgroundColor: colors.backgroundSecondary }]} onPress={openFilters}>
          <Ionicons name="calendar" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categories}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryChip,
              { borderColor: colors.primary, backgroundColor: colors.background },
              selectedCategory === category.id && { backgroundColor: colors.primary },
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Ionicons
              name={category.icon as any}
              size={20}
              color={selectedCategory === category.id ? '#FFFFFF' : colors.primary}
            />
            <Text
              style={[
                styles.categoryText,
                { color: colors.primary },
                selectedCategory === category.id && { color: '#FFFFFF' },
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {selectedDate && (
        <View style={[styles.dateChip, { backgroundColor: colors.accentLight }]}>
          <Ionicons name="calendar" size={16} color={colors.primary} />
          <Text style={[styles.dateText, { color: colors.primary }]}>{selectedDate}</Text>
          <TouchableOpacity onPress={() => setSelectedDate('')}>
            <Ionicons name="close-circle" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        </View>
      )}

      <ScrollView style={styles.venueList} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 32 }} />
        ) : venues.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="search" size={64} color={colors.textMuted} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No venues found</Text>
            <Text style={[styles.emptySubtext, { color: colors.textMuted }]}>Try adjusting your filters</Text>
          </View>
        ) : (
          venues.map((venue: any) => (
            <TouchableOpacity
              key={venue._id}
              style={[styles.venueCard, { backgroundColor: colors.backgroundCard }]}
              onPress={() => router.push(`/venue/${venue._id}`)}
              activeOpacity={0.7}
            >
              <View style={[styles.venueImage, { backgroundColor: colors.accentLight }]}>
                <Ionicons name="football" size={48} color={colors.primary} />
              </View>
              <View style={styles.venueInfo}>
                <Text style={[styles.venueName, { color: colors.text }]}>{venue.name}</Text>
                <View style={styles.venueDetail}>
                  <Ionicons name="location" size={14} color={colors.textSecondary} />
                  <Text style={[styles.venueLocation, { color: colors.textSecondary }]}>{venue.location}</Text>
                </View>
                <View style={styles.venueDetail}>
                  <Ionicons name="pricetag" size={14} color={colors.textSecondary} />
                  <Text style={[styles.venuePrice, { color: colors.primary }]}>₹{venue.price_per_hour}/hour</Text>
                </View>
                <View style={styles.venueFooter}>
                  <View style={styles.rating}>
                    <Ionicons name="star" size={14} color="#FFB300" />
                    <Text style={[styles.ratingText, { color: colors.textSecondary }]}>{venue.rating || '4.5'}</Text>
                  </View>
                  <View style={styles.categoriesBadges}>
                    {venue.categories?.slice(0, 2).map((cat: string, idx: number) => (
                      <View key={idx} style={[styles.categoryBadge, { backgroundColor: colors.accentLight }]}>
                        <Text style={[styles.categoryBadgeText, { color: colors.primary }]}>{cat}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
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
  header: {
    paddingTop: 48,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#E0F7FA',
    marginTop: 4,
  },
  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categories: {
    maxHeight: 60,
  },
  categoriesContent: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    gap: 12,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  dateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 24,
    marginVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  dateText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  venueList: {
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
  },
  venueCard: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  venueImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  venueInfo: {
    flex: 1,
    marginLeft: 16,
  },
  venueName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  venueDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 4,
  },
  venueLocation: {
    fontSize: 13,
  },
  venuePrice: {
    fontSize: 14,
    fontWeight: '600',
  },
  venueFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '600',
  },
  categoriesBadges: {
    flexDirection: 'row',
    gap: 4,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontSize: 11,
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