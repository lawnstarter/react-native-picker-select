import React, { Component } from 'react';
import {
  Picker,
  StyleSheet,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import isEqual from 'lodash.isequal';

export default class RNSelect extends Component {
  constructor(props) {
    super(props);

    this.placeholderItem = { label: props.placeholder, value: null };
    this.itemsWithPlaceholder = [this.placeholderItem].concat(props.items);

    this.state = {
      items: this.itemsWithPlaceholder,
      selectedItem: this.itemsWithPlaceholder.find(item => isEqual(item.value, props.value)) || this.placeholderItem,
      showPicker: false,
    };

    this.togglePicker = this.togglePicker.bind(this);
    this.selectValue = this.selectValue.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const newSelectedItem = this.state.items.find(item => isEqual(item.value, nextProps.value)) || this.placeholderItem;
    if (this.state.selectedItem !== newSelectedItem) {
      this.setState({
        selectedItem: newSelectedItem,
      });
    }
  }

  togglePicker() {
    if (this.props.disabled) { return; }
    this.setState({
      showPicker: !this.state.showPicker,
    });
  }

  selectValue({ value, idx }) {
    this.props.onSelect(value);

    this.setState({
      selectedItem: this.state.items[idx],
    });
  }

  renderPickerItems() {
    return this.state.items.map(item => (<Picker.Item label={item.label} value={item.value} key={item.key || item.label} />));
  }

  renderPlaceholderStyle() {
    const styleModifiers = {};
    if (this.state.selectedItem.label === this.props.placeholder) {
      styleModifiers.color = this.props.style.placeholderColor || '#C7C7CD';
    }
    return styleModifiers;
  }

  render() {
    return (
      <View style={[styles.viewContainer, this.props.style.viewContainer]}>
        <Picker
          style={[this.props.style.inputAndroid, this.renderPlaceholderStyle()]}
          onValueChange={(value, idx) => {
                        this.selectValue({ value, idx });
                    }}
          selectedValue={this.state.selectedItem.value}
          testId="RNPickerSelectAndroid"
          enabled={!this.props.disabled}
        >
          { this.renderPickerItems() }
        </Picker>
        <View style={[styles.underline, this.props.style.underline]} />
      </View>
    );
  }
}

RNSelect.propTypes = {
  onSelect: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.any.isRequired,
    label: PropTypes.string.isRequired,
    key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  })).isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  value: PropTypes.any, // eslint-disable-line react/forbid-prop-types
  style: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

RNSelect.defaultProps = {
  placeholder: 'Select an item...',
  disabled: false,
  value: undefined,
  style: {},
};

const styles = StyleSheet.create({
  viewContainer: {
    alignSelf: 'stretch',
  },
  underline: {
    borderTopWidth: 1,
    borderTopColor: '#888988',
    marginHorizontal: 4,
  },
});

