import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { apiSlice, useGetCurrentUserQuery } from '../../api/apiSlice';
import { useGetStationsQuery } from '../../api/wmataApiSlice';
import {
  BORDER_RADIUS,
  COLORS,
  SHADOWS,
  SPACING,
  TYPOGRAPHY,
} from '../../constants/Theme';
import { logout, selectCurrentUser } from '../../features/auth/authSlice';
import { RootState } from '../../store/store';
import { StationInfo } from '../../types/wmata';

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const storedUser = useSelector(selectCurrentUser);
  const { data: currentUser } = useGetCurrentUserQuery();
  const user = currentUser || storedUser;

  const router = useRouter();
  const favouriteCodes = useSelector(
    (state: RootState) => state.favourites.stationCodes
  );
  const { data, isLoading, error } = useGetStationsQuery({});

  const stations: StationInfo[] = data?.Stations || [];

  const favouriteStations = stations.filter((station) =>
    favouriteCodes.includes(station.Code)
  );

  const handleLogout = () => {
    dispatch(logout());
    dispatch(apiSlice.util.resetApiState());
  };

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

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          {user?.image ? (
            <Image source={{ uri: user.image }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {user?.firstName?.[0] || user?.username?.[0] || 'G'}
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.name}>
          {user?.firstName} {user?.maidenName ? user.maidenName + ' ' : ''}
          {user?.lastName}
        </Text>
        <Text style={styles.username}>@{user?.username}</Text>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <Ionicons name="mail-outline" size={20} color={COLORS.mediumGray} />
          <Text style={styles.infoText}>{user?.email}</Text>
        </View>
        {user?.phone && (
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={20} color={COLORS.mediumGray} />
            <Text style={styles.infoText}>{user.phone}</Text>
          </View>
        )}
        {user?.address && (
          <View style={styles.infoRow}>
            <Ionicons
              name="location-outline"
              size={20}
              color={COLORS.mediumGray}
            />
            <View>
              <Text style={styles.infoText}>{user.address.address}</Text>
              <Text style={styles.infoText}>
                {user.address.city}, {user.address.state}{' '}
                {user.address.postalCode}
              </Text>
            </View>
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="white" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>My Favourites</Text>
      </View>
    </View>
  );

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
      <Ionicons name="chevron-forward" size={20} color={COLORS.lightGray} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={favouriteStations}
        renderItem={renderItem}
        keyExtractor={(item) => item.Code}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator
              size="large"
              color={COLORS.primary}
              style={{ marginTop: 20 }}
            />
          ) : (
            <Text style={styles.emptyText}>No favourite stations yet.</Text>
          )
        }
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    paddingBottom: SPACING.xl,
  },
  header: {
    padding: SPACING.xl,
    backgroundColor: COLORS.white,
    marginBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  avatarContainer: {
    marginBottom: SPACING.md,
    ...SHADOWS.medium,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.lightGray,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: COLORS.white,
    ...TYPOGRAPHY.h2,
  },
  name: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
  },
  email: {
    ...TYPOGRAPHY.caption,
    color: COLORS.mediumGray,
    marginTop: SPACING.xs,
  },
  username: {
    ...TYPOGRAPHY.caption,
    color: COLORS.mediumGray,
    marginTop: SPACING.xs,
  },
  infoSection: {
    marginBottom: SPACING.xxl,
    backgroundColor: COLORS.lightGray,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
    gap: SPACING.md,
  },
  infoText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    flex: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.error,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.xl,
  },
  logoutText: {
    color: COLORS.white,
    fontWeight: '600',
    marginLeft: SPACING.sm,
  },
  sectionHeader: {
    marginTop: SPACING.md,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.text,
  },
  card: {
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    marginHorizontal: SPACING.xl,
    marginBottom: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...SHADOWS.light,
  },
  cardContent: {
    flex: 1,
  },
  stationName: {
    ...TYPOGRAPHY.body,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  stationAddress: {
    ...TYPOGRAPHY.small,
    color: COLORS.mediumGray,
    marginBottom: SPACING.sm,
  },
  linesContainer: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  lineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.mediumGray,
    marginTop: SPACING.xl,
    fontStyle: 'italic',
  },
});

export default ProfileScreen;
