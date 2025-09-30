// Navigation types
export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Otp: {
    phoneNumber: string;
    parkName: string;
    parkId: string;
  };
  Dashboard: undefined;
  // Add more screens as needed
};

// Screen props types
export interface ScreenProps {
  navigation?: any; // Will be properly typed when navigation is set up
  route?: any;
}

// Driver related types
export interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'online' | 'offline' | 'busy';
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
}

// Vehicle related types
export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  status: 'available' | 'in_use' | 'maintenance';
  driverId?: string;
}

// Trip related types
export interface Trip {
  id: string;
  driverId: string;
  vehicleId: string;
  startTime: Date;
  endTime?: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  earnings: number;
  distance: number;
}
