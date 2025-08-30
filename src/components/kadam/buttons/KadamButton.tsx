import { FontStylesType } from '@/src/configs/fonts/fontStyles';
import React, { FC } from 'react';
import { StyleSheet } from 'react-native';
import AppPressable, { AppPressableProps } from '../../ui/AppPressable/AppPressable';
import AppText from '../../ui/AppText/AppText';

interface baseButtonProps extends AppPressableProps {
  text?: string,
  textType?: FontStylesType,
  textColor?: string
}

const BaseButton: React.FC<baseButtonProps> = ({
  children,
  text,
  textType = "helveticaBold12px",
  textColor,
  ...rest
}) => {
  return (
    <AppPressable
      {...rest}
    >
      {children ? <>
        {children}
      </> : <AppText type={textType} color={textColor}>
        {text}
      </AppText>}
    </AppPressable>
  );
};


const Primary: FC<baseButtonProps> = (props) => {
  return <BaseButton {...props} style={[styles.primary, StyleSheet.flatten(props?.style)]} />
}

const Secondary: FC<baseButtonProps> = (props) => {
  return <BaseButton {...props} style={[styles.secondary]} />
}

const baseButton = {
  Primary: (props: baseButtonProps) => (
    <Primary {...props} textColor={props?.textColor || '#fff'} />
  ),
  Secondary: (props: baseButtonProps) => (
    <Secondary {...props} textColor={props?.textColor || '#5F34F6'} style={[styles.secondary, StyleSheet.flatten(props?.style)]} />
  ),
};

const styles = StyleSheet.create({
  primary: {
    backgroundColor: '#5F34F6', // Primary color
    borderRadius: 12,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center'
  },
  secondary: {
    backgroundColor: '#fff', // Secondary color
    justifyContent: 'center',
    alignItems: 'center',
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5DFFC',
  },
  text: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default baseButton;