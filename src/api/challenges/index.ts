import { apiClient } from '../config';
import { storage, STORAGE_KEYS } from '../../utils/storage';

export interface ChallengeLevel {
  order: number;
  title: string;
  rideCountThreshold: number;
  bonusAmount: number;
  ridesRemaining: number;
  progressPercentage: number;
}

export interface Challenge {
  title: string;
  subtitle: string;
  description: string;
  startDate: string;
  timeLeftSeconds: number;
  driverRideCount: number;
  currentLevel: ChallengeLevel;
}

export interface ChallengesResponse {
  challenges: Challenge[];
}

export const getChallenges = async (): Promise<ChallengesResponse> => {
  try {
    // Get access token from storage
    const accessToken = await storage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    
    if (!accessToken) {
      throw new Error('No access token found. Please login again.');
    }

    const response = await apiClient.request<ChallengesResponse>('/api/v1/users/me/challenges', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    
    return response;
  } catch (error) {
    console.error('Failed to fetch challenges:', error);
    throw error;
  }
};

export default {
  getChallenges,
};
