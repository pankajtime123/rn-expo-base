 


import Constants from "expo-constants";
import React, { useEffect, useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import RNNL, { startNetworkLogging } from 'react-native-network-logger';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height

export const NetworkLoggerWrapper = () => {

    const [showLogger, setShowLogger] = useState(false);
    const [showLoggerBtn, setShowLoggerBtn] = useState(true)

    const containerStyle: ViewStyle = {
        height: showLogger ? height : 25,
        overflow: showLogger ? 'visible' : 'hidden',
        width: showLogger ? width : 170,
        backgroundColor: showLogger ? '#fff' : 'transparent',
    }

    const toggleLogger = () => {
        setShowLogger(!showLogger);
    };

    useEffect(() => {
        startNetworkLogging();
    }, []);

    if (!__DEV__) {
        return <></>
    }

    if (!showLoggerBtn) {
        return <></>
    }


    return (
        <View
            style={[
                styles.container, containerStyle]}>
            <View
                style={styles.nlButton}>
                <Pressable style={styles.topBar} onPress={toggleLogger}>
                    <Text style={{ textAlign: 'center', color: 'black', fontSize: 12 }}>
                        🌐  NL  📶
                    </Text>
                </Pressable>
                <Pressable onPress={() => setShowLoggerBtn(false)} style={[styles.topBar, { paddingHorizontal: 4, }]}>
                    <Text style={{  fontSize: 6, padding: 1 }} >
                        ❌
                    </Text>
                </Pressable>
            </View>
            {showLogger && (
                <View style={styles.logger}>
                    <RNNL />
                    <View style={styles.actions}>
                        <Pressable style={styles.actionButton} onPress={toggleLogger}>
                            <Text>
                                ❌
                            </Text>
                        </Pressable>
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    nlButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16
    },
    container: {
        position: 'absolute',
        top: 0,
        width: 80,
        height: 30,
        backgroundColor: 'white',
        borderRadius: 15,
        alignSelf: 'center',
        zIndex: 999,
        marginTop: Constants.statusBarHeight
    },
    topBar: {
        borderRadius: 15,
        backgroundColor: '#fff',
        paddingHorizontal: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    logger: {
        position: 'absolute',
        height: height,
        width: width,
        paddingBottom: 100,
    },
    actionButton: {
        height: 25,
        width: 25,
        borderRadius: 17.5,
        justifyContent: 'center',
        alignContent: 'center',
        marginVertical: 10,
    },
    actions: {
        position: 'absolute',
        width: 80,
        top: 30,
        right: 0,
        height: 35,
        borderColor: 'grey',
        borderWidth: 1,
        borderRightWidth: 0,
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
});
