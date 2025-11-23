import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGetRailIncidentsQuery } from '../../api/wmataApiSlice';
import IncidentCard from '../../components/IncidentCard';
import { RailIncident } from '../../types/wmata';

export default function IncidentsScreen() {
  const { data, isLoading, error, refetch } = useGetRailIncidentsQuery({});

  const incidents: RailIncident[] = data?.Incidents || [];

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
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <FlatList
        data={incidents}
        keyExtractor={(item, index) => `${item.IncidentID}-${index}`}
        renderItem={({ item }) => <IncidentCard incident={item} />}
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
