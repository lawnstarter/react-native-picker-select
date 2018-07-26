import React from 'react';
import { Platform } from 'react-native';
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
        const wrapper = shallow(
            <RNPickerSelect
                items={selectItems}
                placeholder={placeholder}
                onValueChange={() => {}}
            />
        );

        wrapper
            .find('[testID="RNPickerSelectAndroid"]')
            .props()
            .onValueChange('orange', 2);
        expect(wrapper.state().selectedItem.value).toEqual('orange');
    });
});
