import { useState, useEffect, useCallback } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

const checkInternetConnectivity = async (): Promise<boolean> => {
  try {
    const networkState = await NetInfo.fetch();

    if (!networkState.isConnected) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
};

export const useInternetAvailability = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkConnection = useCallback(async () => {
    setIsLoading(true);
    try {
      const connected = await checkInternetConnectivity();
      setIsConnected(connected);
    } catch (error) {
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const handleNetInfoChange = async (state: NetInfoState) => {
      if (!mounted) return;

      if (state.isConnected === false) {
        setIsConnected(false);
      }
    };

    checkConnection();

    const unsubscribe = NetInfo.addEventListener(handleNetInfoChange);

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [checkConnection]);

  const recheckConnection = useCallback(() => {
    return checkConnection();
  }, [checkConnection]);

  return {
    isConnected,
    isLoading,
    recheckConnection,
  };
};