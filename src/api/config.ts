import { authService } from '../services/authService';
import { Platform } from 'react-native';

// Get API base URL from environment variables
// For Expo web: EXPO_PUBLIC_ prefix is needed for build-time replacement
// For Fly.io: Set secret as EXPO_PUBLIC_API_BASE_URL
const getApiBaseUrl = (): string => {
  // Check for EXPO_PUBLIC_ prefixed variable (build-time for Expo, works with Fly.io secrets)
  // This is the recommended approach for Expo web apps
  if (process.env.EXPO_PUBLIC_API_BASE_URL) {
    return process.env.EXPO_PUBLIC_API_BASE_URL;
  }
  
  // Check for standard API_BASE_URL (runtime, e.g., Node.js/SSR)
  if (process.env.API_BASE_URL) {
    return process.env.API_BASE_URL;
  }
  
  // Default fallback
  return 'https://test.com.az';
};

const API_BASE_URL = getApiBaseUrl();

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    // Get access token for authenticated requests
    const accessToken = await authService.getAccessToken();
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, { ...defaultOptions, ...options });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;
