import MainScreen from '@/src/screens/MainScreen/MainScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useInternetAvailability } from '../../hooks/appConfigs/useInternetAvailability';
import RoughScreen from '../../screens/RoughScreen/RoughScreen';
import SplashScreen from '../../screens/SplashScreen/SplashScreen';
import { RootStackScreens } from './types';


const Stack = createNativeStackNavigator();

export default function RootStack() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const { isConnected, recheckConnection } = useInternetAvailability();

  useEffect(() => {
    const checkLoginStatus = () => {
    };
    checkLoginStatus();
  }, []);

  // if (!isConnected) {
  //   return
  //   // return <NoInternet onRetry={recheckConnection} />;
  // }

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={RootStackScreens.RoughScreen}>
      <Stack.Screen
        name={RootStackScreens.RoughScreen}
        component={RoughScreen}
      />
      <Stack.Screen
        name={RootStackScreens.MainScreen}
        component={MainScreen}
      />
      <Stack.Screen
        name={RootStackScreens.SplashScreen}
        component={SplashScreen}
      />
    </Stack.Navigator>
  );
}
