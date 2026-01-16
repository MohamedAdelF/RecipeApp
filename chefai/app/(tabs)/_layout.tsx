import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
          borderTopWidth: 1,
          borderTopColor: 'rgba(0,0,0,0.05)',
          height: 85,
          backgroundColor: 'transparent',
        },
        tabBarBackground: () => (
          <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />
        ),
        tabBarActiveTintColor: '#f2330d',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600', marginBottom: 5 },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name="home" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="pantry"
        options={{
          title: 'Pantry',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="kitchen" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="shopping-list"
        options={{
          title: 'Shop',
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name="shopping-cart" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="person" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}