import React, { useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { ContactButton } from './src/components';

export default function App() {
  const navigationRef = useRef<any>(null);

  const handleContactPress = () => {
    if (navigationRef.current) {
      navigationRef.current.navigate('Contact');
    }
  };

  return (
    <View style={styles.container}>
      <NavigationContainer ref={navigationRef}>
        <AppNavigator />
      </NavigationContainer>
      
      {/* Fixed Contact Button - appears on all screens */}
      <ContactButton onPress={handleContactPress} />
      
      <StatusBar 
        style={Platform.OS === 'ios' ? 'dark' : 'auto'} 
        backgroundColor="#f8f9fa"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
