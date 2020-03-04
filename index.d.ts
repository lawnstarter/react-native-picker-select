import { ViewStyle, TextStyle, ModalProps, TextInputProperties, PickerProps } from 'react-native';
import React from 'react';

export interface Item {
    label: string;
    value: any;
    key?: string | number;
    color?: string;
}
export interface PickerStyle {
    chevron?: ViewStyle;
    chevronActive?: ViewStyle;
    chevronContainer?: ViewStyle;
    chevronDown?: ViewStyle;
    chevronUp?: ViewStyle;
    done?: TextStyle;
    headlessAndroidContainer?: ViewStyle;
    headlessAndroidPicker?: ViewStyle;
    iconContainer?: ViewStyle;
    inputAndroid?: TextStyle;
    inputAndroidContainer?: ViewStyle;
    inputIOS?: TextStyle;
    inputIOSContainer?: ViewStyle;
    modalViewBottom?: ViewStyle;
    modalViewMiddle?: ViewStyle;
    modalViewTop?: ViewStyle;
    placeholder?: TextStyle;
    viewContainer?: ViewStyle;
}

// Omit props needed by the library
type PickerModalProps = Omit<
    ModalProps,
    | 'testID'
    | 'visible'
    | 'transparent'
    | 'animationType'
    | 'supportedOrientations'
    | 'onDismiss'
    | 'onOrientationChange'
>;

export interface PickerSelectProps {
    onValueChange: (value: any, index: number) => void;
    items: Item[];
    value?: any;
    placeholder?: Item | {};
    disabled?: boolean;
    itemKey?: string | number;
    style?: PickerStyle;
    children?: React.ReactNode;
    placeholderTextColor?: string; // deprecated
    useNativeAndroidPickerStyle?: boolean;
    hideDoneBar?: boolean; // deprecated
    doneText?: string;
    onDonePress?: () => void;
    onUpArrow?: () => void;
    onDownArrow?: () => void;
    onOpen?: () => void;
    onClose?: () => void;
    modalProps?: PickerModalProps;
    textInputProps?: TextInputProperties;
    pickerProps?: PickerProps;
    Icon?: React.ReactNode;
    InputAccessoryView?: React.ReactNode;
}

declare class Picker extends React.Component<PickerSelectProps> {}
export default Picker;
