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
import {
  BORDER_RADIUS,
  COLORS,
  SHADOWS,
  SPACING,
  TYPOGRAPHY,
} from '../../constants/Theme';
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
        <ActivityIndicator size="large" color={COLORS.primary} />
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
    backgroundColor: COLORS.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  loadingText: {
    marginTop: SPACING.md,
    ...TYPOGRAPHY.body,
    color: COLORS.mediumGray,
  },
  errorText: {
    ...TYPOGRAPHY.body,
    color: COLORS.error,
  },
  listContent: {
    padding: SPACING.lg,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    flexDirection: 'row',
    overflow: 'hidden',
    ...SHADOWS.light,
  },
  lineIndicator: {
    width: 6,
  },
  cardContent: {
    flex: 1,
    padding: SPACING.lg,
  },
  lineName: {
    ...TYPOGRAPHY.h4,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  stationsContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginTop: SPACING.sm,
  },
  stationText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.mediumGray,
    marginBottom: SPACING.xs,
  },
  descriptionContainer: {
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  descriptionTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  descriptionText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.mediumGray,
    marginBottom: SPACING.xs,
  },
  mapImage: {
    width: '100%',
    height: 450,
    marginVertical: SPACING.lg,
  },
});
