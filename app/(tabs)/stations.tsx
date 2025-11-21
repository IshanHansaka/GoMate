import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useGetStationsQuery } from '../../api/wmataApiSlice';
import { LINE_NAMES } from '../../constants/LineNames';
import { StationInfo } from '../../types/wmata';

export default function HomeScreen() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [selectedLine, setSelectedLine] = useState<string | null>(null);

  const { data, isLoading, error } = useGetStationsQuery({});

  const stations: StationInfo[] = data?.Stations || [];

  const filteredStations = stations
    .filter((station) => {
      const matchesSearch = station.Name.toLowerCase().includes(
        searchText.toLowerCase()
      );
      const matchesLine = selectedLine
        ? [
            station.LineCode1,
            station.LineCode2,
            station.LineCode3,
            station.LineCode4,
          ].includes(selectedLine)
        : true;
      return matchesSearch && matchesLine;
    })
    .sort((a, b) => a.Name.localeCompare(b.Name));

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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Find a Station</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search stations..."
          value={searchText}
          onChangeText={setSearchText}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
          contentContainerStyle={styles.filtersContent}
        >
          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedLine === null && styles.filterChipActive,
            ]}
            onPress={() => setSelectedLine(null)}
          >
            <Text
              style={[
                styles.filterText,
                selectedLine === null && styles.filterTextActive,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          {Object.entries(LINE_NAMES).map(([code, name]) => (
            <TouchableOpacity
              key={code}
              style={[
                styles.filterChip,
                selectedLine === code && {
                  backgroundColor: getLineColor(code),
                  borderColor: getLineColor(code),
                },
              ]}
              onPress={() =>
                setSelectedLine(code === selectedLine ? null : code)
              }
            >
              <Text
                style={[
                  styles.filterText,
                  selectedLine === code && styles.filterTextActive,
                ]}
              >
                {name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#007BFF" />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>Error loading stations</Text>
        </View>
      ) : (
        <FlatList
          data={filteredStations}
          keyExtractor={(item) => item.Code}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyText}>No stations found</Text>
            </View>
          }
        />
      )}
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
    marginBottom: 15,
    color: '#333',
  },
  searchInput: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
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
  filtersContainer: {
    marginTop: 12,
  },
  filtersContent: {
    paddingRight: 20,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filterChipActive: {
    backgroundColor: '#333',
    borderColor: '#333',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  filterTextActive: {
    color: 'white',
  },
});
