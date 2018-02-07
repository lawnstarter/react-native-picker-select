import React, { Component } from 'react';
import {
  Modal,
  Picker,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
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

  selectValue({ value, index }) {
    this.props.onSelect({value, index});

    this.setState({
      selectedItem: this.state.items[index],
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

  renderDoneBar() {
    if (this.props.hideDoneBar) { return null; }

    return (
      <View style={[styles.modalViewMiddle, this.props.style.modalViewMiddle]}>
        <View style={{ flex: 1, flexDirection: 'row', marginLeft: 15 }}>
          <View style={[styles.chevron, styles.chevronUp]} />
          <View style={{ marginHorizontal: 10 }} />
          <View style={[styles.chevron, styles.chevronDown]} />
        </View>
        <TouchableWithoutFeedback
          onPress={this.togglePicker}
          hitSlop={{
            top: 2, right: 2, bottom: 2, left: 2,
          }}
        >
          <View>
            <Text style={styles.done}>Done</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  renderIcon() {
    if (this.props.hideIcon) { return null; }

    return (
      <View style={[styles.icon, this.props.style.icon]} />
    );
  }

  renderIOS(){
    return (
      <View style={[styles.viewContainer, this.props.style.viewContainer]}>
        <TouchableWithoutFeedback onPress={this.togglePicker}>
          <View pointerEvents="box-only">
            <TextInput
              style={[this.props.style.inputIOS, this.renderPlaceholderStyle()]}
              value={this.state.selectedItem.label}
            />
            {this.renderIcon()}
          </View>
        </TouchableWithoutFeedback>
        <Modal
          visible={this.state.showPicker}
          transparent
          animationType="slide"
        >
          <TouchableOpacity
            style={[styles.modalViewTop, this.props.style.modalViewTop]}
            onPress={this.togglePicker}
          />
          { this.renderDoneBar() }
          <View style={[styles.modalViewBottom, this.props.style.modalViewBottom]}>
            <Picker
              onValueChange={(value, index) => {
                                this.selectValue({ value, index });
                            }}
              selectedValue={this.state.selectedItem.value}
              testId="RNPickerSelectIOS"
            >
              { this.renderPickerItems() }
            </Picker>
          </View>
        </Modal>
      </View>
    );
  }

  renderAndroid() {
    return (
      <View style={[styles.viewContainer, this.props.style.viewContainer]}>
        <Picker
          style={[this.props.style.inputAndroid, this.renderPlaceholderStyle()]}
          onValueChange={(value, index) => {
                        this.selectValue({ value, index });
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

  render() {
    return Platform.OS === 'ios' ? this.renderIOS() : this.renderAndroid()
  }
}

RNSelect.propTypes = {
  onSelect: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.any.isRequired,
    key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  })).isRequired,
  placeholder: PropTypes.string,
  hideDoneBar: PropTypes.bool,
  hideIcon: PropTypes.bool,
  disabled: PropTypes.bool,
  value: PropTypes.any, // eslint-disable-line react/forbid-prop-types
  style: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

RNSelect.defaultProps = {
  placeholder: 'Select an item...',
  hideDoneBar: false,
  hideIcon: false,
  disabled: false,
  value: undefined,
  style: {},
};

const styles = StyleSheet.create({
  viewContainer: {
    alignSelf: 'stretch',
  },
  chevron: {
    width: 15,
    height: 15,
    backgroundColor: 'transparent',
    borderTopWidth: 2,
    borderTopColor: '#D0D4DB',
    borderRightWidth: 2,
    borderRightColor: '#D0D4DB',
  },
  chevronUp: {
    transform: [
      { translateY: 17 },
      { rotate: '-45deg' },
    ],
  },
  chevronDown: {
    transform: [
      { translateY: 8 },
      { rotate: '135deg' },
    ],
  },
  icon: {
    position: 'absolute',
    backgroundColor: 'transparent',
    borderTopWidth: 10,
    borderTopColor: 'gray',
    borderRightWidth: 10,
    borderRightColor: 'transparent',
    borderLeftWidth: 10,
    borderLeftColor: 'transparent',
    width: 0,
    height: 0,
    top: 20,
    right: 10,
  },
  modalViewTop: {
    flex: 1,
  },
  modalViewMiddle: {
    height: 44,
    zIndex: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#EFF1F2',
  },
  modalViewBottom: {
    height: 180,
    justifyContent: 'center',
    backgroundColor: '#D0D4DB',
  },
  done: {
    color: '#007AFE',
    fontWeight: 'bold',
    padding: 10,
    fontSize: 18,
  },
  underline: {
    borderTopWidth: 1,
    borderTopColor: '#888988',
    marginHorizontal: 4,
  },
});

