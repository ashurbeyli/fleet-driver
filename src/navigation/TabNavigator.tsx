import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform, StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING } from '../constants';
import { useConfig } from '../contexts/ConfigContext';
import DashboardScreen from '../screens/DashboardScreen/DashboardScreen';
import MenuScreen from '../screens/MenuScreen';
import BonusScreen from '../screens/BonusScreen';
import ChallengesScreen from '../screens/ChallengesScreen';
import WithdrawScreen from '../screens/WithdrawScreen';

const Tab = createBottomTabNavigator();

// Custom Withdraw Action Button Component
const WithdrawActionButton = ({ onPress }: { onPress?: (e: any) => void }) => (
  <TouchableOpacity
    style={styles.withdrawActionButton}
    onPress={onPress}
    activeOpacity={0.85}
  >
    <View style={styles.withdrawCircle}>
      <Ionicons name="wallet" size={26} color="#FFFFFF" />
    </View>
    <Text style={styles.withdrawButtonText}>Withdraw</Text>
  </TouchableOpacity>
);

const TabNavigator: React.FC = () => {
  const { features } = useConfig();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.text.tertiary,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tab.Screen
        name="Home"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons 
              name={focused ? "home" : "home-outline"} 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
      {features.bonuses && (
        <Tab.Screen
          name="Bonuses"
          component={BonusScreen}
          options={{
            tabBarIcon: ({ color, focused, size }) => (
              <Ionicons 
                name={focused ? "gift" : "gift-outline"} 
                size={size} 
                color={color} 
              />
            ),
          }}
        />
      )}
      {features.withdrawal && (
        <Tab.Screen
          name="Withdraw"
          component={WithdrawScreen}
          options={{
            tabBarButton: (props) => (
              <WithdrawActionButton onPress={props.onPress} />
            ),
            tabBarLabel: () => null, // Hide label for action button
          }}
        />
      )}
      {features.challenges && (
        <Tab.Screen
          name="Challenges"
          component={ChallengesScreen}
          options={{
            tabBarIcon: ({ color, focused, size }) => (
              <Ionicons 
                name={focused ? "trophy" : "trophy-outline"} 
                size={size} 
                color={color} 
              />
            ),
          }}
        />
      )}
      <Tab.Screen
        name="Menu"
        component={MenuScreen}
        options={{
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons 
              name={focused ? "menu" : "menu-outline"} 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    height: Platform.OS === 'ios' ? 85 : 65,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    paddingTop: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  tabBarLabel: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: TYPOGRAPHY.weights.semibold,
    marginTop: -4,
  },
  withdrawActionButton: {
    top: 2,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 1,
    paddingBottom: 8,
  },
  withdrawCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3B82F6', // Vibrant blue
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#E5E7EB', // Light gray border
    marginBottom: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  withdrawButtonText: {
    color: COLORS.text.primary,
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: TYPOGRAPHY.weights.semibold,
  },
});

export default TabNavigator;

