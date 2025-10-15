import { apiClient } from '../config';
import { storage, STORAGE_KEYS } from '../../utils/storage';

export interface Bonus {
  id?: string; // Make id optional since API might not return it
  title: string;
  subtitle: string;
  achievedAt: string;
  bonusAmount: number;
  isClaimed: boolean;
}

export interface BonusesResponse {
  unclaimedBonusCount: number;
  unclaimedBonusTotalAmount: number;
  bonuses: Bonus[];
}

export interface ClaimBonusResponse {
  success: boolean;
  message: string;
  claimedAmount: number;
  claimedAt: string;
  unclaimedBonusCount: number;
  unclaimedBonusTotalAmount: number;
}

export const getBonuses = async (): Promise<BonusesResponse> => {
  try {
    // Get access token from storage
    const accessToken = await storage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    
    if (!accessToken) {
      throw new Error('No access token found. Please login again.');
    }

    const response = await apiClient.request<BonusesResponse>('/api/v1/users/me/bonuses', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    
    return response;
  } catch (error) {
    console.error('Failed to fetch bonuses:', error);
    throw error;
  }
};

export const claimBonus = async (bonusId: string): Promise<ClaimBonusResponse> => {
  try {
    // Get access token from storage
    const accessToken = await storage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    
    if (!accessToken) {
      throw new Error('No access token found. Please login again.');
    }

    const response = await apiClient.request<ClaimBonusResponse>(`/api/v1/users/me/bonuses/${bonusId}/claim`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    
    return response;
  } catch (error) {
    console.error('Failed to claim bonus:', error);
    throw error;
  }
};

export default {
  getBonuses,
  claimBonus,
};
