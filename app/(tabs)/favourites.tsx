import { useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useGetStationsQuery } from '../../api/wmataApiSlice';
import { RootState } from '../../store/store';
import { StationInfo } from '../../types/wmata';

export default function FavouritesScreen() {
  const router = useRouter();
  const favouriteCodes = useSelector(
    (state: RootState) => state.favourites.stationCodes
  );
  const { data, isLoading, error } = useGetStationsQuery({});

  const stations: StationInfo[] = data?.Stations || [];

  const favouriteStations = stations.filter((station) =>
    favouriteCodes.includes(station.Code)
  );

  const handleStationPress = (station: StationInfo) => {
    router.push({
      pathname: '/(tabs)/station/[station_code]',
      params: { station_code: station.Code },
    });
  };

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
        return 'transparent';
    }
  };

  const renderItem = ({ item }: { item: StationInfo }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleStationPress(item)}
    >
      <View style={styles.cardContent}>
        <Text style={styles.stationName}>{item.Name}</Text>
        <Text style={styles.stationAddress}>
          {item.Address?.Street}, {item.Address?.City}
        </Text>
        <View style={styles.linesContainer}>
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
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Error loading stations</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Favourites</Text>
      </View>

      <FlatList
        data={favouriteStations}
        keyExtractor={(item) => item.Code}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>No favourite stations yet.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  listContent: {
    padding: 15,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardContent: {
    gap: 5,
  },
  stationName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  stationAddress: {
    fontSize: 14,
    color: '#666',
  },
  linesContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 5,
  },
  lineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
  },
});