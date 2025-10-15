import { apiClient } from '../config';

export interface Park {
  id: string;
  name: string;
  value: string;
  label: string;
}

// API response interface based on Swagger documentation
export interface ApiPark {
  id: string;
  parkId: string;
  name: string;
  city: string;
}

export const getParks = async (): Promise<Park[]> => {
  try {
    const response = await apiClient.request<ApiPark[]>('/api/v1/parks');
    
    // Transform the API response to match our Park interface
    // API returns direct array: [{ parkId: "string", name: "string", city: "string" }]
    if (Array.isArray(response)) {
      return response.map((park: ApiPark) => ({
        id: park.id,
        name: park.name,
        value: park.parkId,
        label: park.name,
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Failed to fetch parks:', error);
    // Return empty array when API fails - no mock data
    return [];
  }
};

export default {
  getParks,
};
