

import { isAndroid, screenWidth } from '@/src/utils/resizing';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';


export const TabBar = ({
    state,
    ...rest
}: BottomTabBarProps) => {
    const bottomInset = isAndroid ? 0 : 30
    return <></>
}

const styles = StyleSheet.create({
      container:{
        width: screenWidth,
        gap: screenWidth * 0.3,
        borderRadius:0, 
        height: 60, 
        justifyContent:'center', 
    backgroundColor:'#0a0a0a',
    }, 
    navbarBg:{
        width:'100%',
        position:'absolute', 
    }
})