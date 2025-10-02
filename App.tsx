import React, { useRef, useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform, View, StyleSheet } from 'react-native';
import { NavigationContainer, useNavigationState } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { ContactButton } from './src/components';

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
    <View style={styles.container}>
      <NavigationContainer ref={navigationRef} onStateChange={onStateChange}>
        <AppNavigator />
      </NavigationContainer>
      
      <StatusBar 
        style={Platform.OS === 'ios' ? 'dark' : 'auto'} 
        backgroundColor="#f8f9fa"
      />
  
      {/* Fixed Contact Button - appears on all screens except Contact */}
      {currentRoute !== 'Contact' && (
        <ContactButton onPress={handleContactPress} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
