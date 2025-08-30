import DeviceInfo from "react-native-device-info";
import { isAndroid } from "./resizing";

export const getDeviceId = async () => {
    const deviceIdIOS = await DeviceInfo.getUniqueId();
    const deviceIdAndroid = await DeviceInfo.getInstanceId()
    const deviceId = isAndroid ? deviceIdAndroid : deviceIdIOS

    return deviceId
}