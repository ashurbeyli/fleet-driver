import { apiClient } from '../config';
import { storage, STORAGE_KEYS } from '../../utils/storage';

export interface LeaderboardEntry {
  rank: number;
  name: string;
  change?: number;
  orders: number;
  isMe: boolean;
}

export interface LeaderboardCompetition {
  competitionId: string;
  competitionTitle: string;
  data: LeaderboardEntry[];
}

export type LeaderboardsResponse = LeaderboardCompetition[];

export const getLeaderboards = async (): Promise<LeaderboardsResponse> => {
  try {
    // Get access token from storage
    const accessToken = await storage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    
    if (!accessToken) {
      throw new Error('No access token found. Please login again.');
    }

    const response = await apiClient.request<LeaderboardsResponse>('/api/v1/users/me/leaderboards', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    
    return response;
  } catch (error) {
    console.error('Failed to fetch leaderboards:', error);
    throw error;
  }
};

export default {
  getLeaderboards,
};
