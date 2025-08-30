import { useEffect, useState } from "react";
import { Keyboard } from "react-native";
import { isAndroid, screenInsets } from "../utils/resizing";

export const useKeyboard = ()=>{
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false)

    const bottomInsetFallback = isAndroid ? 48 : 34;
    const bottomInset = screenInsets?.bottom ?? bottomInsetFallback;

    const isKeyboardVisible = isAndroid ? isKeyboardOpen : false;
    const androidOffset = isKeyboardVisible ? 0 : bottomInset;
    const iosOffset = bottomInset + (screenInsets?.top || 0);
    const keyboardVerticalOffset = isAndroid ? androidOffset : iosOffset;

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setIsKeyboardOpen(true)
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setIsKeyboardOpen(false)
        });
    
        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);

    return {
        isKeyboardOpen, 
        setIsKeyboardOpen, 
        keyboardVerticalOffset, 
        bottomInset
    }
}