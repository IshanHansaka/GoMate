import { Feather } from '@expo/vector-icons';
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
import {
  BORDER_RADIUS,
  getColors,
  SHADOWS,
  SPACING,
  TYPOGRAPHY,
} from '../../constants/Theme';
import { useTheme } from '../../context/ThemeContext';
import { StationToStationInfo } from '../../types/wmata';

export default function JourneyScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { isDark } = useTheme();
  const COLORS = getColors(isDark);
  const styles = createStyles(COLORS);
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
              <Feather name="x" size={24} color={COLORS.text} />
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
          <Feather name="arrow-left" size={24} color={COLORS.text} />
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
          <Feather name="chevron-down" size={20} color={COLORS.mediumGray} />
        </TouchableOpacity>

        <Text style={styles.label}>To:</Text>
        <TouchableOpacity
          style={styles.selector}
          onPress={() => setToModalVisible(true)}
        >
          <Text style={styles.selectorText}>
            {toStation ? STATION_NAMES[toStation] : 'Select Destination'}
          </Text>
          <Feather name="chevron-down" size={20} color={COLORS.mediumGray} />
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
          <ActivityIndicator size="large" color={COLORS.primary} />
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
            <Feather name="clock" size={24} color={COLORS.primary} />
            <View style={styles.resultTextContainer}>
              <Text style={styles.resultLabel}>Estimated Time</Text>
              <Text style={styles.resultValue}>{journeyInfo.RailTime} min</Text>
            </View>
          </View>

          <View style={styles.resultRow}>
            <Feather name="map" size={24} color={COLORS.primary} />
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

const createStyles = (COLORS: ReturnType<typeof getColors>) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      backgroundColor: COLORS.background,
      padding: SPACING.xl,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: SPACING.xl,
      marginTop: SPACING.xl,
    },
    backButton: {
      marginRight: SPACING.lg,
    },
    title: {
      ...TYPOGRAPHY.h2,
      color: COLORS.text,
    },
    inputContainer: {
      backgroundColor: COLORS.white,
      padding: SPACING.xl,
      borderRadius: BORDER_RADIUS.lg,
      marginBottom: SPACING.xl,
      ...SHADOWS.light,
    },
    label: {
      ...TYPOGRAPHY.body,
      fontWeight: '600',
      color: COLORS.text,
      marginBottom: SPACING.sm,
    },
    selector: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: COLORS.lightGray,
      padding: SPACING.md,
      borderRadius: BORDER_RADIUS.md,
      borderColor: COLORS.mediumGray,
      marginBottom: SPACING.lg,
    },
    selectorText: {
      ...TYPOGRAPHY.body,
      color: COLORS.text,
    },
    searchButton: {
      backgroundColor: COLORS.primary,
      padding: SPACING.lg,
      borderRadius: BORDER_RADIUS.md,
      alignItems: 'center',
      marginTop: SPACING.sm,
    },
    disabledButton: {
      backgroundColor: COLORS.primary,
    },
    searchButtonText: {
      color: '#ffffff',
      ...TYPOGRAPHY.body,
      fontWeight: 'bold',
    },
    center: {
      alignItems: 'center',
      marginTop: SPACING.xl,
    },
    loadingText: {
      marginTop: SPACING.md,
      color: COLORS.mediumGray,
    },
    errorText: {
      color: COLORS.error,
      ...TYPOGRAPHY.body,
    },
    resultCard: {
      backgroundColor: COLORS.white,
      padding: SPACING.xl,
      borderRadius: BORDER_RADIUS.lg,
      ...SHADOWS.medium,
    },
    resultTitle: {
      ...TYPOGRAPHY.h3,
      color: COLORS.text,
      marginBottom: SPACING.lg,
    },
    resultRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: SPACING.lg,
    },
    resultTextContainer: {
      marginLeft: SPACING.md,
    },
    resultLabel: {
      ...TYPOGRAPHY.caption,
      color: COLORS.mediumGray,
    },
    resultValue: {
      ...TYPOGRAPHY.h4,
      color: COLORS.text,
    },
    divider: {
      height: 1,
      backgroundColor: COLORS.lightGray,
      marginVertical: SPACING.lg,
    },
    fareTitle: {
      ...TYPOGRAPHY.h4,
      color: COLORS.text,
      marginBottom: SPACING.md,
    },
    fareRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: SPACING.sm,
    },
    fareLabel: {
      ...TYPOGRAPHY.body,
      fontWeight: '600',
      color: COLORS.text,
    },
    fareValue: {
      ...TYPOGRAPHY.h4,
      color: COLORS.primary,
    },
    fareLabelSub: {
      ...TYPOGRAPHY.caption,
      color: COLORS.mediumGray,
    },
    fareValueSub: {
      ...TYPOGRAPHY.caption,
      color: COLORS.mediumGray,
    },
    modalContainer: {
      flex: 1,
      backgroundColor: COLORS.white,
      paddingTop: 50,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: SPACING.xl,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.lightGray,
    },
    modalTitle: {
      color: COLORS.text,
      ...TYPOGRAPHY.h3,
    },
    stationItem: {
      padding: SPACING.lg,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.lightGray,
    },
    stationItemText: {
      ...TYPOGRAPHY.body,
      color: COLORS.text,
    },
  });
