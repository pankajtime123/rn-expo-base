
import { goBack } from "@/src/utils/NavigationUtils";
import { statusBarHeight } from "@/src/utils/resizing";
import { FC, ReactNode } from "react";
import { StyleSheet, ViewStyle } from "react-native";
import AppIcon from "../../ui/AppIcon/AppIcon";
import AppPressable from "../../ui/AppPressable/AppPressable";
import AppRow from "../../ui/AppRow/AppRow";
import AppText from "../../ui/AppText/AppText";

interface PageHeaderProps {
    style?: ViewStyle | ViewStyle[];
    leftItem?: ReactNode;
    centerItem?: ReactNode;
    rightItem?: ReactNode;
    layout?: 'default' | 'centered' | 'spaced';
    showLeft?: boolean;
    showCenter?: boolean;
    showRight?: boolean;
    onGoback?: VoidFunction
    onRightPress?: VoidFunction
    title?: string
}

const PageHeaderComponent: FC<PageHeaderProps> = ({
    style,
    leftItem,
    centerItem,
    rightItem,
    layout = 'default',
    showLeft = true,
    showCenter = false,
    showRight = false,
    onGoback,
    onRightPress, 
    title
}) => {
    const visibleItems = [
        showLeft ? leftItem : null,
        showCenter ? centerItem : null,
        showRight ? rightItem : null,
    ].filter(Boolean);

    const itemCount = visibleItems.length;

    const getLayoutStyle = (): ViewStyle => {
        if (layout === 'centered') {
            return { justifyContent: 'center' };
        }

        if (layout === 'spaced') {
            return { justifyContent: 'space-between' };
        }

        if (itemCount === 3) {
            return { justifyContent: 'space-between' };
        }

        if (itemCount === 2) {
            if (!showCenter) {
                return { justifyContent: 'space-between' };
            }
            return { justifyContent: 'center' };
        }

        return { justifyContent: 'center' };
    };


    const defaultLeftItem = showLeft && (
        <AppRow gap={16}>
            <AppPressable onPress={() => {
                if (onGoback) {
                    onGoback?.()
                } else {
                    goBack()
                }
            }}>
                <AppIcon iconCode="arrow-left" iconSet={'Feather'} size={20} color={'#000'} />
            </AppPressable>
           {title && <AppText type={'helveticaBlack20px'} color={'#fff'} style={[styles.title]} >
                {title}
            </AppText>}
        </AppRow>
    );

    const defaultCenterItem = showCenter && (<></>
        // <AppImage
        //     style={{ backgroundColor: 'transparent' }}
        //     resizeMode={'contain'}
        //     source={IMAGES.back_icon}
        // />
    );

    const defaultRightItem = showRight && <AppPressable onPress={() => {
        onRightPress?.()
    }} >
        {/* <GearSix size={24} color={'#707070'} weight={'bold'} /> */}
    </AppPressable>



    return (
        <AppRow style={[styles.container, getLayoutStyle(), StyleSheet.flatten(style)]} backgroundColor={'transparent'}>
            {(showLeft && (leftItem ?? defaultLeftItem)) || null}
            {(showCenter && (centerItem ?? defaultCenterItem)) || null}
            {(showRight && (rightItem ?? defaultRightItem)) || null}
        </AppRow>
    );
};

const PageHeader = Object.assign(PageHeaderComponent, {
    Default: (props: Omit<PageHeaderProps, 'layout'>) => <PageHeaderComponent {...props} layout="default" />,
    Centered: (props: Omit<PageHeaderProps, 'layout'>) => <PageHeaderComponent {...props} layout="centered" />,
    Spaced: (props: Omit<PageHeaderProps, 'layout'>) => <PageHeaderComponent {...props} layout="spaced" />,
});

export default PageHeader;

const styles = StyleSheet.create({
    container: {
        marginTop: statusBarHeight,
        padding: 16,
        alignItems: 'center',
    },
    title: {

    }
});

