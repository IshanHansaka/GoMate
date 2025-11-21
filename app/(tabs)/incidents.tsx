import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Linking,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useGetRailIncidentsQuery } from '../../api/wmataApiSlice';
import { LINE_NAMES } from '../../constants/LineNames';
import { RailIncident } from '../../types/wmata';

export default function IncidentsScreen() {
  const { data, isLoading, error, refetch } = useGetRailIncidentsQuery({});

  const incidents: RailIncident[] = data?.Incidents || [];

  const getLineColor = (lineCode: string) => {
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
        return '#666';
    }
  };

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

  const renderItem = ({ item }: { item: RailIncident }) => {
    const lines = item.LinesAffected.split(/;[\s]?/).filter((fn) => fn !== '');

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
                    { backgroundColor: getLineColor(line) },
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
            <Text style={styles.typeText}>{item.IncidentType}</Text>
          </View>
        </View>

        <Text style={styles.description}>
          {item.Description.split(/(https?:\/\/[^\s]+)/g).map((part, index) => {
            if (part.match(/https?:\/\/[^\s]+/)) {
              return null; // Skip rendering links inline
            }
            return part;
          })}
        </Text>

        {item.Description.match(/https?:\/\/[^\s]+/g)?.map((link, index) => (
          <Text
            key={`link-${index}`}
            style={styles.link}
            onPress={() => Linking.openURL(link)}
          >
            {link}
          </Text>
        ))}

        <View style={styles.footer}>
          <Ionicons name="time-outline" size={14} color="#666" />
          <Text style={styles.dateText}>
            Updated: {new Date(item.DateUpdated).toLocaleString()}
          </Text>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Error loading incidents</Text>
        <Text style={styles.retryText} onPress={() => refetch()}>
          Tap to retry
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={incidents}
        keyExtractor={(item, index) => `${item.IncidentID}-${index}`}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
        ListEmptyComponent={
          <View style={styles.center}>
            <Ionicons name="checkmark-circle-outline" size={64} color="green" />
            <Text style={styles.emptyText}>No active incidents reported.</Text>
            <Text style={styles.subEmptyText}>
              Service is running normally.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
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
    backgroundColor: '#FFF3CD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#FFEEBA',
  },
  typeText: {
    color: '#856404',
    fontSize: 12,
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
    marginBottom: 12,
  },
  link: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  dateText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 6,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 8,
  },
  retryText: {
    color: '#007BFF',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  subEmptyText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
});
