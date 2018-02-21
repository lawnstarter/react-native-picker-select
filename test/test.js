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
  it('should set the selected value to state', () => {
    const wrapper = shallow(<RNPickerSelect
      items={selectItems}
      placeholder={placeholder}
      onSelect={() => {}}
    />);

    wrapper.find('[testId="RNPickerSelectIOS"]').props().onValueChange('orange', 2);
    expect(wrapper.state().selectedItem.value).toEqual('orange');
  });

  it('should return the expected option to a callback passed into onSelect', () => {
    const onSelectSpy = jest.fn();
    const wrapper = shallow(<RNPickerSelect
      items={selectItems}
      placeholder={placeholder}
      onSelect={onSelectSpy}
    />);

    wrapper.find('[testId="RNPickerSelectIOS"]').props().onValueChange('orange', 2);
    expect(onSelectSpy).toHaveBeenCalledWith({ index: 2, value: 'orange' });
  });

  it('should show the picker when pressed', () => {
    const wrapper = shallow(<RNPickerSelect
      items={selectItems}
      placeholder={placeholder}
      onSelect={() => {}}
    />);

    const touchable = wrapper.find('TouchableWithoutFeedback').at(1);
    touchable.simulate('press');
    expect(wrapper.state().showPicker).toEqual(true);
  });

  it('should not show the picker when pressed if disabled', () => {
    const wrapper = shallow(<RNPickerSelect
      items={selectItems}
      placeholder={placeholder}
      onSelect={() => {}}
      disabled
    />);

    const touchable = wrapper.find('TouchableWithoutFeedback').at(1);
    touchable.simulate('press');
    expect(wrapper.state().showPicker).toEqual(false);
  });

  it('should update the selected value when the `value` prop updates', () => {
    const wrapper = shallow(<RNPickerSelect
      items={selectItems}
      placeholder={placeholder}
      onSelect={() => {}}
      value="red"
    />);

    expect(wrapper.state().selectedItem.value).toEqual('red');
    wrapper.setProps({ value: 'orange' });
    expect(wrapper.state().selectedItem.value).toEqual('orange');
  });

  it('should update the items when the `item` prop updates', () => {
    const wrapper = shallow(<RNPickerSelect
      items={selectItems}
      placeholder={placeholder}
      onSelect={() => {}}
    />);

    expect(wrapper.state().items).toEqual([placeholder].concat(selectItems));

    const selectItemsPlusViolet = selectItems.concat([{ label: 'Violet', value: 'violet' }]);

    wrapper.setProps({ items: selectItemsPlusViolet });
    expect(wrapper.state().items).toEqual([placeholder].concat(selectItemsPlusViolet));
  });

  it('should should handle having no placeholder', () => {
    const wrapper = shallow(<RNPickerSelect
      items={selectItems}
      placeholder={{}}
      onSelect={() => {}}
    />);

    expect(wrapper.state().items).toEqual(selectItems);
  });

  it('should should reset to the first item (typically the placeholder) if a value is passed in that doesn\'t exist in the `items` array', () => {
    const wrapper = shallow(<RNPickerSelect
      items={selectItems}
      placeholder={placeholder}
      onSelect={() => {}}
    />);

    wrapper.find('[testId="RNPickerSelectIOS"]').props().onValueChange('orange', 2);
    expect(wrapper.state().selectedItem.value).toEqual('orange');
    wrapper.setProps({ value: 'violet' });
    expect(wrapper.state().selectedItem).toEqual(placeholder);
  });

  it('should set the selected value to state (Android)', () => {
    Platform.OS = 'android';
    const wrapper = shallow(<RNPickerSelect
      items={selectItems}
      placeholder={placeholder}
      onSelect={() => {}}
    />);

    wrapper.find('[testId="RNPickerSelectAndroid"]').props().onValueChange('orange', 2);
    expect(wrapper.state().selectedItem.value).toEqual('orange');
  });
});
