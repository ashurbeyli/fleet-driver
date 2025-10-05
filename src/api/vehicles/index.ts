import { apiClient } from '../config';

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  licensePlateNumber: string; // For /api/v1/users/me/vehicle
}

export interface SearchVehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  number: string; // For /api/v1/vehicles search endpoint
}

export const getVehicle = async (): Promise<Vehicle> => {
  try {
    const response = await apiClient.request<Vehicle>('/api/v1/users/me/vehicle');
    return response;
  } catch (error) {
    console.error('Failed to fetch vehicle:', error);
    throw error;
  }
};

export const searchVehicleByPlate = async (plateNo: string): Promise<SearchVehicle> => {
  try {
    const response = await apiClient.request<SearchVehicle>(`/api/v1/vehicles?plate_no=${plateNo}`);
    return response;
  } catch (error) {
    console.error('Failed to search vehicle by plate number:', error);
    throw error;
  }
};

export default {
  getVehicle,
  searchVehicleByPlate,
};
