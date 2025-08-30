import React, { useEffect } from 'react';
import {
  BackHandler,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ViewStyle
} from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView
} from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store/store';
import { hideBottomsheetModal } from '../../store/bottomsheetModalSlice';
import { ThemeIcons } from '../../theme/Icons';
import { heightPercentageToDP } from '../../utils/resizing';
import { responsiveFontSize } from '../../utils/typographyUtils';

const SCREEN_HEIGHT = heightPercentageToDP('100');

type BottomSheetModalProps = {
  children?: React.ReactNode;
  style?: ViewStyle;
};

const BottomSheetModal: React.FC<BottomSheetModalProps> = ({ children, style }) => {
  const dispatch = useDispatch();
  const { visible } = useSelector((state: RootState) => state.bottomsheetModal);
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const overlayClosable = true;
  const scrollOffset = useSharedValue(0);

  const close = () => {
    translateY.value = withSpring(SCREEN_HEIGHT);
    setTimeout(() => dispatch(hideBottomsheetModal()), 300);
  };

  const open = () => {
    translateY.value = withSpring(0, {
      damping: 30,
      stiffness: 200,
    });
  };

  useEffect(() => {
    if (visible) open();
    else translateY.value = SCREEN_HEIGHT;
  }, [visible]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (visible) {
        close();
        return true;
      }
      return false;
    });
    return () => backHandler.remove();
  }, [visible]);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (scrollOffset.value <= 0 && event.translationY > 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd(() => {
      if (translateY.value > SCREEN_HEIGHT * 0.5) {
        close();
      } else {
        translateY.value = withSpring(SCREEN_HEIGHT, {
          damping: 30,
          stiffness: 200,
        });
      }
    });

  const animatedSheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const animatedOverlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateY.value, [0, SCREEN_HEIGHT], [1, 0]),
  }));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={() => overlayClosable && close()}
    >
      <GestureHandlerRootView style={{ flex: 1, marginBottom: 20 }}>
        <Animated.View style={[styles.overlay, animatedOverlayStyle]}>
          <TouchableOpacity
            activeOpacity={1}
            style={StyleSheet.absoluteFill}
            onPress={() => overlayClosable && close()}
          />
        </Animated.View>
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.bottomSheet, animatedSheetStyle, style]}>
            <TouchableOpacity style={styles.closeIconContainer} onPress={close}>
              <ThemeIcons.CharmCross />
            </TouchableOpacity>
            {children}
          </Animated.View>
        </GestureDetector>
      </GestureHandlerRootView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: SCREEN_HEIGHT * 0.8,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 2,
  },
  closeIconContainer: {
    position: 'absolute',
    top: -40,
    right: 12,
    zIndex: 3,
    padding: 8,
  },
  title: {
    fontSize: responsiveFontSize(18),
    fontWeight: '700',
    fontFamily: 'HelveticaNowDisplay-Black',
    textAlign: 'center',
    color: '#222',
    marginTop: 16,
  },
});

export default BottomSheetModal;