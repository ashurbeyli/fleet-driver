import { apiClient } from '../config';
import { storage, STORAGE_KEYS } from '../../utils/storage';

export interface InvitationPlatform {
  id: string;
  name: string;
  icon: string;
  isCopyLink: boolean;
  url: string;
  color?: string;
}

export interface InvitationsPlatformsResponse {
  platforms: InvitationPlatform[];
}

export interface Invitation {
  id: string;
  phone: string;
  invitedAt: string;
  orders: number;
  isCompleted: boolean;
  totalBonusesEarned: number;
  isRegistered: boolean;
}

export interface InvitationsResponse {
  invitations: Invitation[];
}

export interface SendInvitationRequest {
  invitedPhone: string;
  platformId: string;
}

export interface SendInvitationResponse {
  invitationId: string;
  message: string;
  success: boolean;
}

export const getInvitationPlatforms = async (targetParkId: string, phoneNumber?: string): Promise<InvitationsPlatformsResponse> => {
  try {
    const accessToken = await storage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    
    if (!accessToken) {
      throw new Error('No access token found. Please login again.');
    }

    // Build query parameters
    let queryParams = `targetParkId=${targetParkId}`;
    if (phoneNumber) {
      queryParams += `&phone=${encodeURIComponent(phoneNumber)}`;
    }

    const response = await apiClient.request<InvitationsPlatformsResponse>(
      `/api/v1/invitations/platforms?${queryParams}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );
    
    return response;
  } catch (error) {
    console.error('Failed to fetch invitation platforms:', error);
    console.log(error);
    throw error;
  }
};

export const getInvitations = async (): Promise<Invitation[]> => {
  try {
    const accessToken = await storage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    
    if (!accessToken) {
      throw new Error('No access token found. Please login again.');
    }

    const response = await apiClient.request<Invitation[]>(
      '/api/v1/Users/me/invitations',
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );
    
    return response;
  } catch (error) {
    console.error('Failed to fetch invitations:', error);
    throw error;
  }
};

export const sendInvitation = async (request: SendInvitationRequest): Promise<SendInvitationResponse> => {
  try {
    const accessToken = await storage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    
    if (!accessToken) {
      throw new Error('No access token found. Please login again.');
    }

    const response = await apiClient.request<SendInvitationResponse>(
      '/api/v1/Users/me/invitations',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      }
    );
    
    return response;
  } catch (error) {
    console.error('Failed to send invitation:', error);
    throw error;
  }
};

export default {
  getInvitationPlatforms,
  getInvitations,
  sendInvitation,
};
