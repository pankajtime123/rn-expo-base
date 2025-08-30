import AppText from '@/src/components/ui/AppText/AppText'
import withRootStore from '@/src/HOCs/withRootStore'
import { PropsWithStore } from '@/src/mobxStore/RootStore'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useSplash } from './hooks/useSplash'

const SplashScreen = ({ rootStore }: PropsWithStore<{}>) => {
    useSplash(rootStore!)
    return (
        <View style={styles.container}>
            <StatusBar hidden />
            <AppText textAlign='center' type={'helveticaBlack24px'} >
                {'base'}
            </AppText>
        </View>
    )
}

export default withRootStore(SplashScreen)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent:'center',
        alignItems: 'center'
    },
    video: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    textSplash: {
        fontSize: 24,
        color: '#fff',
        fontWeight: 700
    },
    logo: {
        height: 120,
        width: 120
    }
})