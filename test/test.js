import React from 'react';
import { Platform } from 'react-native';
import RNPickerSelect from '../src/';

const selectItems = [
  {
    label: 'Orange',
    value: 'orange',
  },
  {
    label: 'Red',
    value: 'red',
  },
  {
    label: 'Green',
    value: 'green',
  },
  {
    label: 'Purple',
    value: 'purple',
  },
  {
    label: 'Yellow',
    value: 'yellow',
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

    wrapper.find('[testId="RNPickerSelectIOS"]').props().onValueChange('orange', 1);
    expect(wrapper.state().selectedItem.value).toEqual('orange');
  });

  it('should return the expected option to a callback passed into onSelect', () => {
    const onSelectSpy = jest.fn();
    const wrapper = shallow(<RNPickerSelect
      items={selectItems}
      placeholder={placeholder}
      onSelect={onSelectSpy}
    />);

    wrapper.find('[testId="RNPickerSelectIOS"]').props().onValueChange('orange', 1);
    expect(onSelectSpy).toHaveBeenCalledWith({ index: 1, value: 'orange' });
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

    const selectItemsPlusPurple = selectItems.concat([{ label: 'Purple', value: 'purple' }]);

    wrapper.setProps({ items: selectItemsPlusPurple });
    expect(wrapper.state().items).toEqual([placeholder].concat(selectItemsPlusPurple));
  });

  it('should set the selected value to state (Android)', () => {
    Platform.OS = 'android';
    const wrapper = shallow(<RNPickerSelect
      items={selectItems}
      placeholder={placeholder}
      onSelect={() => {}}
    />);

    wrapper.find('[testId="RNPickerSelectAndroid"]').props().onValueChange('orange', 1);
    expect(wrapper.state().selectedItem.value).toEqual('orange');
  });
});
