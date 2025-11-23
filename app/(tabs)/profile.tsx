import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { apiSlice, useGetCurrentUserQuery } from '../../api/apiSlice';
import {
  BORDER_RADIUS,
  COLORS,
  SHADOWS,
  SPACING,
  TYPOGRAPHY,
} from '../../constants/Theme';
import { logout, selectCurrentUser } from '../../features/auth/authSlice';

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const storedUser = useSelector(selectCurrentUser);
  const { data: currentUser, isLoading: userLoading } =
    useGetCurrentUserQuery();
  const user = currentUser || storedUser;

  const router = useRouter();
  // Favourites moved to its own tab; remove related station fetching logic

  const handleLogout = () => {
    dispatch(logout());
    dispatch(apiSlice.util.resetApiState());
  };

  // Navigations kept minimal on profile now

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

      {/* Favourites section removed; now lives in dedicated tab */}
    </View>
  );
  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      {userLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {renderHeader()}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: SPACING.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  // Removed favourites list styles
});

export default ProfileScreen;
