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
import { getStationName } from '../../constants/StationNames';
import { StationEntrance } from '../../types/wmata';

export default function NearbyScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [radius, setRadius] = useState('1');
  const [searchParams, setSearchParams] = useState<{
    lat: number;
    lon: number;
    radius: number;
  } | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [manualLat, setManualLat] = useState('38.8978'); // Default to Metro Center DC
  const [manualLon, setManualLon] = useState('-77.0282'); // Default to Metro Center DC
  const [isManualMode, setIsManualMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      } catch (error) {
        setErrorMsg(
          'Location request failed due to unsatisfied device settings.'
        );
      }
    })();
  }, []);

  const handleSearch = () => {
    if ((location || isManualMode) && radius) {
      setIsSearching(true);
      setSearchParams({
        lat: isManualMode
          ? parseFloat(manualLat)
          : location?.coords.latitude || 0,
        lon: isManualMode
          ? parseFloat(manualLon)
          : location?.coords.longitude || 0,
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
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setErrorMsg(null);
            setLocation(null);
            // Show loading spinner and message
            setTimeout(() => {
              (async () => {
                try {
                  let { status } =
                    await Location.requestForegroundPermissionsAsync();
                  if (status !== 'granted') {
                    setErrorMsg('Permission to access location was denied');
                    return;
                  }

                  let location = await Location.getCurrentPositionAsync({});
                  setLocation(location);
                } catch (error) {
                  setErrorMsg(
                    'Location request failed due to unsatisfied device settings. Please enable GPS.'
                  );
                }
              })();
            }, 500); // Simulate a short delay for better UX
          }}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.retryButton, { marginTop: 10 }]}
          onPress={() => {
            setIsManualMode(true);
            setErrorMsg(null);
            setLocation(null);
          }}
        >
          <Text style={styles.retryText}>Use Manual Location</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!location && !isManualMode) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Getting your location...</Text>
        <TouchableOpacity
          style={[styles.retryButton, { marginTop: 20 }]}
          onPress={() => setIsManualMode(true)}
        >
          <Text style={styles.retryText}>Use Manual Location</Text>
        </TouchableOpacity>
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

        <TouchableOpacity
          style={styles.manualModeButton}
          onPress={() => setIsManualMode(!isManualMode)}
        >
          <Text style={styles.manualModeText}>
            {isManualMode ? 'Use GPS Location' : 'Use Manual Location'}
          </Text>
        </TouchableOpacity>

        {isManualMode && (
          <View style={styles.manualInputContainer}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={manualLat}
              onChangeText={setManualLat}
              keyboardType="numeric"
              placeholder="Latitude"
              placeholderTextColor="#999"
            />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={manualLon}
              onChangeText={setManualLon}
              keyboardType="numeric"
              placeholder="Longitude"
              placeholderTextColor="#999"
            />
          </View>
        )}
        {isManualMode && (
          <Text style={styles.manualHint}>
            Default: Metro Center DC (38.8978, -77.0282)
          </Text>
        )}
      </View>

      {isLoading || isSearching ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#007BFF" />
          <Text style={styles.loadingText}>Finding nearby stations...</Text>
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
                  <Text style={styles.stationName}>
                    {getStationName(item.StationCode1)}
                  </Text>
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
    color: '#ff0000ff',
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
  manualModeButton: {
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  manualModeText: {
    color: '#007BFF',
    fontSize: 14,
    fontWeight: '600',
  },
  manualInputContainer: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 10,
  },
  manualHint: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
});
