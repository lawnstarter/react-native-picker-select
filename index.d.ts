/// <reference types="react" />

declare module 'react-native-picker-select' {
    export interface Item {
        label: string;
        value: any;
        key?: string;
        color?: string;
    }
    type ModeOptions = 'dialog' | 'dropdown';
    export interface PickerProps {
        onValueChange: (value: any, index: number) => void;
        items: Item[];
        placeholder?: Item | {};
        disabled?: boolean;
        value?: any;
        itemKey?: string | number;
        style?: object;
        hideIcon?: boolean;
        hideDoneBar?: boolean;
        onUpArrow?: () => void;
        onDownArrow?: () => void;
        mode?: ModeOptions;
        onDonePress?: () => void;
    }
    class Picker extends React.Component<PickerProps> {}
    export default Picker;
}
