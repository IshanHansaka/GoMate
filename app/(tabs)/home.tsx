import { Feather } from '@expo/vector-icons';
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
import StationCard from '../../components/StationCard';
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
      icon: 'git-commit',
      route: '/(tabs)/lines',
      color: COLORS.secondary,
    },
    {
      id: 'nearby',
      title: 'Nearby',
      icon: 'compass',
      route: '/(tabs)/nearby',
      color: COLORS.accent,
    },
    {
      id: 'incidents',
      title: 'Incidents',
      icon: 'alert-triangle',
      route: '/(tabs)/incidents',
      color: COLORS.error,
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
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
          <Feather name="search" size={20} color={COLORS.mediumGray} />
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
                <Feather name={item.icon as any} size={24} color={item.color} />
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
              renderItem={({ item }) => <StationCard item={item} />}
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
    margin: 0,
    flexGrow: 1,
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
    marginBottom: SPACING.md,
  },
});

export default HomeScreen;
