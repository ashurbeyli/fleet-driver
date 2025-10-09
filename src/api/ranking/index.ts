import { apiClient } from '../config';
import { storage, STORAGE_KEYS } from '../../utils/storage';

export interface RankingResponse {
  currentPosition: number;
  change: number;
  totalCompetitors: number;
  ordersCount: number;
}

export const getRanking = async (): Promise<RankingResponse> => {
  try {
    // Get access token from storage
    const accessToken = await storage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    
    if (!accessToken) {
      throw new Error('No access token found. Please login again.');
    }

    const response = await apiClient.request<RankingResponse>('/api/v1/users/me/ranking', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    
    return response;
  } catch (error) {
    console.error('Failed to fetch ranking:', error);
    throw error;
  }
};

export default {
  getRanking,
};
