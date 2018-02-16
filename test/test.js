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

describe('RNPickerSelect', () => {
  it('should set the picked value to state', () => {
    const wrapper = shallow(<RNPickerSelect
      items={selectItems}
      placeholder={{
        label: 'Select a color...',
        value: null,
      }}
      onSelect={() => {}}
    />);

    wrapper.find('[testId="RNPickerSelectIOS"]').props().onValueChange('orange', 1);
    expect(wrapper.state().selectedItem.value).toEqual('orange');
  });

  it('should show the picker when pressed', () => {
    const wrapper = shallow(<RNPickerSelect
      items={selectItems}
      placeholder={{
        label: 'Select a color...',
        value: null,
      }}
      onSelect={() => {}}
    />);

    const touchable = wrapper.find('TouchableWithoutFeedback').at(1);
    touchable.simulate('press');
    expect(wrapper.state().showPicker).toEqual(true);
  });

  it('should not show the picker when pressed if disabled', () => {
    const wrapper = shallow(<RNPickerSelect
      items={selectItems}
      placeholder={{
        label: 'Select a color...',
        value: null,
      }}
      onSelect={() => {}}
      disabled
    />);

    const touchable = wrapper.find('TouchableWithoutFeedback').at(1);
    touchable.simulate('press');
    expect(wrapper.state().showPicker).toEqual(false);
  });

  it('should update the picked value when the parent updates', () => {
    const wrapper = shallow(<RNPickerSelect
      items={selectItems}
      placeholder={{
        label: 'Select a color...',
        value: null,
      }}
      onSelect={() => {}}
      value="red"
    />);

    expect(wrapper.state().selectedItem.value).toEqual('red');
    wrapper.setProps({ value: 'orange' });
    expect(wrapper.state().selectedItem.value).toEqual('orange');
  });

  it('should set the picked value to state (Android)', () => {
    Platform.OS = 'android';
    const wrapper = shallow(<RNPickerSelect
      items={selectItems}
      placeholder={{
        label: 'Select a color...',
        value: null,
      }}
      onSelect={() => {}}
    />);

    wrapper.find('[testId="RNPickerSelectAndroid"]').props().onValueChange('orange', 1);
    expect(wrapper.state().selectedItem.value).toEqual('orange');
  });
});
