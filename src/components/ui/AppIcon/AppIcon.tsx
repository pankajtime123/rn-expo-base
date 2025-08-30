import React, { PureComponent } from 'react';
import AntDesignI from 'react-native-vector-icons/AntDesign';
import EntypoI from 'react-native-vector-icons/Entypo';
import EvilIconsI from 'react-native-vector-icons/EvilIcons';
import FeatherI from 'react-native-vector-icons/Feather';
import FontAwesomeI from 'react-native-vector-icons/FontAwesome';
import FontistoI from 'react-native-vector-icons/Fontisto';
import FoundationI from 'react-native-vector-icons/Foundation';
import IoniconsI from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIconsI from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIconsI from 'react-native-vector-icons/MaterialIcons';
import OcticonsI from 'react-native-vector-icons/Octicons';
import SimpleLineIconsI from 'react-native-vector-icons/SimpleLineIcons';
import ZocialI from 'react-native-vector-icons/Zocial';

interface PropTypes {
    iconCode?: string,
    iconColor?: string,
    iconSize?: number,
    iconSet?: string,
    code?: string,
    color?: string,
    size?: number,
    set?: string,
    iconStyling?: any,
    style?: any,
    fontWeight?: string,
    onPress?: () => void
};

export default class AppIcon extends PureComponent<PropTypes> {

    constructor(props: PropTypes) {
        super(props);
    }

    iconFamilies: Record<string, any> = {
        MaterialCommunityIcons: MaterialCommunityIconsI,
        SimpleLineIcons: SimpleLineIconsI,
        MaterialIcons: MaterialIconsI,
        FontAwesome: FontAwesomeI,
        Foundation: FoundationI,
        EvilIcons: EvilIconsI,
        Octicons: OcticonsI,
        Ionicons: IoniconsI,
        Feather: FeatherI,
        Entypo: EntypoI,
        Zocial: ZocialI,
        AntDesign: AntDesignI,
        Fontisto: FontistoI,
    };

    render() {
        const {
            iconCode,
            iconColor,
            iconSize,
            iconSet,
            iconStyling,
            fontWeight, 
            style,
            code,
            color,
            size,
            set,
            ...otherProps
        } = this.props;
        const IconComponent = this.iconFamilies[iconSet || set as string];
        const iconProps = { name: iconCode || code, size: iconSize || size, color: iconColor || color };
        return (
            <IconComponent
                {...otherProps}
                {...iconProps}
                style={{ fontWeight: fontWeight || 'bold', ...(iconStyling || style) }}
            />
        );
    }
}
