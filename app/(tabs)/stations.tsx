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
import {
  BORDER_RADIUS,
  COLORS,
  SHADOWS,
  SPACING,
  TYPOGRAPHY,
} from '../../constants/Theme';
import { StationInfo } from '../../types/wmata';
import { getLineColor } from '../../utils/lineColors';

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
                  { backgroundColor: getLineColor(line, 'transparent') },
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
          <ActivityIndicator size="large" color={COLORS.primary} />
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
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.xl,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  title: {
    ...TYPOGRAPHY.h2,
    marginBottom: SPACING.lg,
    color: COLORS.text,
  },
  searchInput: {
    backgroundColor: COLORS.lightGray,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    ...TYPOGRAPHY.body,
    color: COLORS.text,
  },
  listContent: {
    padding: SPACING.lg,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.light,
  },
  cardContent: {
    gap: SPACING.xs,
  },
  stationName: {
    ...TYPOGRAPHY.h4,
    color: COLORS.text,
  },
  stationAddress: {
    ...TYPOGRAPHY.caption,
    color: COLORS.mediumGray,
  },
  linesContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.xs,
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
    padding: SPACING.xl,
  },
  errorText: {
    color: COLORS.error,
    ...TYPOGRAPHY.body,
  },
  emptyText: {
    color: COLORS.mediumGray,
    ...TYPOGRAPHY.body,
  },
  filtersContainer: {
    marginTop: SPACING.md,
  },
  filtersContent: {
    paddingRight: SPACING.xl,
  },
  filterChip: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.lightGray,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.mediumGray,
    fontWeight: '600',
  },
  filterTextActive: {
    color: COLORS.white,
  },
});
