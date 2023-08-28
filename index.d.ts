import {
    ModalProps,
    TextInputProps,
    TextStyle,
    TouchableOpacityProps,
    ViewStyle,
} from 'react-native';
import React from 'react';
import { PickerProps } from '@react-native-picker/picker/typings/Picker';

export interface Item {
    label: string;
    value: any;
    key?: string | number;
    color?: string;
    /**
     * Used when you want a different label displayed
     * on the input than what is displayed on the Picker
     *
     * If falsy, label is used
     */
    inputLabel?: string;
}

export interface PickerStyle {
    chevron?: ViewStyle;
    chevronDark?: ViewStyle;
    chevronActive?: ViewStyle;
    chevronContainer?: ViewStyle;
    chevronDown?: ViewStyle;
    chevronUp?: ViewStyle;
    done?: TextStyle;
    doneDark?: TextStyle;
    doneDepressed?: TextStyle;
    headlessAndroidContainer?: ViewStyle;
    headlessAndroidPicker?: ViewStyle;
    iconContainer?: ViewStyle;
    inputAndroid?: TextStyle;
    inputAndroidContainer?: ViewStyle;
    inputIOS?: TextStyle;
    inputIOSContainer?: ViewStyle;
    inputWeb?: TextStyle;
    modalViewBottom?: ViewStyle;
    modalViewBottomDark?: ViewStyle;
    modalViewMiddle?: ViewStyle;
    modalViewMiddleDark?: ViewStyle;
    modalViewTop?: ViewStyle;
    placeholder?: TextStyle;
    viewContainer?: ViewStyle;
}

type CustomModalProps = Omit<ModalProps, 'visible' | 'transparent' | 'animationType'>;
// 'testID', 'supportedOrientations', and 'onOrientationChange' are also used, but can be overwritten safely

type CustomTextInputProps = Omit<TextInputProps, 'style' | 'value' | 'ref' | 'editable'>;
// 'testID' is also used, but can be overwritten safely

type CustomPickerProps = Omit<PickerProps, 'onValueChange' | 'selectedValue'>;
// 'style' and 'enabled' are also used, but only in headless or native Android mode
// 'testID' is also used, but can be overwritten safely

type CustomTouchableDoneProps = Omit<TouchableOpacityProps, 'onPress'>;
// 'testID', 'onPressIn', 'onPressOut', and 'hitSlop' are also used, but can be overwritten safely

type CustomTouchableWrapperProps = Omit<TouchableOpacityProps, 'onPress'>;
// 'testID' and 'activeOpacity' are also used, but can be overwritten safely

export interface PickerSelectProps {
    onValueChange: (value: any, index: number) => void;
    items: Item[];
    value?: any;
    placeholder?: Item | {};
    disabled?: boolean;
    itemKey?: string | number;
    style?: PickerStyle;
    children?: React.ReactNode;
    onOpen?: () => void;
    useNativeAndroidPickerStyle?: boolean;
    fixAndroidTouchableBug?: boolean;
    doneText?: string;
    onDonePress?: () => void;
    onUpArrow?: () => void;
    onDownArrow?: () => void;
    onClose?: () => void;
    modalProps?: CustomModalProps;
    textInputProps?: CustomTextInputProps;
    pickerProps?: CustomPickerProps;
    touchableDoneProps?: CustomTouchableDoneProps;
    touchableWrapperProps?: CustomTouchableWrapperProps;
    Icon?: React.ReactNode;
    InputAccessoryView?: React.ReactNode;
    darkTheme?: boolean;
}

declare class Picker extends React.Component<PickerSelectProps> {
    togglePicker: (animate?: boolean, postToggleCallback?: () => void) => void;
}

export default Picker;
