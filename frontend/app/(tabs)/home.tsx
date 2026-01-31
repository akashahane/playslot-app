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

  useEffect(() => {
    fetchVenues();
  }, [selectedCategory, selectedDate]);

  const fetchVenues = async () => {
    setLoading(true);
    try {
      const params: any = {};
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

  const onDateSelect = (day: any) => {
    setSelectedDate(day.dateString);
    bottomSheetRef.current?.close();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Playslot</Text>
        <Text style={styles.headerSubtitle}>Book your game now!</Text>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search location..."
            value={location}
            onChangeText={setLocation}
            onSubmitEditing={fetchVenues}
          />
        </View>
        <TouchableOpacity style={styles.filterButton} onPress={openFilters}>
          <Ionicons name="calendar" size={24} color="#4EC0D6" />
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
              selectedCategory === category.id && styles.categoryChipActive,
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Ionicons
              name={category.icon as any}
              size={20}
              color={selectedCategory === category.id ? '#fff' : '#4EC0D6'}
            />
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category.id && styles.categoryTextActive,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {selectedDate && (
        <View style={styles.dateChip}>
          <Ionicons name="calendar" size={16} color="#4EC0D6" />
          <Text style={styles.dateText}>{selectedDate}</Text>
          <TouchableOpacity onPress={() => setSelectedDate('')}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        </View>
      )}

      <ScrollView style={styles.venueList}>
        {loading ? (
          <ActivityIndicator size="large" color="#4EC0D6" style={{ marginTop: 32 }} />
        ) : venues.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="search" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No venues found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
          </View>
        ) : (
          venues.map((venue: any) => (
            <TouchableOpacity
              key={venue._id}
              style={styles.venueCard}
              onPress={() => router.push(`/venue/${venue._id}`)}
            >
              <View style={styles.venueImage}>
                <Ionicons name="football" size={48} color="#4EC0D6" />
              </View>
              <View style={styles.venueInfo}>
                <Text style={styles.venueName}>{venue.name}</Text>
                <View style={styles.venueDetail}>
                  <Ionicons name="location" size={14} color="#666" />
                  <Text style={styles.venueLocation}>{venue.location}</Text>
                </View>
                <View style={styles.venueDetail}>
                  <Ionicons name="pricetag" size={14} color="#666" />
                  <Text style={styles.venuePrice}>₹{venue.price_per_hour}/hour</Text>
                </View>
                <View style={styles.venueFooter}>
                  <View style={styles.rating}>
                    <Ionicons name="star" size={14} color="#FFB300" />
                    <Text style={styles.ratingText}>{venue.rating || '4.5'}</Text>
                  </View>
                  <View style={styles.categories}>
                    {venue.categories?.slice(0, 2).map((cat: string, idx: number) => (
                      <View key={idx} style={styles.categoryBadge}>
                        <Text style={styles.categoryBadgeText}>{cat}</Text>
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
  header: {
    paddingTop: 48,
    paddingHorizontal: 24,
    paddingBottom: 16,
    backgroundColor: '#4EC0D6',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#E8F5E9',
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
    backgroundColor: '#f5f5f5',
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
    backgroundColor: '#f5f5f5',
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
    borderColor: '#4EC0D6',
    gap: 6,
  },
  categoryChipActive: {
    backgroundColor: '#4EC0D6',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4EC0D6',
  },
  categoryTextActive: {
    color: '#fff',
  },
  dateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#E8F5E9',
    marginHorizontal: 24,
    marginVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  dateText: {
    flex: 1,
    fontSize: 14,
    color: '#2E7D32',
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
    color: '#999',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 8,
  },
  venueCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
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
    backgroundColor: '#E8F5E9',
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
    color: '#333',
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
    color: '#666',
  },
  venuePrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4EC0D6',
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
    color: '#666',
    fontWeight: '600',
  },
  categoryBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 4,
  },
  categoryBadgeText: {
    fontSize: 11,
    color: '#2E7D32',
    fontWeight: '600',
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