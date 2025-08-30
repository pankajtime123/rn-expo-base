// Haptics.ts
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { Platform } from 'react-native';

type HapticType =
  | 'impactLight'
  | 'impactMedium'
  | 'impactHeavy'
  | 'rigid'
  | 'soft'
  | 'notificationSuccess'
  | 'notificationWarning'
  | 'notificationError'
  | 'selection'
  | 'clockTick'
  | 'contextClick'
  | 'keyboardPress'
  | 'keyboardRelease'
  | 'keyboardTap'
  | 'longPress'
  | 'textHandleMove'
  | 'virtualKey'
  | 'virtualKeyRelease'
  | 'effectClick'
  | 'effectDoubleClick'
  | 'effectHeavyClick'
  | 'effectTick';

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

const supportedHaptics: Record<'android' | 'ios', Set<HapticType>> = {
  android: new Set([
    'impactLight',
    'impactMedium',
    'impactHeavy',
    'rigid',
    'soft',
    'notificationSuccess',
    'notificationWarning',
    'notificationError',
    'clockTick',
    'contextClick',
    'keyboardPress',
    'keyboardRelease',
    'keyboardTap',
    'longPress',
    'textHandleMove',
    'virtualKey',
    'virtualKeyRelease',
    'effectClick',
    'effectDoubleClick',
    'effectHeavyClick',
    'effectTick',
  ]),
  ios: new Set([
    'impactLight',
    'impactMedium',
    'impactHeavy',
    'rigid',
    'soft',
    'notificationSuccess',
    'notificationWarning',
    'notificationError',
    'selection',
  ]),
};

class Haptics {
  static trigger(type: HapticType) {
    const platform = Platform.OS;

    if (platform !== 'ios' && platform !== 'android') {
      console.warn(`[Haptics] Unsupported platform: ${platform}`);
      return;
    }

    if (!supportedHaptics[platform].has(type)) {
      if (__DEV__) {
        console.warn(`[Haptics] '${type}' is not supported on ${platform.toUpperCase()}`);
      }
      return;
    }

    try {
      ReactNativeHapticFeedback.trigger(type, options);
    } catch (error) {
      console.error(`[Haptics] Failed to trigger haptic feedback for '${type}':`, error);
    }
  }
}

export default Haptics;
