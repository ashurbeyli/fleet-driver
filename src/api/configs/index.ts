import apiClient from '../config';

export interface ConfigLinks {
  whatsAppLink: string;
  facebookLink: string;
  instagramLink: string;
  callCenterNumber: string;
}

export interface ConfigFeatures {
  bonuses: boolean;
  bonusesComingSoon: boolean;
  challenges: boolean;
  challengesComingSoon: boolean;
  rankings: boolean;
  invitations: boolean;
  vehicle: boolean;
  withdrawal: boolean;
  agreement: boolean;
  language?: boolean;
}

export interface WithdrawalSettings {
  minimumAmount: number;
  maximumAmount: number;
}

export interface AppConfig {
  links: ConfigLinks;
  features: ConfigFeatures;
  withdrawalSettings?: WithdrawalSettings;
}

/**
 * Get application configuration including external links and feature flags
 */
export const getConfigs = async (): Promise<AppConfig> => {
  try {
    const response = await apiClient.request<AppConfig>('/api/v1/Configs', {
      method: 'GET',
    });
    return response;
  } catch (error) {
    console.error('Failed to fetch configs:', error);
    throw error;
  }
};

const configsApi = {
  getConfigs,
};

export default configsApi;

