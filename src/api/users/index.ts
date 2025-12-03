import { apiClient } from '../config';
import { storage, STORAGE_KEYS } from '../../utils/storage';

export interface BalanceDetails {
  blockedTips: number;
  blockedCashless: number;
  blockedBonuses: number;
  blockedFinancialStatements: number;
  blockedClosingDocuments: number;
}

export interface BalanceResponse {
  totalBalance: number;
  blockedBalance: number;
  withdrawableBalance: number;
  balanceDetails: BalanceDetails;
}

export interface UserInfoResponse {
  hireDate: string;
  phone: string;
  licenseNumber: string;
  status: string;
  city: string;
}

export interface UserMeResponse {
  id: string;
  phone: string;
  name: string;
  parkName: string;
  isVerified: boolean;
  isAgreed: boolean;
}

export interface BankDetailsResponse {
  iban: string;
  accountHolderName: string;
}

export const getBalance = async (): Promise<BalanceResponse> => {
  try {
    // Get access token from storage
    const accessToken = await storage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    
    if (!accessToken) {
      throw new Error('No access token found. Please login again.');
    }

    const response = await apiClient.request<BalanceResponse>('/api/v1/users/me/balance', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    
    return response;
  } catch (error) {
    console.error('Failed to fetch balance:', error);
    throw error;
  }
};

export const getUserInfo = async (): Promise<UserInfoResponse> => {
  try {
    // Get access token from storage
    const accessToken = await storage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    
    if (!accessToken) {
      throw new Error('No access token found. Please login again.');
    }

    const response = await apiClient.request<UserInfoResponse>('/api/v1/users/me/info', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    
    return response;
  } catch (error) {
    console.error('Failed to fetch user info:', error);
    throw error;
  }
};

export const getUserMe = async (): Promise<UserMeResponse> => {
  try {
    // Get access token from storage
    const accessToken = await storage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    
    if (!accessToken) {
      throw new Error('No access token found. Please login again.');
    }

    const response = await apiClient.request<UserMeResponse>('/api/v1/users/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    
    return response;
  } catch (error) {
    console.error('Failed to fetch user me:', error);
    throw error;
  }
};

export const getBankDetails = async (): Promise<BankDetailsResponse> => {
  try {
    const response = await apiClient.request<BankDetailsResponse>('/api/v1/Users/me/bank-details', {
      method: 'GET',
    });
    return response;
  } catch (error) {
    console.error('Failed to fetch bank details:', error);
    throw error;
  }
};

export default {
  getBalance,
  getUserInfo,
  getUserMe,
  getBankDetails,
};

