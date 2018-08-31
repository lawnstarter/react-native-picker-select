/// <reference types="react" />

declare module 'react-native-picker-select' {
    export interface Item {
        label: string;
        value: string | number;
        key?: string;
        color?: string;
    }
    type ModeOptions = 'dialog' | 'dropdown';
    export interface PickerProps {
        onValueChange: (value: string | number, index: number) => void;
        items: Item[];
        placeholder?: Item | {};
        disabled?: boolean;
        value?: string | number;
        itemKey?: string | number;
        style?: object;
        hideIcon?: boolean;
        hideDoneBar?: boolean;
        onUpArrow?: () => void;
        onDownArrow?: () => void;
        mode?: ModeOptions;
    }
    class Picker extends React.Component<PickerProps> {}
    export default Picker;
}
