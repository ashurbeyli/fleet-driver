import { storage, STORAGE_KEYS } from '../utils/storage';

export interface Driver {
  id: string;
  contractorProfileId: string;
  phone: string;
  name: string;
  parkId: string;
  parkName: string;
  status: number;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  isAgreed: boolean;
  agreedAt: string;
}

export interface AuthData {
  accessToken: string;
  refreshToken: string;
  driver: Driver;
  parkId: string;
}

class AuthService {
  /**
   * Save authentication data to storage
   */
  async saveAuthData(authData: AuthData): Promise<void> {
    try {
      await storage.setItem(STORAGE_KEYS.ACCESS_TOKEN, authData.accessToken);
      await storage.setItem(STORAGE_KEYS.REFRESH_TOKEN, authData.refreshToken);
      await storage.setObject(STORAGE_KEYS.DRIVER_DATA, authData.driver);
      console.log('Auth data saved successfully');
    } catch (error) {
      console.error('Failed to save auth data:', error);
      throw error;
    }
  }

  /**
   * Get authentication data from storage
   */
  async getAuthData(): Promise<AuthData | null> {
    try {
      const accessToken = await storage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      const refreshToken = await storage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      const driver = await storage.getObject<Driver>(STORAGE_KEYS.DRIVER_DATA);

      if (!accessToken || !refreshToken || !driver) {
        return null;
      }

      return {
        accessToken,
        refreshToken,
        driver,
        parkId: driver.parkId,
      };
    } catch (error) {
      console.error('Failed to get auth data:', error);
      return null;
    }
  }

  /**
   * Get access token
   */
  async getAccessToken(): Promise<string | null> {
    try {
      return await storage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    } catch (error) {
      console.error('Failed to get access token:', error);
      return null;
    }
  }

  /**
   * Get refresh token
   */
  async getRefreshToken(): Promise<string | null> {
    try {
      return await storage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    } catch (error) {
      console.error('Failed to get refresh token:', error);
      return null;
    }
  }

  /**
   * Get driver data
   */
  async getDriver(): Promise<Driver | null> {
    try {
      return await storage.getObject<Driver>(STORAGE_KEYS.DRIVER_DATA);
    } catch (error) {
      console.error('Failed to get driver data:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const accessToken = await storage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      return accessToken != null;
    } catch (error) {
      console.error('Failed to check authentication:', error);
      return false;
    }
  }

  /**
   * Clear authentication data (logout)
   */
  async clearAuthData(): Promise<void> {
    try {
      await storage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      await storage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      await storage.removeItem(STORAGE_KEYS.DRIVER_DATA);
      console.log('Auth data cleared successfully');
    } catch (error) {
      console.error('Failed to clear auth data:', error);
      throw error;
    }
  }

  /**
   * Update access token (for token refresh)
   */
  async updateAccessToken(accessToken: string): Promise<void> {
    try {
      await storage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    } catch (error) {
      console.error('Failed to update access token:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const authService = new AuthService();

export default authService;

