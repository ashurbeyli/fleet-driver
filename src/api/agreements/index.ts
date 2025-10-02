import { apiClient } from '../config';
import { storage, STORAGE_KEYS } from '../../utils/storage';

export interface AgreementResponse {
  title: string;
  text: string;
  updatedAt: string;
}

export interface AgreeResponse {
  message: string;
  agreedAt: string;
}

export interface ConfirmAgreementRequest {
  otpCode: string;
}

export interface ConfirmAgreementResponse {
  message: string;
  agreedAt: string;
}

export const getLatestAgreement = async (): Promise<AgreementResponse> => {
  try {
    // Get access token from storage
    const accessToken = await storage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    
    if (!accessToken) {
      throw new Error('No access token found. Please login again.');
    }

    const response = await apiClient.request<AgreementResponse>('/api/v1/agreements/latest', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    
    return response;
  } catch (error) {
    console.error('Failed to fetch agreement:', error);
    throw error;
  }
};

export const agreeToAgreement = async (): Promise<AgreeResponse> => {
  try {
    // Get access token from storage
    const accessToken = await storage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    
    if (!accessToken) {
      throw new Error('No access token found. Please login again.');
    }

    const response = await apiClient.request<AgreeResponse>('/api/v1/agreements/me/agree', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}), // Empty request body as per API docs
    });
    
    return response;
  } catch (error) {
    console.error('Failed to agree to agreement:', error);
    throw error;
  }
};

export const confirmAgreement = async (otpCode: string): Promise<ConfirmAgreementResponse> => {
  try {
    // Get access token from storage
    const accessToken = await storage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    
    if (!accessToken) {
      throw new Error('No access token found. Please login again.');
    }

    const response = await apiClient.request<ConfirmAgreementResponse>('/api/v1/agreements/me/confirm', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ otpCode }),
    });
    
    return response;
  } catch (error) {
    console.error('Failed to confirm agreement:', error);
    throw error;
  }
};

export default {
  getLatestAgreement,
  agreeToAgreement,
  confirmAgreement,
};
