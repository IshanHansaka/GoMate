import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { useGetStationsQuery } from '../../api/wmataApiSlice';
import {
  BORDER_RADIUS,
  COLORS,
  SHADOWS,
  SPACING,
  TYPOGRAPHY,
} from '../../constants/Theme';
import { selectCurrentUser } from '../../features/auth/authSlice';
import { StationInfo } from '../../types/wmata';

const HomeScreen = () => {
  const router = useRouter();
  const user = useSelector(selectCurrentUser);
  const { data, isLoading, error } = useGetStationsQuery({});
  const stations: StationInfo[] = data?.Stations?.slice(0, 5) || [];

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
        return '#eee';
    }
  };

  const shortcuts = [
    {
      id: 'journey',
      title: 'Journey',
      icon: 'map',
      route: '/(tabs)/journey',
      color: COLORS.primary,
    },
    {
      id: 'lines',
      title: 'Lines',
      icon: 'git-network',
      route: '/(tabs)/lines',
      color: COLORS.secondary,
    },
    {
      id: 'nearby',
      title: 'Nearby',
      icon: 'location',
      route: '/(tabs)/nearby',
      color: COLORS.accent,
    },
    {
      id: 'stations',
      title: 'Stations',
      icon: 'train',
      route: '/(tabs)/stations',
      color: COLORS.primary,
    },
  ];

  const renderStationCard = ({ item }: { item: StationInfo }) => (
    <TouchableOpacity
      style={styles.stationCard}
      onPress={() =>
        router.push({
          pathname: '/(tabs)/station/[station_code]',
          params: { station_code: item.Code },
        })
      }
    >
      <View style={styles.stationHeader}>
        <View style={styles.iconContainer}>
          <Ionicons name="train-outline" size={24} color={COLORS.text} />
        </View>
        <View style={styles.linesRow}>
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
      <Text style={styles.stationName} numberOfLines={1}>
        {item.Name}
      </Text>
      <Text style={styles.stationAddress} numberOfLines={1}>
        {item.Address?.City}, {item.Address?.State}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              Hello, {user?.firstName || 'Traveler'}!
            </Text>
            <Text style={styles.subtitle}>Where are you going today?</Text>
          </View>
        </View>

        {/* Hero / Search Placeholder */}
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => router.push('/(tabs)/stations')}
        >
          <Ionicons name="search" size={20} color={COLORS.mediumGray} />
          <Text style={styles.searchText}>Search for a station...</Text>
        </TouchableOpacity>

        {/* Shortcuts Grid */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.shortcutsGrid}>
          {shortcuts.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.shortcutCard}
              onPress={() => router.push(item.route as any)}
            >
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: item.color + '20' },
                ]}
              >
                <Ionicons
                  name={item.icon as any}
                  size={24}
                  color={item.color}
                />
              </View>
              <Text style={styles.shortcutTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Featured Stations */}
        <View style={styles.stationsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Stations</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/stations')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <ActivityIndicator
              size="large"
              color={COLORS.primary}
              style={{ marginVertical: 20 }}
            />
          ) : (
            <FlatList
              data={stations}
              renderItem={renderStationCard}
              keyExtractor={(item) => item.Code}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.stationsList}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  greeting: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.mediumGray,
    marginTop: SPACING.xs,
  },
  profileButton: {
    padding: SPACING.xs,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.xxl,
    ...SHADOWS.light,
  },
  searchText: {
    marginLeft: SPACING.sm,
    color: COLORS.mediumGray,
    ...TYPOGRAPHY.body,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  shortcutsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SPACING.xxl,
  },
  shortcutCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
    marginBottom: SPACING.lg,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  shortcutTitle: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
    color: COLORS.text,
  },
  stationsSection: {
    marginBottom: SPACING.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  seeAllText: {
    color: COLORS.primary,
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
  },
  stationsList: {
    paddingRight: SPACING.xl,
  },
  stationCard: {
    backgroundColor: COLORS.white,
    width: 160,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.xl,
    marginRight: SPACING.lg,
    ...SHADOWS.medium,
  },
  stationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  iconContainer: {
    backgroundColor: COLORS.lightGray,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  linesRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
    flexWrap: 'wrap',
    maxWidth: 60,
    justifyContent: 'flex-end',
  },
  lineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  stationName: {
    ...TYPOGRAPHY.body,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  stationAddress: {
    ...TYPOGRAPHY.small,
    color: COLORS.mediumGray,
  },
});

export default HomeScreen;
