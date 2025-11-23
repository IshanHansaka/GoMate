import { Feather } from '@expo/vector-icons';
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

interface StationListCardProps {
  station: StationInfo;
  onPress: (station: StationInfo) => void;
}

const StationListCard: React.FC<StationListCardProps> = ({
  station,
  onPress,
}) => {
  const { isDark } = useTheme();
  const COLORS = getColors(isDark);
  const styles = createStyles(COLORS);

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(station)}>
      <View style={styles.cardContent}>
        <View style={styles.infoContainer}>
          <Text style={styles.stationName}>{station.Name}</Text>
          <Text style={styles.stationAddress}>
            {station.Address?.Street}, {station.Address?.City}
          </Text>
          <View style={styles.linesContainer}>
            {[
              station.LineCode1,
              station.LineCode2,
              station.LineCode3,
              station.LineCode4,
            ]
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
        <Feather name="chevron-right" size={24} color={COLORS.mediumGray} />
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (COLORS: ReturnType<typeof getColors>) =>
  StyleSheet.create({
    card: {
      backgroundColor: COLORS.white,
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.lg,
      marginBottom: SPACING.md,
      ...SHADOWS.light,
    },
    cardContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    infoContainer: {
      flex: 1,
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
  });

export default StationListCard;
