import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { apiSlice, useGetCurrentUserQuery } from '../../api/apiSlice';
import {
  BORDER_RADIUS,
  getColors,
  SHADOWS,
  SPACING,
  TYPOGRAPHY,
} from '../../constants/Theme';
import { useTheme } from '../../context/ThemeContext';
import { logout, selectCurrentUser } from '../../features/auth/authSlice';

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const storedUser = useSelector(selectCurrentUser);
  const { data: currentUser, isLoading: userLoading } =
    useGetCurrentUserQuery();
  const user = currentUser || storedUser;
  const { setThemeMode, isDark, resetTheme } = useTheme();
  const COLORS = getColors(isDark);
  const styles = createStyles(COLORS);

  const router = useRouter();

  const handleLogout = () => {
    resetTheme();
    dispatch(logout());
    dispatch(apiSlice.util.resetApiState());
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
          <Feather name="mail" size={20} color={COLORS.mediumGray} />
          <Text style={styles.infoText}>{user?.email}</Text>
        </View>
        {user?.phone && (
          <View style={styles.infoRow}>
            <Feather name="phone" size={20} color={COLORS.mediumGray} />
            <Text style={styles.infoText}>{user.phone}</Text>
          </View>
        )}
        {user?.address && (
          <View style={styles.infoRow}>
            <Feather name="map-pin" size={20} color={COLORS.mediumGray} />
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

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <View style={styles.preferenceRow}>
          <Text style={styles.preferenceText}>Dark Mode</Text>
          <Switch
            value={isDark}
            onValueChange={(value) => setThemeMode(value ? 'dark' : 'light')}
            trackColor={{ false: COLORS.lightGray, true: COLORS.primary }}
            thumbColor={COLORS.white}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Feather name="log-out" size={20} color="white" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
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

const createStyles = (COLORS: ReturnType<typeof getColors>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.white,
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
      color: '#ffffff',
      fontWeight: '600',
      marginLeft: SPACING.sm,
    },
    section: {
      marginBottom: SPACING.xl,
    },
    sectionTitle: {
      ...TYPOGRAPHY.h4,
      color: COLORS.text,
      marginBottom: SPACING.md,
    },
    preferenceRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: COLORS.white,
      padding: SPACING.lg,
      borderRadius: BORDER_RADIUS.lg,
      ...SHADOWS.light,
    },
    preferenceText: {
      ...TYPOGRAPHY.body,
      color: COLORS.text,
    },
  });

export default ProfileScreen;
