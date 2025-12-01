import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { configsApi, AppConfig, ConfigFeatures, ConfigLinks } from '../api';

interface ConfigContextType {
  config: AppConfig | null;
  features: ConfigFeatures;
  links: ConfigLinks;
  isLoading: boolean;
  error: Error | null;
  refreshConfig: () => Promise<void>;
}

const defaultFeatures: ConfigFeatures = {
  bonuses: false,
  challenges: false,
  rankings: false,
  invitations: false,
  vehicle: false,
  withdrawal: false,
};

const defaultLinks: ConfigLinks = {
  whatsAppLink: '',
  facebookLink: '',
  instagramLink: '',
  callCenterNumber: '',
};

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

interface ConfigProviderProps {
  children: ReactNode;
}

export const ConfigProvider: React.FC<ConfigProviderProps> = ({ children }) => {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadConfig = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const configData = await configsApi.getConfigs();
      setConfig(configData);
    } catch (err) {
      const error = err as Error;
      console.error('Failed to load config:', error);
      setError(error);
      // Set default config so app doesn't break
      setConfig({
        features: defaultFeatures,
        links: defaultLinks,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  const refreshConfig = async () => {
    await loadConfig();
  };

  const value: ConfigContextType = {
    config,
    features: config?.features || defaultFeatures,
    links: config?.links || defaultLinks,
    isLoading,
    error,
    refreshConfig,
  };

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
};

export const useConfig = (): ConfigContextType => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};

export default ConfigContext;

