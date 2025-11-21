import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useGetStationEntrancesQuery } from '../../api/wmataApiSlice';
import { StationEntrance } from '../../types/wmata';

export default function HomeScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [radius, setRadius] = useState('10');
  const [searchParams, setSearchParams] = useState<{
    lat: number;
    lon: number;
    radius: number;
  } | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const handleSearch = () => {
    if (location && radius) {
      setIsSearching(true);
      setSearchParams({
        lat: location.coords.latitude,
        lon: location.coords.longitude,
        radius: parseFloat(radius) * 1000, // Convert km to meters
      });
      setTimeout(() => setIsSearching(false), 1000); // Simulate a delay for better UX
    }
  };

  const { data, isLoading, error, refetch } = useGetStationEntrancesQuery(
    searchParams || { lat: 0, lon: 0, radius: 0 },
    { skip: !searchParams }
  );

  const entrances: StationEntrance[] = data?.Entrances || [];

  // Filter unique stations based on StationCode1
  const uniqueStations = entrances.reduce((acc, current) => {
    const x = acc.find((item) => item.StationCode1 === current.StationCode1);
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, [] as StationEntrance[]);

  const handleStationPress = (stationCode: string) => {
    router.push(`/station/${stationCode}`);
  };

  if (errorMsg) {
    return (
      <View style={styles.center}>
        <Ionicons name="location-outline" size={64} color="red" />
        <Text style={styles.errorText}>{errorMsg}</Text>
        <Text style={styles.subErrorText}>
          Please enable location services to find nearby stations.
        </Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Getting your location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Nearby Stations</Text>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            value={radius}
            onChangeText={setRadius}
            keyboardType="numeric"
            placeholder="Radius (km)"
            placeholderTextColor="#999"
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>
      </View>

      {isLoading || isSearching ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#007BFF" />
          <Text style={styles.loadingText}>
            {isSearching
              ? 'Searching for stations...'
              : 'Finding nearby stations...'}
          </Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>Error loading nearby stations.</Text>
          <TouchableOpacity onPress={refetch} style={styles.retryButton}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={uniqueStations}
          keyExtractor={(item) => item.ID}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => handleStationPress(item.StationCode1)}
            >
              <View style={styles.cardContent}>
                <View style={styles.iconContainer}>
                  <Ionicons name="train-outline" size={24} color="#007BFF" />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.stationName}>{item.Name}</Text>
                  <Text style={styles.distance}>{item.Description}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#ccc" />
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyText}>
                {searchParams
                  ? 'No stations found nearby.'
                  : 'Enter a radius and search to find stations.'}
              </Text>
            </View>
          }
        />
      )}

      {isSearching && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#007BFF" />
          <Text style={styles.loadingText}>Searching nearby stations...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e6f2ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  stationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  distance: {
    fontSize: 12,
    color: '#666',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginBottom: 8,
  },
  subErrorText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#007BFF',
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  searchContainer: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: '#333',
  },
  searchButton: {
    backgroundColor: '#007BFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});
