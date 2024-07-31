import {
    ModalProps,
    StyleProp,
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
    testID?: string;
    /**
     * Used when you want a different label displayed
     * on the input than what is displayed on the Picker
     *
     * If falsy, label is used
     */
    inputLabel?: string;
}

export interface PickerStyle {
    chevron?: StyleProp<ViewStyle>;
    chevronDark?: StyleProp<ViewStyle>;
    chevronActive?: StyleProp<ViewStyle>;
    chevronContainer?: StyleProp<ViewStyle>;
    chevronDown?: StyleProp<ViewStyle>;
    chevronUp?: StyleProp<ViewStyle>;
    done?: StyleProp<TextStyle>;
    doneDark?: StyleProp<TextStyle>;
    doneDepressed?: StyleProp<TextStyle>;
    headlessAndroidContainer?: StyleProp<ViewStyle>;
    headlessAndroidPicker?: StyleProp<ViewStyle>;
    iconContainer?: StyleProp<ViewStyle>;
    inputAndroid?: StyleProp<TextStyle>;
    inputAndroidContainer?: StyleProp<ViewStyle>;
    inputIOS?: StyleProp<TextStyle>;
    inputIOSContainer?: StyleProp<ViewStyle>;
    inputWeb?: StyleProp<TextStyle>;
    modalViewBottom?: StyleProp<ViewStyle>;
    modalViewBottomDark?: StyleProp<ViewStyle>;
    modalViewMiddle?: StyleProp<ViewStyle>;
    modalViewMiddleDark?: StyleProp<ViewStyle>;
    modalViewTop?: StyleProp<ViewStyle>;
    placeholder?: StyleProp<TextStyle>;
    viewContainer?: StyleProp<ViewStyle>;
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
    onClose?: (donePressed: boolean) => void;
    modalProps?: CustomModalProps;
    textInputProps?: CustomTextInputProps;
    pickerProps?: CustomPickerProps;
    touchableDoneProps?: CustomTouchableDoneProps;
    touchableWrapperProps?: CustomTouchableWrapperProps;
    Icon?: React.FC;
    InputAccessoryView?: React.ReactNode;
    darkTheme?: boolean;
    dropdownItemStyle?: StyleProp<ViewStyle>,
    activeItemStyle?: StyleProp<ViewStyle>,
}

declare class Picker extends React.Component<PickerSelectProps> {
    togglePicker: (animate?: boolean, postToggleCallback?: () => void) => void;
}

export default Picker;
