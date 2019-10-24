// / <reference types="react" />

declare module 'react-native-picker-select' {
    export interface Item {
        label: string;
        value: any;
        key?: string | number;
        color?: string;
    }
    export interface PickerProps {
        onValueChange: (value: any, index: number) => void;
        items: Item[];
        value?: any;
        placeholder?: Item | {};
        disabled?: boolean;
        itemKey?: string | number;
        style?: object;
        children?: any;
        placeholderTextColor?: string; // deprecated
        useNativeAndroidPickerStyle?: boolean;
        hideDoneBar?: boolean; // deprecated
        doneText?: string;
        onDonePress?: () => void;
        onUpArrow?: () => void;
        onDownArrow?: () => void;
        onOpen?: () => void;
        onClose?: () => void;
        modalProps?: object;
        textInputProps?: object;
        pickerProps?: object;
        Icon?: React.ReactNode;
        InputAccessoryView?: React.ReactNode;
    }
    class Picker extends React.Component<PickerProps> {}
    export default Picker;
}
