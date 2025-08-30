import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

interface AppViewProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  alignSelf?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  padding?: number;
  backgroundColor?: string;
  borderRadius?: number;
  gap?: number;
  center?: boolean;
  width?: number;
  p?: number;
  px?: number;
  py?: number;
  pt?: number;
  pb?: number;
  m?: number;
  mx?: number;
  my?: number;
  mt?: number;
  mb?: number;
  w?: number;
  h?: number;
}

const AppView: React.FC<AppViewProps> = ({
  children,
  style,
  alignSelf,
  alignItems = 'flex-start',
  justifyContent = 'flex-start',
  backgroundColor,
  borderRadius = 0,
  gap = 0,
  center,
  w,
  h,
  px,
  py,
  pt,
  pb,
  mx,
  my,
  mt,
  mb,
  p,
  m,
}) => {
  const centerStyle: ViewStyle = center
    ? {
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
      }
    : {};

  const constructedStyle: ViewStyle = {
    paddingHorizontal: px,
    paddingVertical: py,
    paddingTop: pt,
    paddingBottom: pb,
    padding: p,
    margin: m,
    marginHorizontal: mx,
    marginVertical: my,
    marginTop: mt,
    marginBottom: mb,
    width: w,
    height: h,
    alignSelf,
  };

  return (
    <View
      style={[
        {
          alignItems,
          justifyContent,
          backgroundColor,
          borderRadius,
          gap,
        },
        constructedStyle,
        centerStyle,
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
 
});

export default AppView;