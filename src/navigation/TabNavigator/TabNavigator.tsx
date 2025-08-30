import HomeScreen from '@/src/screens/HomeScreen/HomeScreen';
import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { memo } from 'react';
import { TabBar } from './components/TabBar';

const Tabs = createBottomTabNavigator();

export const TabNames = {
  home:'Home',
  Plan:'Plan',
};

interface Props {
  initialRoute: string;
}

const TabNavigator = ({ initialRoute }: Props) => {
  return (
    <Tabs.Navigator
      initialRouteName={initialRoute}
      detachInactiveScreens={true}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        lazy: true,
      }}
      tabBar={(props: BottomTabBarProps) => (
        <TabBar
          {...props}
        />
      )}>
      <Tabs.Screen name={TabNames.home} component={HomeScreen} />
    </Tabs.Navigator>
  );
};

export default memo(TabNavigator);


