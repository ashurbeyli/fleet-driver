import apiClient from '../config';

export interface WithdrawalRequest {
  amount: number; // Amount in Turkish Lira (e.g., 0.01 = ₺0.01)
  iban: string;
  accountHolderName: string;
}

export enum WithdrawalStatus {
  Pending = 0,
  MoneySent = 1,
  AwaitingOtpVerification = 2,
  Failed = 3,
  FailedOtp = 4,
}

export interface WithdrawalResponse {
  withdrawalId: string;
  status: WithdrawalStatus;
  amount: number; // Amount in Turkish Lira
  maskedIBAN: string;
  message: string;
  createdAt: string;
}

export interface VerifyOtpRequest {
  otpCode: string;
}

export interface WithdrawalHistoryItem {
  id: string;
  amount: number; // Amount in Turkish Lira
  status: number;
  statusDescription: string;
  explanation: string;
  createdAt: string;
  updatedAt: string;
  maskedIBAN: string;
  maskedPhone: string;
  receiverName: string;
  yandexTransactionId: string;
  bankTransactionRefNo: string;
  bankPaymentNo: string;
  failureReason: string;
}

export interface WithdrawalHistoryResponse {
  items: WithdrawalHistoryItem[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface WithdrawalDetailResponse {
  id: string;
  amount: number; // Amount in Turkish Lira
  status: number;
  statusDescription: string;
  explanation: string;
  createdAt: string;
  updatedAt: string;
  maskedIBAN: string;
  maskedPhone: string;
  receiverName: string;
  yandexTransactionId: string;
  bankTransactionRefNo: string;
  bankPaymentNo: string;
  failureReason: string;
}

/**
 * Create a withdrawal request
 * Returns 202 Accepted status
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

/**
 * Verify OTP for a withdrawal request
 * Returns 200 OK status
 */
export const verifyWithdrawalOtp = async (withdrawalId: string, otpCode: string): Promise<WithdrawalResponse> => {
  try {
    const response = await apiClient.request<WithdrawalResponse>(`/api/v1/Withdrawals/${withdrawalId}/verify-otp`, {
      method: 'POST',
      body: JSON.stringify({ otpCode }),
    });
    return response;
  } catch (error) {
    console.error('Failed to verify withdrawal OTP:', error);
    throw error;
  }
};

/**
 * Get withdrawal history
 * Returns paginated list of withdrawal transactions
 */
export const getWithdrawalHistory = async (page: number = 1, pageSize: number = 20): Promise<WithdrawalHistoryItem[]> => {
  try {
    const response = await apiClient.request<WithdrawalHistoryItem[]>(`/api/v1/Withdrawals?page=${page}&pageSize=${pageSize}`, {
      method: 'GET',
    });
    return response;
  } catch (error) {
    console.error('Failed to fetch withdrawal history:', error);
    throw error;
  }
};

/**
 * Get withdrawal details by ID
 * Returns detailed information about a specific withdrawal
 */
export const getWithdrawalById = async (id: string): Promise<WithdrawalDetailResponse> => {
  try {
    const response = await apiClient.request<WithdrawalDetailResponse>(`/api/v1/Withdrawals/${id}`, {
      method: 'GET',
    });
    return response;
  } catch (error) {
    console.error('Failed to fetch withdrawal details:', error);
    throw error;
  }
};

const withdrawalsApi = {
  createWithdrawal,
  verifyWithdrawalOtp,
  getWithdrawalHistory,
  getWithdrawalById,
};

export default withdrawalsApi;

