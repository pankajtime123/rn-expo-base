
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

const TabItem = ({
    state,
    descriptors,
    navigation,
    route,
    index,
}: BottomTabBarProps & { route: any, index: number }) => {


    const _tabData = {
        Home: { icon: '' },
        Plan: { icon: '' }
    }

    const { options } = descriptors[route.key];
    const label =
        options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
                ? options.title
                : route.name;

    const isActive = state.index === index;

    const onPress = () => {
        const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
        });

        if (!isActive && !event.defaultPrevented) {
            navigation.navigate({ name: route.name, params: {}, merge: true });
        }
    };

    const active = () => {
        if (isActive) {
            return {
                textType: 'latoBold12px',
                color: 'red',
                weight: 'fill'
            }
        }
        return {
            textType: 'latoRegular12px',
            color: '#fff',
            weight: 'regular'
        }
    }

    const TabData = _tabData[label as keyof typeof _tabData]

    return (
        <Pressable onPress={onPress} style={[styles.container]}>

        </Pressable>
    )
}

export default TabItem


const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: "center",
        gap: 4
    }
})