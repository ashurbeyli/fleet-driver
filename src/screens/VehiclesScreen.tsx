import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Header, Input, Button } from '../components';
import { COLORS, TYPOGRAPHY, SPACING, DESIGN } from '../constants';
import { RootStackParamList } from '../types';
import { vehiclesApi, Vehicle, SearchVehicle } from '../api';

type VehiclesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Vehicles'>;

const VehiclesScreen: React.FC = () => {
  const navigation = useNavigation<VehiclesScreenNavigationProp>();
  const [userVehicle, setUserVehicle] = useState<Vehicle | null>(null);
  const [searchedVehicle, setSearchedVehicle] = useState<SearchVehicle | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [searchPlate, setSearchPlate] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [showSearchArea, setShowSearchArea] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [newVehicle, setNewVehicle] = useState({
    brand: '',
    model: '',
    year: '',
    licensePlateNumber: '',
  });

  useEffect(() => {
    loadVehicle();
  }, []);

  const loadVehicle = async () => {
    try {
      setIsLoading(true);
      setError('');
      const vehicleData = await vehiclesApi.getVehicle();
      setUserVehicle(vehicleData);
    } catch (error) {
      console.error('Failed to load vehicle:', error);
      setError('Failed to load vehicle information. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchByPlate = async () => {
    if (!searchPlate.trim()) {
      Alert.alert('Error', 'Please enter a license plate number to search.');
      return;
    }

    try {
      setIsSearching(true);
      setError('');
      setShowAddForm(false);
      setSearchedVehicle(null);
      
      const foundVehicle = await vehiclesApi.searchVehicleByPlate(searchPlate.trim());
      setSearchedVehicle(foundVehicle);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchedVehicle(null);
      setError('Vehicle not found. You can add a new vehicle below.');
      setShowAddForm(true);
    } finally {
      setIsSearching(false);
    }
  };

  const handleReplaceVehicle = async () => {
    // TODO: Implement replace vehicle API call
    console.log('Replacing vehicle:', searchedVehicle);
    Alert.alert('Success', 'Vehicle replaced successfully!');
    // Refresh user vehicle data
    loadVehicle();
    setSearchedVehicle(null);
    setShowSearchArea(false);
    setSearchPlate('');
  };

  const handleChangeVehicle = () => {
    setShowSearchArea(true);
    setSearchedVehicle(null);
    setError('');
    setShowAddForm(false);
    setSearchPlate('');
  };

  const handleBackToVehicle = () => {
    setShowSearchArea(false);
    setSearchedVehicle(null);
    setError('');
    setShowAddForm(false);
    setSearchPlate('');
  };

  const handleAddVehicle = () => {
    if (!newVehicle.brand || !newVehicle.model || !newVehicle.year || !newVehicle.licensePlateNumber) {
      Alert.alert('Error', 'Please fill in all vehicle details.');
      return;
    }
    // TODO: Implement add vehicle API call
    console.log('Adding new vehicle:', newVehicle);
    Alert.alert('Success', 'Vehicle added successfully!');
    setShowAddForm(false);
    setNewVehicle({ brand: '', model: '', year: '', licensePlateNumber: '' });
  };


  const renderUserVehicleCard = () => {
    if (!userVehicle) return null;

    return (
      <>
        {/* Vehicle Header - Outside Card */}
        <View style={styles.vehicleHeader}>
          <View style={styles.vehicleIconContainer}>
            <Ionicons name="car" size={48} color={COLORS.primary} />
          </View>
          <Text style={styles.vehicleTitle}>Vehicle Replace</Text>
        </View>

        {/* Current Vehicle Details Card */}
        <View style={styles.vehicleCard}>
          <Text style={styles.cardTitle}>Current Vehicle</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Brand</Text>
            <Text style={styles.detailValue}>{userVehicle.brand}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Model</Text>
            <Text style={styles.detailValue}>{userVehicle.model}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Year</Text>
            <Text style={styles.detailValue}>{userVehicle.year}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>License Plate</Text>
            <View style={styles.licensePlate}>
              <Text style={styles.licensePlateText}>{userVehicle.licensePlateNumber}</Text>
            </View>
          </View>

          {/* Change Vehicle Button */}
          <Button
            title="Change Vehicle"
            variant="primary"
            size="small"
            onPress={handleChangeVehicle}
            style={styles.changeVehicleButton}
          />
        </View>
      </>
    );
  };

  const renderSearchedVehicleCard = () => {
    if (!searchedVehicle) return null;

    return (
      <>
        {/* Searched Vehicle Header - No Icon */}
        <View style={styles.vehicleHeader}>
          <Text style={styles.vehicleTitle}>Found Vehicle</Text>
        </View>

        {/* Searched Vehicle Details Card */}
        <View style={styles.vehicleCard}>
          <Text style={styles.cardTitle}>Vehicle Details</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Brand</Text>
            <Text style={styles.detailValue}>{searchedVehicle.brand}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Model</Text>
            <Text style={styles.detailValue}>{searchedVehicle.model}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Year</Text>
            <Text style={styles.detailValue}>{searchedVehicle.year}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>License Plate</Text>
            <View style={styles.licensePlate}>
              <Text style={styles.licensePlateText}>{searchedVehicle.number}</Text>
            </View>
          </View>

          {/* Replace Vehicle Button */}
          <Button
            title="Replace Vehicle"
            variant="primary"
            size="small"
            onPress={handleReplaceVehicle}
            style={styles.replaceVehicleButton}
          />
        </View>
      </>
    );
  };

  const renderAddVehicleForm = () => (
    <View style={styles.addVehicleCard}>
      <Text style={styles.cardTitle}>Add New Vehicle</Text>
      
      <Input
        label="Brand"
        placeholder="Enter vehicle brand"
        value={newVehicle.brand}
        onChangeText={(text) => setNewVehicle(prev => ({ ...prev, brand: text }))}
        style={styles.inputField}
      />
      
      <Input
        label="Model"
        placeholder="Enter vehicle model"
        value={newVehicle.model}
        onChangeText={(text) => setNewVehicle(prev => ({ ...prev, model: text }))}
        style={styles.inputField}
      />
      
      <Input
        label="Year"
        placeholder="Enter year"
        value={newVehicle.year}
        onChangeText={(text) => setNewVehicle(prev => ({ ...prev, year: text }))}
        keyboardType="numeric"
        style={styles.inputField}
      />
      
      <Input
        label="License Plate"
        placeholder="Enter license plate number"
        value={newVehicle.licensePlateNumber}
        onChangeText={(text) => setNewVehicle(prev => ({ ...prev, licensePlateNumber: text }))}
        style={styles.inputField}
      />
      
      <View style={styles.formActions}>
        <Button
          title="Cancel"
          variant="outline"
          size="medium"
          onPress={() => setShowAddForm(false)}
          style={styles.formButton}
        />
        <Button
          title="Add Vehicle"
          variant="primary"
          size="small"
          onPress={handleAddVehicle}
          style={styles.formButton}
        />
      </View>
    </View>
  );

  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={COLORS.secondary} />
      <Text style={styles.loadingText}>Loading vehicle information...</Text>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.errorContainer}>
      <Ionicons name="alert-circle" size={48} color={COLORS.error} />
      <Text style={styles.errorTitle}>Unable to Load Vehicle</Text>
      <Text style={styles.errorMessage}>{error}</Text>
      <TouchableOpacity
        style={styles.retryButton}
        onPress={loadVehicle}
        activeOpacity={0.7}
      >
        <Ionicons name="refresh" size={20} color={COLORS.surface} />
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="car-outline" size={64} color={COLORS.text.tertiary} />
      <Text style={styles.emptyTitle}>No Vehicle Assigned</Text>
      <Text style={styles.emptyMessage}>
        You currently have no vehicle assigned. By searching for a plate number, you can add your car.
      </Text>
      <Button
        title="Add Vehicle"
        variant="primary"
        size="small"
        onPress={handleChangeVehicle}
        style={styles.addVehicleButton}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        onBackPress={showSearchArea ? handleBackToVehicle : undefined}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Section - Only show when user clicks Change Vehicle */}
        {showSearchArea && (
          <View style={styles.searchCard}>
            <Text style={styles.cardTitle}>Search Vehicle</Text>
            <Input
              label="License Plate Number"
              placeholder="Enter license plate to search"
              value={searchPlate}
              onChangeText={setSearchPlate}
              style={styles.searchInput}
            />
            <Button
              title={isSearching ? "Searching..." : "Search"}
              variant="primary"
              size="small"
              onPress={handleSearchByPlate}
              disabled={isSearching}
              style={styles.searchButton}
            />
          </View>
        )}

        {/* Add Vehicle Form - Only show when search fails */}
        {showAddForm && renderAddVehicleForm()}

        {/* Content */}
        {isLoading ? (
          renderLoadingState()
        ) : showSearchArea ? (
          // After clicking Change Vehicle, show search results
          searchedVehicle ? (
            renderSearchedVehicleCard()
          ) : error ? (
            renderErrorState()
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyMessage}>
                Enter a license plate number above to search for a vehicle.
              </Text>
            </View>
          )
        ) : (
          // Initial state - show current user's vehicle or empty state
          userVehicle ? (
            renderUserVehicleCard()
          ) : (
            renderEmptyState()
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundDark,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.lg,
    paddingTop: Platform.OS === 'web' ? 100 : 80,
  },
  // Search Card
  searchCard: {
    backgroundColor: COLORS.surface,
    borderRadius: DESIGN.borderRadius.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...DESIGN.shadows.sm,
  },
  searchInput: {
    marginBottom: SPACING.md,
  },
  searchButton: {
    marginTop: SPACING.sm,
  },
  // Add Vehicle Button
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: DESIGN.borderRadius.md,
    marginBottom: SPACING.md,
    ...DESIGN.shadows.sm,
  },
  addButtonText: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.surface,
    marginLeft: SPACING.sm,
  },
  // Add Vehicle Form
  addVehicleCard: {
    backgroundColor: COLORS.surface,
    borderRadius: DESIGN.borderRadius.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...DESIGN.shadows.sm,
  },
  inputField: {
    marginBottom: SPACING.md,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.md,
  },
  formButton: {
    flex: 1,
    marginHorizontal: SPACING.xs,
  },
  // Vehicle Header - Outside Card (like Agreement/Profile screens)
  vehicleHeader: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  vehicleIconContainer: {
    width: 80,
    height: 80,
    borderRadius: DESIGN.borderRadius.full,
    backgroundColor: COLORS.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  vehicleTitle: {
    fontSize: TYPOGRAPHY.sizes.xxl,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    textAlign: 'center',
  },
  // Vehicle Card (compact)
  vehicleCard: {
    backgroundColor: COLORS.surface,
    borderRadius: DESIGN.borderRadius.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...DESIGN.shadows.sm,
  },
  cardTitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  detailLabel: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.text.secondary,
    flex: 1,
  },
  detailValue: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.primary,
    textAlign: 'right',
    flex: 1,
  },
  licensePlate: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: DESIGN.borderRadius.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderStyle: 'dashed',
  },
  licensePlateText: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    fontFamily: 'monospace',
  },
  // Button Styles
  changeVehicleButton: {
    marginTop: SPACING.lg,
  },
  replaceVehicleButton: {
    marginTop: SPACING.lg,
  },
  addVehicleButton: {
    marginTop: SPACING.lg,
  },
  // Loading State
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  loadingText: {
    fontSize: TYPOGRAPHY.sizes.md,
    color: COLORS.text.secondary,
    marginTop: SPACING.lg,
    fontWeight: TYPOGRAPHY.weights.medium,
  },
  // Error State
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  errorTitle: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  errorMessage: {
    fontSize: TYPOGRAPHY.sizes.md,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: TYPOGRAPHY.sizes.md * 1.5,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: DESIGN.borderRadius.md,
    ...DESIGN.shadows.sm,
  },
  retryButtonText: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.surface,
    marginLeft: SPACING.sm,
  },
  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyTitle: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  emptyMessage: {
    fontSize: TYPOGRAPHY.sizes.md,
    color: COLORS.text.secondary,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.sizes.md * 1.5,
    paddingHorizontal: SPACING.lg,
  },
});

export default VehiclesScreen;
