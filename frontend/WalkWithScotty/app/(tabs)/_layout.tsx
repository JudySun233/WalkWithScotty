import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { HapticTab } from '@/components/HapticTab'; // Make sure these paths are correct
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="start"
        options={{
          title: 'Start',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="dog.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings" //  This name is used for routing.
        options={{
          title: 'Settings', //  The title displayed in the tab bar.
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="gear" color={color} />, // Example icon
        }}
      />
      <Tabs.Screen
        name="login"
        options={{
          title: 'Log In',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
