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
          <Ionicons name="mail-outline" size={20} color="#666" />
          <Text style={styles.infoText}>{user?.email}</Text>
        </View>
        {user?.phone && (
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={20} color="#666" />
            <Text style={styles.infoText}>{user.phone}</Text>
          </View>
        )}
        {user?.address && (
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={20} color="#666" />
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
      <Ionicons name="chevron-forward" size={20} color="#ccc" />
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
              color="#007BFF"
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
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    paddingBottom: 20,
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  username: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
  infoSection: {
    marginBottom: 24,
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#444',
    flex: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF3B30',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  logoutText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
  },
  sectionHeader: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  card: {
    backgroundColor: 'white',
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardContent: {
    flex: 1,
  },
  stationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  stationAddress: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  linesContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  lineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
    fontStyle: 'italic',
  },
});

export default ProfileScreen;
