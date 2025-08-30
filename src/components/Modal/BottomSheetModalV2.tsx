// BottomSheetModalV2.tsx
import React from 'react';
import {
	Modal,
	View,
	StyleSheet,
	TouchableWithoutFeedback,
	TouchableOpacity,
	ViewStyle,
} from 'react-native';
import { responsiveFontSize } from '../../utils/typographyUtils';
import { heightPercentageToDP } from '../../utils/resizing';
import { ThemeIcons } from '../../theme/Icons';

type BottomSheetModalProps = {
	children?: React.ReactNode;
	style?: ViewStyle;
	visible: boolean;
	onClose: () => void;
};

const SCREEN_HEIGHT = heightPercentageToDP('100');

const BottomSheetModalV2: React.FC<BottomSheetModalProps> = ({
	children,
	style,
	visible,
	onClose,
}) => {
	const overlayClosable = true;

	return (
		<Modal
			visible={visible}
			transparent
			animationType="slide"
			onRequestClose={() => overlayClosable && onClose()}
		>
			<TouchableWithoutFeedback onPress={() => overlayClosable && onClose()}>
				<View style={styles.overlay}>
					<TouchableWithoutFeedback>
						<View>
							<TouchableOpacity style={styles.closeIconContainer} onPress={onClose}>
								<ThemeIcons.CharmCross />
							</TouchableOpacity>
							<View style={[styles.bottomSheet, style]}>
								{children}
							</View>
						</View>
					</TouchableWithoutFeedback>
				</View>
			</TouchableWithoutFeedback>
		</Modal>
	);
};

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.5)',
		justifyContent: 'flex-end',
		alignItems: 'stretch',
	},
	bottomSheet: {
		backgroundColor: '#fff',
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		alignItems: 'center',
		justifyContent: 'flex-start',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: -2 },
		shadowOpacity: 0.2,
		shadowRadius: 8,
		elevation: 10,
		height: SCREEN_HEIGHT * 0.8,
		position: 'relative',
		overflow: 'hidden'
	},
	closeIconContainer: {
		position: 'absolute',
		top: -40,
		right: 12,
		zIndex: 2,
		padding: 8,
	},
	title: {
		fontSize: responsiveFontSize(18),
		fontWeight: '700',
		fontFamily: 'HelveticaNowDisplay-Black',
		textAlign: 'center',
		marginTop: 16,
		color: '#222',
	},
	brandName: {
		fontSize: responsiveFontSize(22),
		fontWeight: '700',
		fontFamily: 'HelveticaNowDisplay-Black',
		color: '#5F34F6',
		textAlign: 'center',
		marginBottom: 8,
	},
	subtitle: {
		fontSize: responsiveFontSize(14),
		color: '#444',
		fontFamily: 'HelveticaNowDisplay-Regular',
		textAlign: 'center',
		marginBottom: 24,
	},
	primaryButton: {
		width: '100%',
		backgroundColor: '#5F34F6',
		borderRadius: 16,
		paddingVertical: 14,
		alignItems: 'center',
		marginBottom: 12,
	},
	primaryButtonText: {
		color: '#fff',
		fontSize: responsiveFontSize(16),
		fontWeight: '700',
		fontFamily: 'HelveticaNowDisplay-Black',
	},
	outlineButton: {
		width: '100%',
		borderWidth: 1.5,
		borderColor: '#5F34F6',
		borderRadius: 16,
		paddingVertical: 14,
		alignItems: 'center',
		marginBottom: 0,
	},
	outlineButtonText: {
		color: '#5F34F6',
		fontSize: responsiveFontSize(16),
		fontWeight: '700',
		fontFamily: 'HelveticaNowDisplay-Black',
	},
});

export default BottomSheetModalV2;