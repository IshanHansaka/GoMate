import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { useGetStationsQuery } from '../../api/wmataApiSlice';
import { selectCurrentUser } from '../../features/auth/authSlice';
import { StationInfo } from '../../types/wmata';

const HomeScreen = () => {
  const router = useRouter();
  const user = useSelector(selectCurrentUser);
  const { data, isLoading, error } = useGetStationsQuery({});
  const stations: StationInfo[] = data?.Stations?.slice(0, 5) || [];

  const getLineColor = (lineCode: string | null) => {
    switch (lineCode) {
      case 'RD':
        return '#D11241';
      case 'BL':
        return '#0072CE';
      case 'YL':
        return '#FFD100';
      case 'OR':
        return '#D45D00';
      case 'GR':
        return '#00B140';
      case 'SV':
        return '#919D9D';
      default:
        return '#eee';
    }
  };

  const shortcuts = [
    {
      id: 'journey',
      title: 'Journey',
      icon: 'map',
      route: '/(tabs)/journey',
      color: '#007BFF',
    },
    {
      id: 'lines',
      title: 'Lines',
      icon: 'git-network',
      route: '/(tabs)/lines',
      color: '#28A745',
    },
    {
      id: 'nearby',
      title: 'Nearby',
      icon: 'location',
      route: '/(tabs)/nearby',
      color: '#FFC107',
    },
    {
      id: 'stations',
      title: 'Stations',
      icon: 'train',
      route: '/(tabs)/stations',
      color: '#6F42C1',
    },
  ];

  const renderStationCard = ({ item }: { item: StationInfo }) => (
    <TouchableOpacity
      style={styles.stationCard}
      onPress={() =>
        router.push({
          pathname: '/(tabs)/station/[station_code]',
          params: { station_code: item.Code },
        })
      }
    >
      <View style={styles.stationHeader}>
        <View style={styles.iconContainer}>
          <Ionicons name="train-outline" size={24} color="#333" />
        </View>
        <View style={styles.linesRow}>
          {[item.LineCode1, item.LineCode2, item.LineCode3, item.LineCode4]
            .filter(Boolean)
            .map((line, index) => (
              <View
                key={index}
                style={[
                  styles.lineDot,
                  { backgroundColor: getLineColor(line) },
                ]}
              />
            ))}
        </View>
      </View>
      <Text style={styles.stationName} numberOfLines={1}>
        {item.Name}
      </Text>
      <Text style={styles.stationAddress} numberOfLines={1}>
        {item.Address?.City}, {item.Address?.State}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              Hello, {user?.firstName || 'Traveler'}!
            </Text>
            <Text style={styles.subtitle}>Where are you going today?</Text>
          </View>
        </View>

        {/* Hero / Search Placeholder */}
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => router.push('/(tabs)/stations')}
        >
          <Ionicons name="search" size={20} color="#666" />
          <Text style={styles.searchText}>Search for a station...</Text>
        </TouchableOpacity>

        {/* Shortcuts Grid */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.shortcutsGrid}>
          {shortcuts.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.shortcutCard}
              onPress={() => router.push(item.route as any)}
            >
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: item.color + '20' },
                ]}
              >
                <Ionicons
                  name={item.icon as any}
                  size={24}
                  color={item.color}
                />
              </View>
              <Text style={styles.shortcutTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Featured Stations */}
        <View style={styles.stationsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Stations</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/stations')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <ActivityIndicator
              size="large"
              color="#007BFF"
              style={{ marginVertical: 20 }}
            />
          ) : (
            <FlatList
              data={stations}
              renderItem={renderStationCard}
              keyExtractor={(item) => item.Code}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.stationsList}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  profileButton: {
    padding: 4,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchText: {
    marginLeft: 10,
    color: '#999',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  shortcutsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  shortcutCard: {
    width: '48%',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  shortcutTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  stationsSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seeAllText: {
    color: '#007BFF',
    fontSize: 14,
    fontWeight: '600',
  },
  stationsList: {
    paddingRight: 20,
  },
  stationCard: {
    backgroundColor: 'white',
    width: 160,
    padding: 16,
    borderRadius: 16,
    marginRight: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  stationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconContainer: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 8,
  },
  linesRow: {
    flexDirection: 'row',
    gap: 4,
    flexWrap: 'wrap',
    maxWidth: 60,
    justifyContent: 'flex-end',
  },
  lineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  stationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  stationAddress: {
    fontSize: 12,
    color: '#666',
  },
});

export default HomeScreen;
