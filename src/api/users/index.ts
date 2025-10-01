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

export default {
  getBalance,
};

