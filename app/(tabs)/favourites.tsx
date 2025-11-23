import { useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { useGetStationsQuery } from '../../api/wmataApiSlice';
import StationListCard from '../../components/StationListCard';
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

  const renderItem = ({ item }: { item: StationInfo }) => (
    <StationListCard station={item} onPress={handleStationPress} />
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
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
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
