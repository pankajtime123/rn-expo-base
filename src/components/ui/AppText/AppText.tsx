
import { fontStyles, FontStylesType, FontWeight } from '@/src/configs/fonts/fontStyles';
import React from 'react';
import { ColorValue, NativeSyntheticEvent, TextLayoutEventData, TextProps, TextStyle } from 'react-native';
import Animated, { Easing, LinearTransition } from 'react-native-reanimated';

export type AppTextType = {
  px?: number
  py?: number
  mx?: number
  my?: number
  color?: ColorValue
  lineHeight?: number
  maxWidth?: number | '100%' | '90%' | '80%' | '70%' | '60%' | '50%' | '40%' | '35%' | '30%'
  bold?: boolean
  numberOfLines?: number
  textAlign?: 'center' | 'left' | 'right'
  underline?: boolean
  capitalize?: boolean
  onPress?: () => void
  onLongPress?: () => void
  style?: TextStyle | TextStyle[]
  letterSpacing?: number
  type?: FontStylesType
  children?: React.ReactNode | string
  mt?: number;
  mb?: number;
  mr?: number;
  ml?: number;
  rest?: TextProps,
  fontWeight?: TextStyle['fontWeight'] | number
  weight?: Extract<FontWeight, 'extraBold' | 'bold' | 'semiBold' | 'medium' | 'regular' | 'thin' | 'hairline'>
  animation?: boolean
  onTextLayout?: ((event: NativeSyntheticEvent<TextLayoutEventData>) => void) | undefined
}

export default function AppText({
  px = 0,
  py = 0,
  color = "#121212",
  lineHeight,
  maxWidth,
  numberOfLines,
  textAlign = 'left',
  underline = false,
  capitalize = false,
  letterSpacing,
  onPress,
  onLongPress,
  style,
  type = 'helveticaBlack20px',
  children,
  mt = 0,
  mb = 0,
  mr = 0,
  ml = 0,
  mx = 0,
  my = 0,
  onTextLayout,
  animation,
  fontWeight,
  weight,
  ...rest
}: AppTextType) {

  const families = ['helvetica', 'mursGothic'] as const;
  function computeAppliedStyle(): TextStyle {
    if (!weight) return fontStyles[type] as TextStyle;
    const family = families.find((f) => type.startsWith(f));
    const sizeMatch = type.match(/(\d+)px$/);
    if (!family || !sizeMatch) return fontStyles[type] as TextStyle;
    const size = sizeMatch[1];
    const capitalized = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
    const overrideKey = `${family}${capitalized(weight)}${size}px` as FontStylesType;
    const override = (fontStyles as Record<string, TextStyle>)[overrideKey];
    return (override as TextStyle) || (fontStyles[type] as TextStyle);
  }

  const appliedStyle = computeAppliedStyle();
  const normalizedFontWeight: TextStyle['fontWeight'] | undefined =
    weight ? undefined : typeof fontWeight === 'number' ? (String(fontWeight) as TextStyle['fontWeight']) : fontWeight;

  return (
    <Animated.Text
      onPress={onPress}
      onLongPress={onLongPress}
      numberOfLines={numberOfLines}
      layout={animation ? LinearTransition.duration(300).easing(Easing.ease) : undefined}
      style={[
        appliedStyle,
        {
          color: color,
          lineHeight,
          maxWidth,
          textAlign,
          paddingHorizontal: px,
          paddingVertical: py,
          textDecorationLine: underline ? 'underline' : 'none',
          textTransform: capitalize ? 'capitalize' : 'none',
          marginTop: mt,
          marginBottom: mb,
          marginRight: mr,
          marginLeft: ml,
          marginHorizontal: mx,
          marginVertical: my,
          letterSpacing, 
          fontWeight: normalizedFontWeight
        },
        style,
      ]}
      onTextLayout={onTextLayout}
      {...rest}
    >
      {children}
    </Animated.Text>
  );
}




