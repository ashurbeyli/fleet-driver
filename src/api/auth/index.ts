import { apiClient } from '../config';

export interface LoginRequest {
  parkId: string;
  phone: string;
}

export interface LoginResponse {
  isValid: boolean;
  message: string;
  parkId: string;
  phone: string;
  maskedPhone: string;
  otpExpiryMinutes: number;
}

export interface VerifyOtpRequest {
  parkId: string;
  phone: string;
  otpCode: string;
}

export interface VerifyOtpResponse {
  isValid: boolean;
  message: string;
  accessToken: string;
  refreshToken: string;
  driver: {
    id: string;
    contractorProfileId: string;
    phone: string;
    name: string;
    parkId: string;
    parkName: string;
    status: number;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
    isAgreed: boolean;
    agreedAt: string;
  };
  parkId: string;
}

export const login = async (phoneNumber: string, parkId: string): Promise<LoginResponse> => {
  try {
    const response = await apiClient.request<LoginResponse>('/api/v1/Auth/login', {
      method: 'POST',
      body: JSON.stringify({
        parkId: parkId,
        phone: phoneNumber,
      }),
    });
    
    return response;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

export const verifyOtp = async (
  phoneNumber: string,
  parkId: string,
  otpCode: string
): Promise<VerifyOtpResponse> => {
  try {
    const response = await apiClient.request<VerifyOtpResponse>('/api/v1/Auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({
        parkId: parkId,
        phone: phoneNumber,
        otpCode: otpCode,
      }),
    });
    
    return response;
  } catch (error) {
    console.error('OTP verification failed:', error);
    throw error;
  }
};

export default {
  login,
  verifyOtp,
};
