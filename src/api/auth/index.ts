import { apiClient } from '../config';

export interface LoginRequest {
  phoneNumber: string;
  parkId: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    sessionId?: string;
    otpSent?: boolean;
  };
}

export const login = async (phoneNumber: string, parkId: string): Promise<LoginResponse> => {
  try {
    const response = await apiClient.request<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        phoneNumber,
        parkId,
      }),
    });
    
    return response;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

export default {
  login,
};
