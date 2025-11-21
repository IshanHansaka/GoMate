import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useGetLinesQuery } from '../../api/wmataApiSlice';
import { getStationName } from '../../constants/StationNames';
import { Line } from '../../types/wmata';

export default function LinesScreen() {
  const { data, isLoading, error } = useGetLinesQuery({});
  const [isModalVisible, setModalVisible] = useState(false);

  const lines: Line[] = data?.Lines || [];

  const getLineColor = (lineCode: string) => {
    switch (lineCode) {
      case 'RD':
        return '#D11241'; // Red
      case 'BL':
        return '#0072CE'; // Blue
      case 'OR':
        return '#D47600'; // Orange
      case 'YL':
        return '#FFD200'; // Yellow
      case 'GR':
        return '#00B140'; // Green
      case 'SV':
        return '#A0A2A0'; // Silver
      default:
        return '#333';
    }
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Loading rail lines...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Error loading rail lines.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={lines}
      keyExtractor={(item) => item.LineCode}
      ListHeaderComponent={
        <>
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>
              Washington Metro Rail Lines
            </Text>
            <Text style={styles.descriptionText}>
              The Washington Metro is the main rapid transit system connecting
              D.C. with surrounding areas in Maryland and Virginia, making
              travel across the region fast and convenient.
            </Text>
          </View>

          <Image
            source={{
              uri: 'https://www.wmata.com/schedules/maps/images/system-map-rail-effective-June-22-2025.png',
            }}
            style={styles.mapImage}
            resizeMode="contain"
          />
        </>
      }
      renderItem={({ item }) => (
        <View style={styles.card}>
          <View
            style={[
              styles.lineIndicator,
              { backgroundColor: getLineColor(item.LineCode) },
            ]}
          />
          <View style={styles.cardContent}>
            <Text style={styles.lineName}>{item.DisplayName} Line</Text>
            <View style={styles.stationsContainer}>
              <Text style={styles.stationText}>
                Start: {getStationName(item.StartStationCode)}
              </Text>
              <Text style={styles.stationText}>
                End: {getStationName(item.EndStationCode)}
              </Text>
            </View>
          </View>
        </View>
      )}
      contentContainerStyle={styles.listContent}
    />
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
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  lineIndicator: {
    width: 12,
  },
  cardContent: {
    flex: 1,
    padding: 16,
  },
  lineName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  stationsContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginTop: 8,
  },
  stationText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  descriptionContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  descriptionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  mapImage: {
    width: '100%',
    height: 450,
    marginVertical: 16,
  },
});
