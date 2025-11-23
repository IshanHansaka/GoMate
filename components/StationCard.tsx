import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  BORDER_RADIUS,
  SHADOWS,
  SPACING,
  TYPOGRAPHY,
  getColors,
} from '../constants/Theme';
import { useTheme } from '../context/ThemeContext';
import { StationInfo } from '../types/wmata';
import { getLineColor } from '../utils/lineColors';

interface StationCardProps {
  item: StationInfo;
}

const StationCard: React.FC<StationCardProps> = ({ item }) => {
  const { isDark } = useTheme();
  const COLORS = getColors(isDark);
  const styles = createStyles(COLORS);
  const router = useRouter();

  return (
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
};

const createStyles = (COLORS: ReturnType<typeof getColors>) =>
  StyleSheet.create({
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
      marginRight: SPACING.sm,
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

export default StationCard;
