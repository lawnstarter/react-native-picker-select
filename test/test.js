import React from 'react';
import { Platform, Keyboard, View } from 'react-native';
import RNPickerSelect from '../src/';

const selectItems = [
    {
        label: 'Red',
        value: 'red',
    },
    {
        label: 'Orange',
        value: 'orange',
    },
    {
        label: 'Yellow',
        value: 'yellow',
    },
    {
        label: 'Green',
        value: 'green',
    },
    {
        label: 'Blue',
        value: 'blue',
    },
    {
        label: 'Indigo',
        value: 'indigo',
    },
];

const violet = { label: 'Violet', value: 'violet' };

const placeholder = {
    label: 'Select a color...',
    value: null,
};

describe('RNPickerSelect', () => {
    beforeEach(() => {
        // jest.useFakeTimers();
        jest.resetAllMocks();
        jest.spyOn(Keyboard, 'dismiss');
    });

    describe('when provided an itemKey prop', () => {
        it('sets the selected item via key rather than value', () => {
            const items = [
                {
                    label: '+1 Canada',
                    value: 1,
                    key: 'canada',
                },
                {
                    label: '+1 USA',
                    value: 1,
                    key: 'usa',
                },
            ];

            const wrapper = shallow(
                <RNPickerSelect
                    items={items}
                    placeholder={placeholder}
                    itemKey="usa"
                    value={1}
                    onValueChange={() => {}}
                />
            );

            expect(wrapper.state().selectedItem.key).toEqual('usa');
        });
    });

    it('should set the selected value to state', () => {
        const wrapper = shallow(
            <RNPickerSelect
                items={selectItems}
                placeholder={placeholder}
                onValueChange={() => {}}
            />
        );

        wrapper
            .find('[testID="ios_picker"]')
            .props()
            .onValueChange('orange', 2);
        wrapper
            .find('[testID="ios_picker"]')
            .props()
            .onValueChange('yellow', 3);
        expect(wrapper.state().selectedItem.value).toEqual('yellow');
    });

    it('should hide the "Done" bar if hideDoneBar prop is true', () => {
        const wrapper = shallow(
            <RNPickerSelect
                items={selectItems}
                placeholder={placeholder}
                onValueChange={() => {}}
                hideDoneBar
            />
        );

        const done_bar = wrapper.find('[testID="done_bar"]');

        expect(done_bar).toHaveLength(0);
    });

    it('should return the expected option to a callback passed into onSelect', () => {
        const onValueChangeSpy = jest.fn();
        const wrapper = shallow(
            <RNPickerSelect
                items={selectItems}
                placeholder={placeholder}
                onValueChange={onValueChangeSpy}
            />
        );

        wrapper
            .find('[testID="ios_picker"]')
            .props()
            .onValueChange('orange', 2);
        expect(onValueChangeSpy).toHaveBeenCalledWith('orange', 2);
    });

    it('should show the picker when pressed', () => {
        const wrapper = shallow(
            <RNPickerSelect
                items={selectItems}
                placeholder={placeholder}
                onValueChange={() => {}}
            />
        );

        const touchable = wrapper.find('TouchableWithoutFeedback').at(1);
        touchable.simulate('press');
        expect(wrapper.state().showPicker).toEqual(true);
    });

    it('should not show the picker when pressed if disabled', () => {
        const wrapper = shallow(
            <RNPickerSelect
                items={selectItems}
                placeholder={placeholder}
                onValueChange={() => {}}
                disabled
            />
        );

        const touchable = wrapper.find('TouchableWithoutFeedback').at(1);
        touchable.simulate('press');
        expect(wrapper.state().showPicker).toEqual(false);
    });

    it('should update the selected value when the `value` prop updates and call the onValueChange cb', () => {
        const onValueChangeSpy = jest.fn();
        const wrapper = shallow(
            <RNPickerSelect
                items={selectItems}
                placeholder={{}}
                onValueChange={onValueChangeSpy}
                value="red"
            />
        );

        expect(wrapper.state().selectedItem.value).toEqual('red');

        wrapper.setProps({ value: 'orange' });
        expect(onValueChangeSpy).toBeCalledWith('orange', 1);
        expect(wrapper.state().selectedItem.value).toEqual('orange');

        wrapper.setProps({ value: 'yellow' });
        expect(onValueChangeSpy).toBeCalledWith('yellow', 2);
        expect(wrapper.state().selectedItem.value).toEqual('yellow');
    });

    it('should update the items when the `items` prop updates', () => {
        const wrapper = shallow(
            <RNPickerSelect
                items={selectItems}
                placeholder={placeholder}
                onValueChange={() => {}}
            />
        );

        expect(wrapper.state().items).toEqual([placeholder].concat(selectItems));

        const selectItemsPlusViolet = selectItems.concat([violet]);

        wrapper.setProps({ items: selectItemsPlusViolet });
        expect(wrapper.state().items).toEqual([placeholder].concat(selectItemsPlusViolet));
    });

    it('should should handle having no placeholder', () => {
        const wrapper = shallow(
            <RNPickerSelect items={selectItems} placeholder={{}} onValueChange={() => {}} />
        );

        expect(wrapper.state().items).toEqual(selectItems);
    });

    it('should should suppress the icon when the hideIcon flag is used', () => {
        const wrapper = shallow(
            <RNPickerSelect items={selectItems} onValueChange={() => {}} hideIcon />
        );

        expect(wrapper.find('[testID="icon_ios"]')).toHaveLength(0);
    });

    it('should call Keyboard.dismiss when opened', () => {
        const wrapper = shallow(<RNPickerSelect items={selectItems} onValueChange={() => {}} />);

        const touchable = wrapper.find('[testID="ios_touchable_wrapper"]');
        touchable.simulate('press');

        expect(Keyboard.dismiss).toHaveBeenCalledTimes(1);
    });

    it("should reset to the first item (typically the placeholder) if a value is passed in that doesn't exist in the `items` array", () => {
        const wrapper = shallow(
            <RNPickerSelect
                items={selectItems}
                placeholder={placeholder}
                onValueChange={() => {}}
                value={undefined}
            />
        );

        wrapper
            .find('[testID="ios_picker"]')
            .props()
            .onValueChange('orange', 2);
        expect(wrapper.state().selectedItem.value).toEqual('orange');
        wrapper.setProps({ value: 'violet' });
        expect(wrapper.state().selectedItem).toEqual(placeholder);
    });

    it('should set the selected value to state (Android)', () => {
        Platform.OS = 'android';
        const wrapper = shallow(<RNPickerSelect items={selectItems} onValueChange={() => {}} />);

        wrapper
            .find('[testID="android_picker"]')
            .props()
            .onValueChange('orange', 2);
        expect(wrapper.state().selectedItem.value).toEqual('orange');
    });

    it('should render the headless component when a child is passed in (Android)', () => {
        Platform.OS = 'android';
        const wrapper = shallow(
            <RNPickerSelect items={selectItems} onValueChange={() => {}}>
                <View />
            </RNPickerSelect>
        );

        const component = wrapper.find('[testID="android_picker_headless"]');
        expect(component).toHaveLength(1);
    });

    it('should call the onDonePress callback when set (iOS)', () => {
        Platform.OS = 'ios';
        const onDonePressSpy = jest.fn();
        const wrapper = shallow(
            <RNPickerSelect
                items={selectItems}
                onValueChange={() => {}}
                onDonePress={onDonePressSpy}
            />
        );

        wrapper
            .find('[testID="ios_picker"]')
            .props()
            .onValueChange('orange', 2);
        const touchable = wrapper.find('[testID="done_button"]');
        touchable.simulate('press');
        expect(onDonePressSpy).toHaveBeenCalledWith();
    });

    it('should call the onShow callback when set (iOS)', () => {
        Platform.OS = 'ios';
        const onShowSpy = jest.fn();
        const wrapper = shallow(
            <RNPickerSelect
                items={selectItems}
                onValueChange={() => {}}
                modalProps={{
                    onShow: onShowSpy,
                }}
            />
        );
        wrapper
            .find('[testID="ios_modal"]')
            .props()
            .onShow();
        expect(onShowSpy).toHaveBeenCalledWith();
    });

    it('should call the onDismiss callback when set (iOS)', () => {
        Platform.OS = 'ios';
        const onDismissSpy = jest.fn();
        const wrapper = shallow(
            <RNPickerSelect
                items={selectItems}
                onValueChange={() => {}}
                modalProps={{
                    onDismiss: onDismissSpy,
                }}
            />
        );
        wrapper
            .find('[testID="ios_modal"]')
            .props()
            .onDismiss();
        expect(onDismissSpy).toHaveBeenCalledWith();
    });

    it('should call the onOpen callback when set', () => {
        const onOpenSpy = jest.fn();
        const wrapper = shallow(
            <RNPickerSelect items={selectItems} onValueChange={() => {}} onOpen={onOpenSpy} />
        );

        const touchable = wrapper.find('[testID="done_button"]');
        touchable.simulate('press');

        expect(onOpenSpy).toHaveBeenCalledWith();
    });

    it('should call the onClose callback when set', () => {
        const onCloseSpy = jest.fn();
        const wrapper = shallow(
            <RNPickerSelect items={selectItems} onValueChange={() => {}} onClose={onCloseSpy} />
        );

        const touchable = wrapper.find('[testID="done_button"]');
        // Open
        touchable.simulate('press');
        // Close
        touchable.simulate('press');

        expect(onCloseSpy).toHaveBeenCalledWith();
    });

    describe('getDerivedStateFromProps', () => {
        it('should return null when nothing changes', () => {
            const nextProps = {
                placeholder,
                value: selectItems[0].value,
                onValueChange() {},
                items: selectItems,
            };
            const prevState = {
                items: [placeholder].concat(selectItems),
                selectedItem: selectItems[0],
            };

            expect(RNPickerSelect.getDerivedStateFromProps(nextProps, prevState)).toEqual(null);
        });

        it('should return a new items state when the items change', () => {
            const nextProps = {
                placeholder,
                value: selectItems[0].value,
                onValueChange() {},
                items: selectItems.concat([violet]),
            };
            const prevState = {
                items: [placeholder].concat(selectItems),
                selectedItem: selectItems[0],
            };

            expect(RNPickerSelect.getDerivedStateFromProps(nextProps, prevState)).toEqual({
                items: [placeholder].concat(selectItems).concat([violet]),
            });
        });

        it('should return a new items state when the placeholder changes', () => {
            const newPlaceholder = {
                label: 'Select a thing...',
                value: null,
            };
            const nextProps = {
                placeholder: newPlaceholder,
                value: selectItems[0].value,
                onValueChange() {},
                items: selectItems,
            };
            const prevState = {
                items: [placeholder].concat(selectItems),
                selectedItem: selectItems[0],
            };

            expect(RNPickerSelect.getDerivedStateFromProps(nextProps, prevState)).toEqual({
                items: [newPlaceholder].concat(selectItems),
            });
        });

        it('should return a new selectedItem state when the value changes', () => {
            const nextProps = {
                placeholder,
                value: selectItems[1].value,
                onValueChange() {},
                items: selectItems,
            };
            const prevState = {
                items: [placeholder].concat(selectItems),
                selectedItem: selectItems[0],
            };

            expect(RNPickerSelect.getDerivedStateFromProps(nextProps, prevState)).toEqual({
                selectedItem: selectItems[1],
            });
        });
    });
});
