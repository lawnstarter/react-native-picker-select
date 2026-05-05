import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { Keyboard, Platform } from 'react-native';

import RNPickerSelect from '../src';

jest.mock('@react-native-picker/picker', () => {
    const React = require('react');
    const { View, Text } = require('react-native');

    function MockPicker({ testID, onValueChange, children }) {
        return (
            <View testID={testID} onValueChange={onValueChange}>
                {children}
            </View>
        );
    }

    MockPicker.Item = function PickerItem({ label, value, style, testID: itemTestID }) {
        return (
            <Text
                testID={itemTestID !== undefined ? itemTestID : `picker_item_${String(value)}`}
                style={style}
            >
                {label}
            </Text>
        );
    };

    return { Picker: MockPicker };
});

const selectItems = [
    { label: 'Red', value: 'red' },
    { label: 'Orange', value: 'orange' },
    { label: 'Yellow', value: 'yellow' },
    { label: 'Green', value: 'green' },
    { label: 'Blue', value: 'blue' },
    { label: 'Indigo', value: 'indigo' },
];

const objectSelectItems = [
    { label: 'Red', value: { label: 'red' } },
    { label: 'Orange', value: { label: 'orange' } },
    { label: 'Yellow', value: { label: 'yellow' } },
    { label: 'Green', value: { label: 'green' } },
    { label: 'Blue', value: { label: 'blue' } },
    { label: 'Indigo', value: { label: 'indigo' } },
];

const violet = { label: 'Violet', value: 'violet' };

const placeholder = {
    label: 'Select a color...',
    value: null,
};

const noop = () => {};

const openPicker = () => fireEvent.press(screen.getByTestId('ios_touchable_wrapper'));

