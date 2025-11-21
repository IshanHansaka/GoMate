import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useDispatch, useSelector } from 'react-redux';
import {
  useGetStationInfoQuery,
  useGetStationParkingQuery,
  useGetStationPredictionsQuery,
  useGetStationTimesQuery,
} from '../../../api/wmataApiSlice';
import { getLineName } from '../../../constants/LineNames';
import { getStationName } from '../../../constants/StationNames';
import {
  BORDER_RADIUS,
  COLORS,
  SHADOWS,
  SPACING,
  TYPOGRAPHY,
} from '../../../constants/Theme';
import {
  addFavourite,
  removeFavourite,
} from '../../../features/favourites/favouritesSlice';
import { RootState } from '../../../store/store';
import {
  NextTrainInfo,
  StationInfo,
  StationParking,
  StationTime,
} from '../../../types/wmata';

const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const;

const StationScreen = () => {
  const { station_code } = useLocalSearchParams();
  const router = useRouter();
  const code = station_code as string;

  const [selectedDay, setSelectedDay] = useState<(typeof DAYS)[number]>(() => {
    const dayIndex = new Date().getDay();
    const dayMap: Record<number, (typeof DAYS)[number]> = {
      0: 'Sunday',
      1: 'Monday',
      2: 'Tuesday',
      3: 'Wednesday',
      4: 'Thursday',
      5: 'Friday',
      6: 'Saturday',
    };
    return dayMap[dayIndex];
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: infoData,
    isLoading: isInfoLoading,
    error: infoError,
    refetch: refetchInfo,
  } = useGetStationInfoQuery(code);

  const {
    data: parkingData,
    isLoading: isParkingLoading,
    error: parkingError,
    refetch: refetchParking,
  } = useGetStationParkingQuery(code);

  const {
    data: timesData,
    isLoading: isTimesLoading,
    error: timesError,
    refetch: refetchTimes,
  } = useGetStationTimesQuery(code);

  const {
    data: predictionsData,
    isLoading: isPredictionsLoading,
    error: predictionsError,
    refetch: refetchPredictions,
  } = useGetStationPredictionsQuery(code);
  // {
  //   pollingInterval: 30000, // Refresh every 30 seconds
  // }

  const isLoading =
    isInfoLoading || isParkingLoading || isTimesLoading || isPredictionsLoading;
  const error = infoError || parkingError || timesError || predictionsError;

  const dispatch = useDispatch();
  const favourites = useSelector(
    (state: RootState) => state.favourites.stationCodes
  );
  const isFavourite = favourites.includes(code);

  const toggleFavourite = () => {
    if (isFavourite) {
      dispatch(removeFavourite(code));
    } else {
      dispatch(addFavourite(code));
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    refetchInfo();
    refetchParking();
    refetchTimes();
    refetchPredictions();
    setTimeout(() => setRefreshing(false), 1000);
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading station details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Error loading station details.</Text>
      </View>
    );
  }

  const stationInfo: StationInfo = infoData;
  const parkingInfo: StationParking[] = parkingData?.StationsParking || [];
  const stationTimes: StationTime[] = timesData?.StationTimes || [];
  const predictions: NextTrainInfo[] = predictionsData?.Trains || [];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Station Info */}
      {stationInfo && (
        <View style={styles.section}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
            }}
          >
            <Text
              style={[styles.title, { flex: 1, flexShrink: 1 }]}
              numberOfLines={3}
            >
              {stationInfo.Name}
            </Text>

            <TouchableOpacity
              onPress={toggleFavourite}
              style={{ marginLeft: 12 }}
            >
              <Ionicons
                name={isFavourite ? 'heart' : 'heart-outline'}
                size={28}
                color={isFavourite ? COLORS.error : COLORS.text}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>
            {stationInfo.Address?.Street}, {stationInfo.Address?.City},{' '}
            {stationInfo.Address?.State}
          </Text>
          <View style={styles.linesContainer}>
            {[
              stationInfo.LineCode1,
              stationInfo.LineCode2,
              stationInfo.LineCode3,
              stationInfo.LineCode4,
            ]
              .filter(Boolean)
              .map((line, index) => (
                <View
                  key={index}
                  style={[
                    styles.lineBadge,
                    { backgroundColor: getLineColor(line) },
                  ]}
                >
                  <Text style={styles.lineText}>{getLineName(line)}</Text>
                </View>
              ))}
          </View>

          <TouchableOpacity
            style={styles.planTripButton}
            onPress={() => router.push(`/journey?fromStation=${code}`)}
          >
            <Ionicons name="map-outline" size={20} color={COLORS.white} />
            <Text style={styles.planTripButtonText}>Plan Trip from Here</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Enhanced Map View */}
      <View style={styles.section}>
        <Text style={styles.mapTitle}>Station Location</Text>
        <View style={styles.mapContainer}>
          <WebView
            style={styles.map}
            source={{
              html: `<iframe width="100%" height="100%" frameborder="0" style="border:0" src="https://maps.google.com/maps?q=${stationInfo.Lat},${stationInfo.Lon}&z=15&output=embed"></iframe>`,
            }}
            scrollEnabled={false}
          />
        </View>
      </View>

      {/* Parking Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Parking Information</Text>
        {parkingInfo.length > 0 ? (
          parkingInfo.map((parking, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cardTitle}>All Day Parking</Text>
              {parking.Notes && (
                <Text style={styles.note}>
                  {parking.Notes.replace(/@/g, '')}
                </Text>
              )}
              <View style={styles.row}>
                <Text style={styles.label}>Total Spots:</Text>
                <Text style={styles.value}>
                  {parking.AllDayParking.TotalCount}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Rider Cost:</Text>
                <Text style={styles.value}>
                  {parking.AllDayParking.RiderCost
                    ? `$${parking.AllDayParking.RiderCost}`
                    : 'N/A'}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Non-Rider Cost:</Text>
                <Text style={styles.value}>
                  {parking.AllDayParking.NonRiderCost
                    ? `$${parking.AllDayParking.NonRiderCost}`
                    : 'N/A'}
                </Text>
              </View>

              {/* Short Term Parking */}
              <View
                style={{
                  marginTop: 10,
                  paddingTop: 10,
                  borderTopWidth: 1,
                  borderTopColor: '#eee',
                }}
              >
                <Text style={[styles.cardTitle, { fontSize: 14 }]}>
                  Short Term Parking
                </Text>
                {parking.ShortTermParking?.Notes && (
                  <Text style={styles.note}>
                    {parking.ShortTermParking.Notes.replace(/@/g, '')}
                  </Text>
                )}
                <View style={styles.row}>
                  <Text style={styles.label}>Total Spots:</Text>
                  <Text style={styles.value}>
                    {parking.ShortTermParking?.TotalCount ?? 0}
                  </Text>
                </View>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>
            No parking information available.
          </Text>
        )}
      </View>

      {/* Next Trains */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Next Trains</Text>
        {predictions.length > 0 ? (
          predictions.map((train, index) => (
            <View key={index} style={styles.trainRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View
                  style={[
                    styles.lineBadge,
                    {
                      backgroundColor: getLineColor(train.Line),
                      marginRight: 8,
                      paddingHorizontal: 5,
                      paddingVertical: 5,
                    },
                  ]}
                ></View>
                <Text style={styles.trainDest}>
                  {train.DestinationName || train.Destination}
                </Text>
              </View>
              <Text style={[styles.trainTime, { fontWeight: 'bold' }]}>
                {train.Min === 'ARR'
                  ? 'Arriving'
                  : train.Min === 'BRD'
                  ? 'Boarding'
                  : `${train.Min} min`}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No trains arriving soon.</Text>
        )}
      </View>

      {/* Station Timings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Station Schedule</Text>

        {/* Dropdown Selector */}
        <View style={{ zIndex: 1000, marginBottom: 16 }}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 12,
              backgroundColor: '#f0f0f0',
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#ddd',
            }}
            onPress={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <Text style={{ fontSize: 16, color: '#333' }}>{selectedDay}</Text>
            <Ionicons
              name={isDropdownOpen ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#666"
            />
          </TouchableOpacity>

          {isDropdownOpen && (
            <View
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                backgroundColor: 'white',
                borderRadius: 8,
                borderWidth: 1,
                borderColor: '#ddd',
                marginTop: 4,
                elevation: 5,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                zIndex: 1001,
              }}
            >
              {DAYS.map((day) => (
                <TouchableOpacity
                  key={day}
                  style={{
                    padding: 12,
                    borderBottomWidth: day === 'Sunday' ? 0 : 1,
                    borderBottomColor: '#eee',
                    backgroundColor: day === selectedDay ? '#e6f2ff' : 'white',
                  }}
                  onPress={() => {
                    setSelectedDay(day);
                    setIsDropdownOpen(false);
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: day === selectedDay ? '#007BFF' : '#333',
                      fontWeight: day === selectedDay ? 'bold' : 'normal',
                    }}
                  >
                    {day}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {stationTimes.length > 0 ? (
          stationTimes.map((time, index) => (
            <View key={index}>
              <View style={{ marginBottom: 24 }}>
                <Text style={styles.subHeader}>Opening Time</Text>
                <Text style={styles.text}>
                  {time[selectedDay]?.OpeningTime || 'N/A'}
                </Text>

                <Text style={[styles.subHeader, { marginTop: 10 }]}>
                  First Trains
                </Text>
                {time[selectedDay]?.FirstTrains?.map((train, i) => (
                  <View key={`first-${i}`} style={styles.trainRow}>
                    <Text style={styles.trainTime}>{train.Time}</Text>
                    <Text style={styles.trainDest}>
                      to {getStationName(train.DestinationStation)}
                    </Text>
                  </View>
                ))}

                <Text style={[styles.subHeader, { marginTop: 10 }]}>
                  Last Trains
                </Text>
                {time[selectedDay]?.LastTrains?.map((train, i) => (
                  <View key={`last-${i}`} style={styles.trainRow}>
                    <Text style={styles.trainTime}>{train.Time}</Text>
                    <Text style={styles.trainDest}>
                      to {getStationName(train.DestinationStation)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>
            No schedule information available.
          </Text>
        )}
      </View>
    </ScrollView>
  );
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
      return '#333';
  }
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.xl },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: SPACING.md, color: COLORS.mediumGray },
  errorText: { color: COLORS.error, ...TYPOGRAPHY.body },

  section: {
    marginBottom: SPACING.xxl,
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.light,
  },
  title: { ...TYPOGRAPHY.h2, color: COLORS.text, marginBottom: SPACING.xs },
  subtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.mediumGray,
    marginBottom: SPACING.md,
  },

  linesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACING.md,
    gap: SPACING.sm,
  },
  planTripButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.md,
    marginTop: SPACING.lg,
    gap: SPACING.sm,
  },
  planTripButtonText: {
    color: COLORS.white,
    ...TYPOGRAPHY.body,
    fontWeight: '600',
  },
  lineBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.xl,
  },
  lineText: { ...TYPOGRAPHY.small, color: COLORS.white, fontWeight: 'bold' },

  mapTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.text,
    paddingBottom: SPACING.sm,
  },
  mapContainer: {
    height: 200,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    backgroundColor: COLORS.lightGray,
    position: 'relative',
  },
  map: { flex: 1 },

  sectionTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  card: {
    backgroundColor: COLORS.lightGray,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
  },
  cardTitle: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  note: {
    ...TYPOGRAPHY.small,
    color: COLORS.mediumGray,
    marginBottom: SPACING.sm,
    fontStyle: 'italic',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  label: { color: COLORS.mediumGray },
  value: { fontWeight: '500', color: COLORS.text },
  emptyText: { color: COLORS.mediumGray, fontStyle: 'italic' },

  subHeader: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  text: {
    ...TYPOGRAPHY.caption,
    color: COLORS.mediumGray,
    marginBottom: SPACING.xs,
  },
  trainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  trainTime: { fontWeight: 'bold', color: COLORS.text },
  trainDest: { color: COLORS.mediumGray },
});

export default StationScreen;
