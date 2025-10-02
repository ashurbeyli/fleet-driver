import { storage, STORAGE_KEYS } from '../utils/storage';

export interface Driver {
  id: string;
  phone: string;
  name: string;
  parkName: string;
  isVerified: boolean;
  isAgreed: boolean;
}

export interface AuthData {
  accessToken: string;
  driver: Driver;
}

class AuthService {
  /**
   * Save authentication data to storage
   */
  async saveAuthData(authData: AuthData): Promise<void> {
    try {
      await storage.setItem(STORAGE_KEYS.ACCESS_TOKEN, authData.accessToken);
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
      const driver = await storage.getObject<Driver>(STORAGE_KEYS.DRIVER_DATA);

      if (!accessToken || !driver) {
        return null;
      }

      return {
        accessToken,
        driver,
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

  /**
   * Update driver data in storage
   */
  async updateDriverData(updatedDriver: Partial<Driver>): Promise<void> {
    try {
      const currentDriver = await this.getDriver();
      if (!currentDriver) {
        throw new Error('No existing driver data found');
      }

      const mergedDriver = { ...currentDriver, ...updatedDriver };
      await storage.setObject(STORAGE_KEYS.DRIVER_DATA, mergedDriver);
      console.log('Driver data updated successfully');
    } catch (error) {
      console.error('Failed to update driver data:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const authService = new AuthService();

export default authService;

