import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

// You can explore the built-in useColorScheme hook
// import { useColorScheme } from '@/components/useColorScheme';

export default function TabLayout() {
  // const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        // tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        // You can uncomment the line above to use your theme colors
        headerShown: true,
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
        name="favourites"
        options={{
          title: 'Favourites',
          tabBarIcon: ({ color }) => (
            <Feather name="heart" size={24} color={color} />
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
        name="incidents"
        options={{
          title: 'Incidents',
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
