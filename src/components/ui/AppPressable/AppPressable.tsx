import React from 'react';
import { Pressable, PressableProps, ViewStyle } from 'react-native';
import Animated, { Easing, EasingFunction, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const APressable = Animated.createAnimatedComponent(Pressable);

export interface AppPressableProps extends PressableProps {
  animationEnabled?: boolean;
  animationType?: 'fade' | 'scale' | 'slide';
  animationDuration?: number;
  animationEasing?: EasingFunction;
  mt?: number;
  mb?: number;
  ml?: number;
  mr?: number;
  m?: number;
  p?: number;
  mx?: number;
  my?: number;
  px?: number;
  py?: number;
  pt?: number
  pb?: number
  style?: ViewStyle | ViewStyle[];
  center?: boolean
}

const AppPressable: React.FC<AppPressableProps> = ({
  children,
  animationEasing = Easing.ease,
  onPress,
  mt,
  mb,
  ml,
  mr,
  m,
  p,
  mx,
  my,
  px,
  py,
  pt,
  pb,
  style,
  center = false,
  ...rest
}) => {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  const dynamicStyle:ViewStyle = {
    marginTop: mt,
    marginBottom: mb,
    marginLeft: ml,
    marginRight: mr,
    margin: m,
    padding: p,
    marginHorizontal: mx,
    marginVertical: my,
    paddingHorizontal: px,
    paddingVertical: py,
    paddingBottom: pb,
    paddingTop: pt,
    alignSelf: 'center'
  };

  const centerStyle: ViewStyle = center ? { justifyContent: 'center', alignItems: 'center' } : {}
  return (
    <APressable
      onPressIn={() => (scale.value = withSpring(0.95, { damping: 10, stiffness: 200 }))}
      onPressOut={() => (scale.value = withSpring(1, { damping: 10, stiffness: 200 }))}
      style={[centerStyle, dynamicStyle, animatedStyle, style]}
      onPress={onPress}
      {...rest}
    >
      {children}
    </APressable>
  );
};

export default AppPressable;
