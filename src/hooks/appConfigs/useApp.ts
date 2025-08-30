import { useEffect, useState } from "react";

import * as SplashScreen from 'expo-splash-screen';

import RootStore from '@/src/mobxStore/RootStore';
import { useLinkingActions } from './useLinkingActions';

export const useApp = () => {
    const [rootStore] = useState(RootStore)
    const [isLoadingComplete, setLoadingComplete] = useState(false);
    useLinkingActions()

    // const [loaded, error] = Font.useFonts({
    //     // Helvetica Now Display
    //     "HelveticaNowDisplay-Black": require("../../../assets/fonts/HelveticaNowDisplay-Black.ttf"),
    //     "HelveticaNowDisplay-Bold": require("../../../assets/fonts/HelveticaNowDisplay-Bold.ttf"),
    //     "HelveticaNowDisplay-ExtraBold": require("../../../assets/fonts/HelveticaNowDisplay-ExtraBold.ttf"),
    //     "HelveticaNowDisplay-Hairline": require("../../../assets/fonts/HelveticaNowDisplay-Hairline.ttf"),
    //     "HelveticaNowDisplay-Light": require("../../../assets/fonts/HelveticaNowDisplay-Light.ttf"),
    //     "HelveticaNowDisplay-Medium": require("../../../assets/fonts/HelveticaNowDisplay-Medium.ttf"),
    //     "HelveticaNowDisplay-Thin": require("../../../assets/fonts/HelveticaNowDisplay-Thin.ttf"),
    //     "HelveticaNowDisplay-Regular": require("../../../assets/fonts/HelveticaNowDisplay-Regular.ttf"),

    //     // Murs Gothic
    //     "MursGothic-WideDark": require("../../../assets/fonts/MursGothic-WideDark.otf"),

    //     // Palaroid
    //     "Palaroid": require("../../../assets/fonts/Palaroid.ttf"),
    // });

    // useEffect(() => {
    //     if (loaded || error) {
    //         SplashScreen.hideAsync();
    //     }
    // }, [loaded, error]);



    async function prepare() {
        try {
            await SplashScreen.preventAutoHideAsync(); // Keep splash screen visible
            // await NavigationBar.setBackgroundColorAsync('#000000')
        } catch (e) {
            console.warn(e);
        } finally {
            setLoadingComplete(true);
            await SplashScreen.hideAsync(); // Hide splash screen when assets are ready
        }
    }

    useEffect(() => {
        prepare();
    }, []);
    return { rootStore, error: false, loaded: true }
}