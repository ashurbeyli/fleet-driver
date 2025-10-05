import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS, TYPOGRAPHY, SPACING, DESIGN } from '../../../constants';
import { vehiclesApi, Vehicle } from '../../../api';
import { RootStackParamList } from '../../../types';

type DashboardNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;

interface VehicleWidgetProps {
  onVehicleChange?: () => void;
}

const VehicleWidget: React.FC<VehicleWidgetProps> = ({ onVehicleChange }) => {
  const navigation = useNavigation<DashboardNavigationProp>();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadVehicle();
  }, []);

  const loadVehicle = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const vehicleData = await vehiclesApi.getVehicle();
      setVehicle(vehicleData);
    } catch (error) {
      console.error('Failed to load vehicle:', error);
      setError('Failed to load vehicle data');
      setVehicle(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVehiclePress = () => {
    navigation.navigate('Vehicles');
    onVehicleChange?.();
  };

  if (isLoading) {
    return (
      <View style={styles.widget}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="car" size={20} color={COLORS.primary} />
          </View>
          <Text style={styles.title}>Vehicle Status</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  if (error || !vehicle) {
    return (
      <TouchableOpacity style={styles.widget} onPress={handleVehiclePress} activeOpacity={0.7}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="car-outline" size={20} color={COLORS.text.secondary} />
          </View>
          <Text style={styles.title}>Vehicle Status</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No Vehicle Assigned</Text>
          <Text style={styles.emptyMessage}>Tap to add your vehicle</Text>
          <View style={styles.arrowContainer}>
            <Ionicons name="chevron-forward" size={16} color={COLORS.text.tertiary} />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.widget} onPress={handleVehiclePress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="car" size={20} color={COLORS.primary} />
        </View>
        <Text style={styles.title}>My Vehicle</Text>
        <View style={styles.arrowContainer}>
          <Ionicons name="chevron-forward" size={16} color={COLORS.text.tertiary} />
        </View>
      </View>
      
      <View style={styles.vehicleInfo}>
        <Text style={styles.vehicleName}>{vehicle.brand} {vehicle.model}</Text>
        <View style={styles.vehicleDetails}>
          <Text style={styles.vehiclePlate}>{vehicle.licensePlateNumber}</Text>
          <Text style={styles.vehicleYear}>• {vehicle.year}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  widget: {
    backgroundColor: COLORS.surface,
    borderRadius: DESIGN.borderRadius.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...DESIGN.shadows.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.backgroundDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  title: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: COLORS.text.primary,
    flex: 1,
  },
  vehicleInfo: {
    marginTop: SPACING.xs,
  },
  vehicleName: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  vehicleDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehiclePlate: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.text.secondary,
    marginRight: SPACING.xs,
  },
  vehicleYear: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.tertiary,
    fontWeight: TYPOGRAPHY.weights.medium,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  loadingText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.secondary,
    marginLeft: SPACING.sm,
  },
  emptyContainer: {
    paddingVertical: SPACING.sm,
  },
  emptyTitle: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.text.secondary,
    marginBottom: 2,
  },
  emptyMessage: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.text.tertiary,
  },
  arrowContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default VehicleWidget;
