import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';

export default function App() {
  const handleLoginSuccess = () => {
    // TODO: Navigate to main dashboard
    console.log('Login successful!');
  };

  return (
    <>
      <LoginScreen onLoginSuccess={handleLoginSuccess} />
      <StatusBar 
        style={Platform.OS === 'ios' ? 'dark' : 'auto'} 
        backgroundColor="#f8f9fa"
      />
    </>
  );
}
