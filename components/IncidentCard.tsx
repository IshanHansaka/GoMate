import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';
import { LINE_NAMES } from '../constants/LineNames';
import { getColors } from '../constants/Theme';
import { useTheme } from '../context/ThemeContext';
import { RailIncident } from '../types/wmata';
import { getLineColor } from '../utils/lineColors';

interface IncidentCardProps {
  incident: RailIncident;
}

const IncidentCard: React.FC<IncidentCardProps> = ({ incident }) => {
  const { isDark } = useTheme();
  const COLORS = getColors(isDark);
  const styles = createStyles(COLORS);

  const getDisplayName = (code: string) => {
    if (LINE_NAMES[code]) {
      return LINE_NAMES[code];
    }
    return code
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const lines = incident.LinesAffected.split(/;[\s]?/).filter(
    (fn) => fn !== ''
  );

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.linesContainer}>
          {lines.length > 0 ? (
            lines.map((line, index) => (
              <View
                key={`${line}-${index}`}
                style={[
                  styles.lineBadge,
                  { backgroundColor: getLineColor(line, '#666') },
                ]}
              >
                <Text style={styles.lineText}>{getDisplayName(line)}</Text>
              </View>
            ))
          ) : (
            <View style={[styles.lineBadge, { backgroundColor: '#666' }]}>
              <Text style={styles.lineText}>System</Text>
            </View>
          )}
        </View>
        <View style={styles.typeBadge}>
          <Text style={styles.typeText}>{incident.IncidentType}</Text>
        </View>
      </View>

      <Text style={styles.description}>
        {incident.Description.split(/(https?:\/\/[^\s]+)/g).map(
          (part, index) => {
            if (part.match(/https?:\/\/[^\s]+/)) {
              return null; // Skip rendering links inline
            }
            return part;
          }
        )}
      </Text>

      {incident.Description.match(/https?:\/\/[^\s]+/g)?.map((link, index) => (
        <Text
          key={`link-${index}`}
          style={styles.link}
          onPress={() => Linking.openURL(link)}
        >
          {link}
        </Text>
      ))}

      <View style={styles.footer}>
        <Feather name="clock" size={14} color={COLORS.mediumGray} />
        <Text style={styles.dateText}>
          Updated: {new Date(incident.DateUpdated).toLocaleString()}
        </Text>
      </View>
    </View>
  );
};

const createStyles = (COLORS: ReturnType<typeof getColors>) =>
  StyleSheet.create({
    card: {
      backgroundColor: COLORS.white,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    linesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
      flex: 1,
    },
    lineBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
    },
    lineText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 12,
    },
    typeBadge: {
      backgroundColor: COLORS.accent + '30',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: COLORS.accent + '50',
    },
    typeText: {
      color: COLORS.accent,
      fontSize: 12,
      fontWeight: '600',
    },
    description: {
      fontSize: 16,
      color: COLORS.text,
      lineHeight: 22,
      marginBottom: 12,
    },
    link: {
      color: COLORS.primary,
      textDecorationLine: 'underline',
    },
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderTopWidth: 1,
      borderTopColor: COLORS.border,
      paddingTop: 12,
    },
    dateText: {
      fontSize: 12,
      color: COLORS.mediumGray,
      marginLeft: 6,
    },
  });

export default IncidentCard;
