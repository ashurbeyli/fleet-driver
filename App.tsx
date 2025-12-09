import React, { useRef, useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform, View, StyleSheet } from 'react-native';
import { NavigationContainer, useNavigationState } from '@react-navigation/native';
import { LinkingOptions } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { ConfigProvider } from './src/contexts/ConfigContext';
import { LanguageProvider } from './src/contexts/LanguageContext';

const linking: LinkingOptions<any> = {
  prefixes: Platform.OS === 'web' ? ['/'] : ['fleetdriver://'],
  config: {
    screens: {
      Welcome: 'welcome',
      Login: 'login',
      Otp: 'otp',
      Dashboard: {
        path: '',
        screens: {
          Home: '',
          Bonuses: 'bonuses',
          Withdraw: 'withdraw',
          Challenges: 'challenges',
          Menu: 'menu',
        },
      },
      Vehicles: 'vehicles',
      ProfileDetails: 'profile',
      Contact: 'contact',
      Agreement: 'agreement',
      InviteFriend: 'invite-friend',
      WithdrawDetails: 'withdraw/details',
      WithdrawOtp: 'withdraw/otp',
      WithdrawSuccess: 'withdraw/success',
      WithdrawError: 'withdraw/error',
      WithdrawalDetail: 'withdrawal/:withdrawalId',
    },
  },
};

export default function App() {
  const navigationRef = useRef<any>(null);
  const [currentRoute, setCurrentRoute] = useState<string>('');

  const handleContactPress = () => {
    if (navigationRef.current) {
      navigationRef.current.navigate('Contact');
    }
  };

  const onStateChange = (state: any) => {
    const routeName = getCurrentRouteName(state);
    setCurrentRoute(routeName);
  };

  const getCurrentRouteName = (state: any): string => {
    if (!state || !state.routes || state.routes.length === 0) {
      return '';
    }

    const route = state.routes[state.index];
    if (route.state) {
      return getCurrentRouteName(route.state);
    }
    return route.name;
  };

  return (
    <LanguageProvider>
      <ConfigProvider>
        <View style={styles.container}>
          <NavigationContainer 
            ref={navigationRef} 
            onStateChange={onStateChange}
            linking={Platform.OS === 'web' ? linking : undefined}
          >
            <AppNavigator />
          </NavigationContainer>
          
          <StatusBar 
            style={Platform.OS === 'ios' ? 'dark' : 'auto'} 
            backgroundColor="#f8f9fa"
          />
        </View>
      </ConfigProvider>
    </LanguageProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
