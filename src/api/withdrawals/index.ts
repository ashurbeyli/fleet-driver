import apiClient from '../config';

export interface WithdrawalRequest {
  amount: number;
  receiverPhone: string;
  receiverTaxNo: string;
  receiverName: string;
  iban: string;
  explanation: string;
}

export interface WithdrawalResponse {
  success: boolean;
  message?: string;
  withdrawalId?: string;
}

/**
 * Create a withdrawal request
 */
export const createWithdrawal = async (data: WithdrawalRequest): Promise<WithdrawalResponse> => {
  try {
    const response = await apiClient.request<WithdrawalResponse>('/api/v1/Withdrawals', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response;
  } catch (error) {
    console.error('Failed to create withdrawal:', error);
    throw error;
  }
};

const withdrawalsApi = {
  createWithdrawal,
};

export default withdrawalsApi;