describe('RNPickerSelect', () => {
    beforeEach(() => {
        jest.resetAllMocks();
        jest.spyOn(Keyboard, 'dismiss');
        Platform.OS = 'ios';
    });

    describe('when provided an itemKey prop', () => {
        it('sets the selected item via key rather than value', () => {
            const items = [
                { label: '+1 Canada', value: 1, key: 'canada' },
                { label: '+1 USA', value: 1, key: 'usa' },
            ];

            render(
                <RNPickerSelect
                    items={items}
                    placeholder={placeholder}
                    itemKey="usa"
                    value={1}
                    onValueChange={noop}
                />
            );

            expect(screen.getByTestId('text_input').props.value).toEqual('+1 USA');
        });
    });

    it('should set the selected value to state', () => {
        render(
            <RNPickerSelect items={selectItems} placeholder={placeholder} onValueChange={noop} />
        );

        openPicker();
        fireEvent(screen.getByTestId('ios_picker'), 'onValueChange', 'orange', 2);
        fireEvent(screen.getByTestId('ios_picker'), 'onValueChange', 'yellow', 3);

        expect(screen.getByTestId('text_input').props.value).toEqual('Yellow');
    });

    it('should not return the default InputAccessoryView if custom component is passed in', () => {
        const { View } = require('react-native');
        render(
            <RNPickerSelect
                items={selectItems}
                placeholder={placeholder}
                onValueChange={noop}
                InputAccessoryView={(props) => <View {...props} />}
            />
        );

        openPicker();
        expect(screen.queryByTestId('input_accessory_view')).toBeNull();
        expect(screen.getByTestId('custom_input_accessory_view')).toBeTruthy();
    });

    it('should update the orientation state when onOrientationChange is called', () => {
        render(<RNPickerSelect items={[]} onValueChange={noop} />);

        openPicker();
        fireEvent(screen.getByTestId('ios_modal'), 'orientationChange', {
            nativeEvent: { orientation: 'landscape' },
        });

        expect(screen.getByTestId('ios_modal')).toBeTruthy();
    });

    it('should handle an empty items array', () => {
        render(<RNPickerSelect items={[]} placeholder={{}} onValueChange={noop} />);

        expect(screen.queryAllByTestId(/^picker_item_/).length).toEqual(0);
    });

    it('should return the expected option to a callback passed into onSelect', () => {
        const onValueChangeSpy = jest.fn();
        render(
            <RNPickerSelect
                items={selectItems}
                placeholder={placeholder}
                onValueChange={onValueChangeSpy}
            />
        );

        openPicker();
        fireEvent(screen.getByTestId('ios_picker'), 'onValueChange', 'orange', 2);
        expect(onValueChangeSpy).toHaveBeenCalledWith('orange', 2);
    });

    it('should return the expected option to a callback passed into onSelect when the value is an object', () => {
        const onValueChangeSpy = jest.fn();
        render(
            <RNPickerSelect
                items={objectSelectItems}
                placeholder={placeholder}
                onValueChange={onValueChangeSpy}
            />
        );

        openPicker();
        fireEvent(
            screen.getByTestId('ios_picker'),
            'onValueChange',
            objectSelectItems[5].value,
            5
        );
        expect(onValueChangeSpy).toHaveBeenCalledWith(objectSelectItems[5].value, 5);
    });

    it('should show the picker when pressed', () => {
        render(
            <RNPickerSelect items={selectItems} placeholder={placeholder} onValueChange={noop} />
        );

        openPicker();
        expect(screen.getByTestId('ios_modal').props.visible).toEqual(true);
    });

    it('should not show the picker when pressed if disabled', () => {
        render(
            <RNPickerSelect
                items={selectItems}
                placeholder={placeholder}
                onValueChange={noop}
                disabled
            />
        );

        fireEvent.press(screen.getByTestId('ios_touchable_wrapper'));
        expect(screen.queryByTestId('ios_modal')).toBeNull();
    });

    it('should show the value "RED" in the TextInput instead of the label "Red" when the inputLabel is set', () => {
        const items = [
            { label: 'Red', value: 'red', inputLabel: 'RED' },
            { label: 'Orange', value: 'orange' },
        ];

        render(
            <RNPickerSelect items={items} placeholder={{}} onValueChange={noop} value="red" />
        );

        expect(screen.getByTestId('text_input').props.value).toEqual('RED');
    });

    it('should update the selected value when the `value` prop updates and call the onValueChange cb', () => {
        const onValueChangeSpy = jest.fn();
        const { rerender } = render(
            <RNPickerSelect
                items={selectItems}
                placeholder={{}}
                onValueChange={onValueChangeSpy}
                value="red"
            />
        );

        expect(screen.getByTestId('text_input').props.value).toEqual('Red');

        rerender(
            <RNPickerSelect
                items={selectItems}
                placeholder={{}}
                onValueChange={onValueChangeSpy}
                value="orange"
            />
        );
        expect(onValueChangeSpy).toBeCalledWith('orange', 1);
        expect(screen.getByTestId('text_input').props.value).toEqual('Orange');

        rerender(
            <RNPickerSelect
                items={selectItems}
                placeholder={{}}
                onValueChange={onValueChangeSpy}
                value="yellow"
            />
        );
        expect(onValueChangeSpy).toBeCalledWith('yellow', 2);
        expect(screen.getByTestId('text_input').props.value).toEqual('Yellow');
    });

    it('should update the items when the `items` prop updates', () => {
        const { rerender } = render(
            <RNPickerSelect items={selectItems} placeholder={placeholder} onValueChange={noop} />
        );

        openPicker();
        // 6 items + 1 placeholder
        expect(screen.queryAllByTestId(/^picker_item_/).length).toEqual(7);

        rerender(
            <RNPickerSelect
                items={selectItems.concat([violet])}
                placeholder={placeholder}
                onValueChange={noop}
            />
        );
        expect(screen.queryAllByTestId(/^picker_item_/).length).toEqual(8);
    });

    it('should handle having no placeholder', () => {
        render(<RNPickerSelect items={selectItems} placeholder={{}} onValueChange={noop} />);

        openPicker();
        expect(screen.queryAllByTestId(/^picker_item_/).length).toEqual(6);
    });

    it('should show the icon container when the Icon prop receives a component', () => {
        const { View } = require('react-native');
        render(
            <RNPickerSelect
                items={selectItems}
                onValueChange={noop}
                Icon={() => <View />}
            />
        );

        expect(screen.getByTestId('icon_container')).toBeTruthy();
    });

    it('should not show the icon container when the Icon prop is empty', () => {
        render(<RNPickerSelect items={selectItems} onValueChange={noop} />);

        expect(screen.queryByTestId('icon_container')).toBeNull();
    });

    it('should call Keyboard.dismiss when opened', () => {
        render(<RNPickerSelect items={selectItems} onValueChange={noop} />);

        openPicker();

        expect(Keyboard.dismiss).toHaveBeenCalledTimes(1);
    });

    it("should reset to the first item (typically the placeholder) if a value is passed in that doesn't exist in the `items` array", () => {
        const { rerender } = render(
            <RNPickerSelect
                items={selectItems}
                placeholder={placeholder}
                onValueChange={noop}
                value={undefined}
            />
        );

        openPicker();
        fireEvent(screen.getByTestId('ios_picker'), 'onValueChange', 'orange', 2);
        expect(screen.getByTestId('text_input').props.value).toEqual('Orange');

        rerender(
            <RNPickerSelect
                items={selectItems}
                placeholder={placeholder}
                onValueChange={noop}
                value="violet"
            />
        );
        expect(screen.getByTestId('text_input').props.value).toEqual(placeholder.label);
    });

    it('should set the selected value to state (Android)', () => {
        Platform.OS = 'android';
        const onValueChange = jest.fn();
        render(<RNPickerSelect items={selectItems} onValueChange={onValueChange} />);

        fireEvent(screen.getByTestId('android_picker'), 'onValueChange', 'orange', 2);
        expect(onValueChange).toHaveBeenCalledWith('orange', 2);
    });

    it('should render the headless component when a child is passed in (Android)', () => {
        Platform.OS = 'android';
        const { View } = require('react-native');
        render(
            <RNPickerSelect items={selectItems} onValueChange={noop}>
                <View />
            </RNPickerSelect>
        );

        expect(screen.getByTestId('android_picker_headless')).toBeTruthy();
    });

    it('should set the selected value to state (Web)', () => {
        Platform.OS = 'web';
        const onValueChange = jest.fn();
        render(<RNPickerSelect items={selectItems} onValueChange={onValueChange} />);

        fireEvent(screen.getByTestId('web_picker'), 'onValueChange', 'orange', 2);
        expect(onValueChange).toHaveBeenCalledWith('orange', 2);
    });

    it('should call the onDonePress callback when set (iOS)', () => {
        Platform.OS = 'ios';
        const onDonePressSpy = jest.fn();
        render(
            <RNPickerSelect
                items={selectItems}
                onValueChange={noop}
                onDonePress={onDonePressSpy}
            />
        );

        openPicker();
        fireEvent.press(screen.getByTestId('done_button'));

        expect(onDonePressSpy).toHaveBeenCalledTimes(1);
    });

    it('should update the Done styling during a press (iOS)', () => {
        Platform.OS = 'ios';
        render(<RNPickerSelect items={selectItems} onValueChange={noop} />);

        openPicker();
        const doneButton = screen.getByTestId('done_button');
        const doneText = screen.getByTestId('done_text');

        const stylesBefore = doneText.props.style;
        fireEvent(doneButton, 'pressIn');
        expect(doneText.props.style).not.toEqual(stylesBefore);

        fireEvent(doneButton, 'pressOut');
        expect(doneText.props.style).toEqual(stylesBefore);
    });

    it('should call the onShow callback when set (iOS)', () => {
        Platform.OS = 'ios';
        const onShowSpy = jest.fn();
        render(
            <RNPickerSelect
                items={selectItems}
                onValueChange={noop}
                modalProps={{ onShow: onShowSpy }}
            />
        );

        openPicker();
        fireEvent(screen.getByTestId('ios_modal'), 'show');
        expect(onShowSpy).toHaveBeenCalledWith();
    });

    it('should call the onDismiss callback when set (iOS)', () => {
        Platform.OS = 'ios';
        const onDismissSpy = jest.fn();
        render(
            <RNPickerSelect
                items={selectItems}
                onValueChange={noop}
                modalProps={{ onDismiss: onDismissSpy }}
            />
        );

        openPicker();
        fireEvent(screen.getByTestId('ios_modal'), 'dismiss');
        expect(onDismissSpy).toHaveBeenCalledWith();
    });

    it('should call the onOpen callback when set (iOS)', () => {
        Platform.OS = 'ios';
        const onOpenSpy = jest.fn();
        render(
            <RNPickerSelect items={selectItems} onValueChange={noop} onOpen={onOpenSpy} />
        );

        openPicker();
        expect(onOpenSpy).toHaveBeenCalledWith();
    });

    it('should call the onOpen callback when set (Android)', () => {
        Platform.OS = 'android';
        const onOpenSpy = jest.fn();
        render(
            <RNPickerSelect
                items={selectItems}
                onValueChange={noop}
                onOpen={onOpenSpy}
                useNativeAndroidPickerStyle={false}
            />
        );

        fireEvent.press(screen.getByTestId('android_touchable_wrapper'));
        expect(onOpenSpy).toHaveBeenCalledWith();
    });

    it('should use a View when fixAndroidTouchableBug=true (Android)', () => {
        Platform.OS = 'android';
        render(
            <RNPickerSelect
                items={selectItems}
                onValueChange={noop}
                useNativeAndroidPickerStyle={false}
                fixAndroidTouchableBug
            />
        );

        const touchable = screen.getByTestId('android_touchable_wrapper');
        expect(touchable.type).toBe('View');
    });

    it('should call the onClose callback when set', () => {
        Platform.OS = 'ios';
        const onCloseSpy = jest.fn();
        render(
            <RNPickerSelect items={selectItems} onValueChange={noop} onClose={onCloseSpy} />
        );

        openPicker();
        fireEvent.press(screen.getByTestId('done_button'));

        expect(onCloseSpy).toHaveBeenCalledWith(true);
    });

    it('should close the modal when the empty area above the picker is tapped', () => {
        render(<RNPickerSelect items={selectItems} onValueChange={noop} />);

        openPicker();
        expect(screen.getByTestId('ios_modal').props.visible).toEqual(true);

        fireEvent.press(screen.getByTestId('ios_modal_top'));
        expect(screen.queryByTestId('ios_modal')).toBeNull();
    });

    it('should use the dark theme when `darkTheme` prop is provided on iOS', () => {
        Platform.OS = 'ios';
        render(<RNPickerSelect items={selectItems} onValueChange={noop} darkTheme />);

        openPicker();
        const inputAccessoryView = screen.getByTestId('input_accessory_view');
        const styles = inputAccessoryView.props.style;
        const merged = Array.isArray(styles) ? Object.assign({}, ...styles) : styles;
        expect(merged.backgroundColor).toEqual('#232323');
    });

    it('should apply custom styles to dropdown items', () => {
        const customDropdownItemStyle = { backgroundColor: '#d0d4da', color: '#000' };

        render(
            <RNPickerSelect
                items={selectItems}
                placeholder={placeholder}
                onValueChange={noop}
                dropdownItemStyle={customDropdownItemStyle}
            />
        );

        openPicker();
        expect(screen.getByTestId('picker_item_red').props.style).toEqual(customDropdownItemStyle);
    });

    it('should apply custom styles to the active dropdown item', () => {
        const customActiveItemStyle = { backgroundColor: '#d0d4da', color: '#000' };
        const items = [
            { label: 'Item 1', value: 'item1', key: '1' },
            { label: 'Item 2', value: 'item2', key: '2' },
        ];
        const localPlaceholder = { label: 'Select an item...', value: null };

        render(
            <RNPickerSelect
                items={items}
                placeholder={localPlaceholder}
                onValueChange={noop}
                activeItemStyle={customActiveItemStyle}
                value="item2"
            />
        );

        openPicker();
        expect(screen.getByTestId('picker_item_item2').props.style).toEqual(customActiveItemStyle);
    });

    // TODO - fix
    xdescribe('getDerivedStateFromProps', () => {
        it('should return null when nothing changes', () => {});
        it('should return a new items state when the items change', () => {});
        it('should return a new items state when the placeholder changes', () => {});
        it('should return a new selectedItem state when the value changes', () => {});
    });
});
