import React from 'react';
import { Platform, View } from 'react-native';
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

const placeholder = {
    label: 'Select a color...',
    value: null,
};

describe('RNPickerSelect', () => {
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
            .find('[testID="RNPickerSelectIOS"]')
            .props()
            .onValueChange('orange', 2);
        wrapper
            .find('[testID="RNPickerSelectIOS"]')
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
            .find('[testID="RNPickerSelectIOS"]')
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

        const selectItemsPlusViolet = selectItems.concat([{ label: 'Violet', value: 'violet' }]);

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
            .find('[testID="RNPickerSelectIOS"]')
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
            .find('[testID="RNPickerSelectAndroid"]')
            .props()
            .onValueChange('orange', 2);
        expect(wrapper.state().selectedItem.value).toEqual('orange');
    });

    it('should render the headless component when children are passed in (Android)', () => {
        Platform.OS = 'android';
        const wrapper = shallow(
            <RNPickerSelect items={selectItems} onValueChange={() => {}}>
                <View />
            </RNPickerSelect>
        );

        const component = wrapper.find('[testID="RNPickerSelectAndroidHeadless"]');
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
            .find('[testID="RNPickerSelectIOS"]')
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
            .find('[testID="RNPickerSelectModal"]')
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
            .find('[testID="RNPickerSelectModal"]')
            .props()
            .onDismiss();
        expect(onDismissSpy).toHaveBeenCalledWith();
    });
});
