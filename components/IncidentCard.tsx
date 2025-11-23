import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  BORDER_RADIUS,
  COLORS,
  SHADOWS,
  SPACING,
  TYPOGRAPHY,
} from '../constants/Theme';
import { RailIncident } from '../types/wmata';
import { getLineColor } from '../utils/lineColors';

interface IncidentCardProps {
  item: RailIncident;
}

const IncidentCard: React.FC<IncidentCardProps> = ({ item }) => {
  const router = useRouter();
  const lines = item.LinesAffected.split(/;[\s]?/).filter((l) => l);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push('/(tabs)/incidents')}
    >
      <View style={styles.linesRow}>
        {lines.slice(0, 4).map((line, idx) => (
          <View
            key={idx}
            style={[
              styles.lineDot,
              { backgroundColor: getLineColor(line, '#666') },
            ]}
          />
        ))}
      </View>
      <Text style={styles.type} numberOfLines={1}>
        {item.IncidentType}
      </Text>
      <Text style={styles.desc} numberOfLines={2}>
        {item.Description.replace(/https?:\/\/[^\s]+/g, '')}
      </Text>
      <Text style={styles.time} numberOfLines={1}>
        {new Date(item.DateUpdated).toLocaleTimeString()}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    width: 180,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    marginRight: SPACING.md,
    ...SHADOWS.light,
  },
  linesRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  lineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  type: {
    ...TYPOGRAPHY.caption,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  desc: {
    ...TYPOGRAPHY.small,
    color: COLORS.mediumGray,
    marginBottom: SPACING.xs,
  },
  time: {
    ...TYPOGRAPHY.caption,
    fontSize: 10,
    color: COLORS.mediumGray,
  },
});

export default IncidentCard;
