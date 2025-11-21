import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useGetStationToStationInfoQuery } from '../../api/wmataApiSlice';
import { STATION_NAMES } from '../../constants/StationNames';
import { StationToStationInfo } from '../../types/wmata';

export default function JourneyScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [fromStation, setFromStation] = useState<string | null>(null);
  const [toStation, setToStation] = useState<string | null>(null);
  const [isFromModalVisible, setFromModalVisible] = useState(false);
  const [isToModalVisible, setToModalVisible] = useState(false);
  const [shouldFetch, setShouldFetch] = useState(false);

  useEffect(() => {
    if (params.fromStation) {
      setFromStation(params.fromStation as string);
    }
  }, [params.fromStation]);

  const { data, isLoading, error } = useGetStationToStationInfoQuery(
    { fromStation, toStation },
    { skip: !shouldFetch || !fromStation || !toStation }
  );

  const journeyInfo: StationToStationInfo | null =
    data?.StationToStationInfos?.[0] || null;

  const handleSearch = () => {
    if (fromStation && toStation) {
      setShouldFetch(true);
    }
  };

  const isPeakTime = () => {
    const now = new Date();
    const day = now.getDay(); // 0 = Sun, 6 = Sat
    const hour = now.getHours();
    const minute = now.getMinutes();

    // Weekend
    if (day === 0 || day === 6) return false;

    // Weekday: Open - 9:30 PM (21:30) is Peak
    if (hour < 21) return true;
    if (hour === 21 && minute < 30) return true;

    return false;
  };

  const isPeak = isPeakTime();

  const stationList = Object.entries(STATION_NAMES)
    .map(([code, name]) => ({ code, name }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const renderStationModal = (
    visible: boolean,
    setVisible: (v: boolean) => void,
    onSelect: (code: string) => void,
    excludeCode?: string | null
  ) => {
    const filteredStations = stationList.filter(
      (item) => item.code !== excludeCode
    );

    return (
      <Modal visible={visible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Station</Text>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={filteredStations}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.stationItem}
                onPress={() => {
                  onSelect(item.code);
                  setVisible(false);
                  setShouldFetch(false); // Reset search on change
                }}
              >
                <Text style={styles.stationItemText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Trip Planner</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>From:</Text>
        <TouchableOpacity
          style={styles.selector}
          onPress={() => setFromModalVisible(true)}
        >
          <Text style={styles.selectorText}>
            {fromStation ? STATION_NAMES[fromStation] : 'Select Origin'}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#666" />
        </TouchableOpacity>

        <Text style={styles.label}>To:</Text>
        <TouchableOpacity
          style={styles.selector}
          onPress={() => setToModalVisible(true)}
        >
          <Text style={styles.selectorText}>
            {toStation ? STATION_NAMES[toStation] : 'Select Destination'}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.searchButton,
            (!fromStation || !toStation || isLoading) && styles.disabledButton,
          ]}
          onPress={handleSearch}
          disabled={!fromStation || !toStation || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.searchButtonText}>Find Trip Details</Text>
          )}
        </TouchableOpacity>
      </View>

      {isLoading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#007BFF" />
          <Text style={styles.loadingText}>Calculating trip...</Text>
        </View>
      )}

      {error && (
        <View style={styles.center}>
          <Text style={styles.errorText}>Error calculating trip details.</Text>
        </View>
      )}

      {journeyInfo && !isLoading && (
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>Trip Details</Text>

          <View style={styles.resultRow}>
            <Ionicons name="time-outline" size={24} color="#007BFF" />
            <View style={styles.resultTextContainer}>
              <Text style={styles.resultLabel}>Estimated Time</Text>
              <Text style={styles.resultValue}>{journeyInfo.RailTime} min</Text>
            </View>
          </View>

          <View style={styles.resultRow}>
            <Ionicons name="map-outline" size={24} color="#007BFF" />
            <View style={styles.resultTextContainer}>
              <Text style={styles.resultLabel}>Distance</Text>
              <Text style={styles.resultValue}>
                {journeyInfo.CompositeMiles} miles
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.fareTitle}>Fares</Text>

          <View style={styles.fareRow}>
            <Text style={styles.fareLabel}>
              Current Rate ({isPeak ? 'Peak' : 'Off-Peak'})
            </Text>
            <Text style={styles.fareValue}>
              $
              {isPeak
                ? journeyInfo.RailFare.PeakTime
                : journeyInfo.RailFare.OffPeakTime}
            </Text>
          </View>

          <View style={styles.fareRow}>
            <Text style={styles.fareLabelSub}>Senior/Disabled</Text>
            <Text style={styles.fareValueSub}>
              ${journeyInfo.RailFare.SeniorDisabled}
            </Text>
          </View>

          <View style={styles.fareRow}>
            <Text style={styles.fareLabelSub}>
              {isPeak ? 'Off-Peak' : 'Peak'} (Alternative)
            </Text>
            <Text style={styles.fareValueSub}>
              $
              {isPeak
                ? journeyInfo.RailFare.OffPeakTime
                : journeyInfo.RailFare.PeakTime}
            </Text>
          </View>
        </View>
      )}

      {renderStationModal(
        isFromModalVisible,
        setFromModalVisible,
        setFromStation,
        toStation
      )}
      {renderStationModal(
        isToModalVisible,
        setToModalVisible,
        setToStation,
        fromStation
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  inputContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  selector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  selectorText: {
    fontSize: 16,
    color: '#333',
  },
  searchButton: {
    backgroundColor: '#007BFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  searchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  center: {
    alignItems: 'center',
    marginTop: 20,
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  resultCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultTextContainer: {
    marginLeft: 12,
  },
  resultLabel: {
    fontSize: 14,
    color: '#666',
  },
  resultValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 16,
  },
  fareTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  fareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  fareLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  fareValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  fareLabelSub: {
    fontSize: 14,
    color: '#666',
  },
  fareValueSub: {
    fontSize: 14,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 50,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  stationItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  stationItemText: {
    fontSize: 16,
    color: '#333',
  },
});
