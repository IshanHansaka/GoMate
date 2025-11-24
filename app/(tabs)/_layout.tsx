import { Feather } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { TouchableOpacity } from 'react-native';

export default function TabLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTitle: 'GoMate',
        headerRight: () => (
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/favourites')}
            style={{ marginRight: 16 }}
          >
            <Feather name="heart" size={24} color='gray' />
          </TouchableOpacity>
        ),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Feather name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="stations"
        options={{
          title: 'Stations',
          tabBarIcon: ({ color }) => (
            <Feather name="map-pin" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="incidents"
        options={{
          title: 'Incidents',
          tabBarIcon: ({ color }) => (
            <Feather name="alert-triangle" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <Feather name="user" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="station/[station_code]"
        options={{
          href: null,
          title: 'Station Details',
        }}
      />
      <Tabs.Screen
        name="favourites"
        options={{
          title: 'Favourites',
          href: null,
        }}
      />
      <Tabs.Screen
        name="journey"
        options={{
          title: 'Journey',
          href: null,
        }}
      />
      <Tabs.Screen
        name="lines"
        options={{
          title: 'Lines',
          href: null,
        }}
      />
      <Tabs.Screen
        name="nearby"
        options={{
          title: 'Nearby',
          href: null,
        }}
      />
    </Tabs>
  );
}
