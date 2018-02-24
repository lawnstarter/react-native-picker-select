import React, { PureComponent } from 'react';
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

export default class RNPickerSelect extends PureComponent {
  constructor(props) {
    super(props);

    this.noPlaceholder = isEqual(props.placeholder, {});
    this.items = this.noPlaceholder ? props.items : [props.placeholder].concat(props.items);

    this.state = {
      items: this.items,
      selectedItem: this.items.find(item => isEqual(item.value, props.value)) || this.items[0],
      showPicker: false,
    };

    this.onUpArrow = this.onUpArrow.bind(this);
    this.onDownArrow = this.onDownArrow.bind(this);
    this.togglePicker = this.togglePicker.bind(this);
    this.selectValue = this.selectValue.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // update items if items prop changes
    if (!isEqual(this.state.items, nextProps.items)) {
      this.setState({
        items: this.noPlaceholder ? nextProps.items : [this.props.placeholder].concat(nextProps.items),
      });
    }

    // update selectedItem if value prop is defined and differs from currently selected item
    if (nextProps.value === undefined) { return; }
    const newSelectedItem = this.state.items.find(item => isEqual(item.value, nextProps.value)) || this.items[0];
    if (this.state.selectedItem !== newSelectedItem) {
      this.setState({
        selectedItem: newSelectedItem,
      });
    }
  }

  onUpArrow() {
    this.togglePicker();
    setTimeout(() => {
      this.props.onUpArrow();
    });
  }

  onDownArrow() {
    this.togglePicker();
    setTimeout(() => {
      this.props.onDownArrow();
    });
  }

  togglePicker() {
    if (this.props.disabled) { return; }
    if (!this.state.showPicker && this.inputRef) {
      this.inputRef.focus();
      this.inputRef.blur();
    }
    this.setState({
      showPicker: !this.state.showPicker,
    });
  }

  selectValue({ value, index }) {
    this.props.onSelect({ value, index });

    this.setState({
      selectedItem: this.state.items[index],
    });
  }

  renderPickerItems() {
    return this.state.items.map(item => (<Picker.Item label={item.label} value={item.value} key={item.key || item.label} />));
  }

  renderPlaceholderStyle() {
    const styleModifiers = {};
    if (!this.noPlaceholder && this.state.selectedItem.label === this.props.placeholder.label) {
      styleModifiers.color = this.props.style.placeholderColor || '#C7C7CD';
    }
    return styleModifiers;
  }

  renderDoneBar() {
    if (this.props.hideDoneBar) { return null; }

    return (
      <View style={[styles.modalViewMiddle, this.props.style.modalViewMiddle]}>
        <View style={{ flex: 1, flexDirection: 'row', marginLeft: 15 }}>
          <TouchableOpacity
            activeOpacity={this.props.onUpArrow ? 0.5 : 1}
            onPress={this.props.onUpArrow ? this.onUpArrow : null}
          >
            <View style={[styles.chevron, styles.chevronUp, this.props.onUpArrow ? styles.chevronActive : {}]} />
          </TouchableOpacity>
          <View style={{ marginHorizontal: 10 }} />
          <TouchableOpacity
            activeOpacity={this.props.onDownArrow ? 0.5 : 1}
            onPress={this.props.onDownArrow ? this.onDownArrow : null}
          >
            <View style={[styles.chevron, styles.chevronDown, this.props.onDownArrow ? styles.chevronActive : {}]} />
          </TouchableOpacity>
        </View>
        <TouchableWithoutFeedback
          onPress={this.togglePicker}
          hitSlop={{ top: 2, right: 2, bottom: 2, left: 2 }}
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

  renderTextInputOrChildren() {
    if (this.props.children) {
      return (
        <View pointerEvents="box-only">
          { this.props.children }
        </View>
      );
    }
    return (
      <View pointerEvents="box-only">
        <TextInput
          style={[this.props.style.inputIOS, this.renderPlaceholderStyle()]}
          value={this.state.selectedItem.label}
          ref={(ref) => { this.inputRef = ref; }}
        />
        { this.renderIcon() }
      </View>
    );
  }

  renderIOS() {
    return (
      <View style={[styles.viewContainer, this.props.style.viewContainer]}>
        <TouchableWithoutFeedback
          onPress={this.togglePicker}
          ref={this.props.pickerRef}
        >
          { this.renderTextInputOrChildren() }
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
              onValueChange={(value, index) => { this.selectValue({ value, index }); }}
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

  renderAndroidHeadless() {
    return (
      <View style={{ borderWidth: 0 }}>
        { this.props.children }
        <Picker
          style={{ position: 'absolute', top: 0, width: 1000, height: 1000 }}
          onValueChange={(value, index) => { this.selectValue({ value, index }); }}
          selectedValue={this.state.selectedItem.value}
          testId="RNPickerSelectAndroid"
          mode={this.props.mode}
          enabled={!this.props.disabled}
        >
          { this.renderPickerItems() }
        </Picker>
      </View>
    );
  }

  renderAndroid() {
    if (this.props.children) {
      return this.renderAndroidHeadless();
    }

    return (
      <View style={[styles.viewContainer, this.props.style.viewContainer]}>
        <Picker
          style={[this.props.style.inputAndroid, this.renderPlaceholderStyle()]}
          onValueChange={(value, index) => { this.selectValue({ value, index }); }}
          selectedValue={this.state.selectedItem.value}
          testId="RNPickerSelectAndroid"
          mode={this.props.mode}
          enabled={!this.props.disabled}
        >
          { this.renderPickerItems() }
        </Picker>
        <View style={[styles.underline, this.props.style.underline]} />
      </View>
    );
  }

  render() {
    return Platform.OS === 'ios' ? this.renderIOS() : this.renderAndroid();
  }
}

RNPickerSelect.propTypes = {
  onSelect: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.any.isRequired,
    key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  })).isRequired,
  placeholder: PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.any,
  }),
  hideDoneBar: PropTypes.bool,
  hideIcon: PropTypes.bool,
  disabled: PropTypes.bool,
  value: PropTypes.any, // eslint-disable-line react/forbid-prop-types
  style: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  children: PropTypes.any, // eslint-disable-line react/forbid-prop-types
  mode: PropTypes.string,
  onUpArrow: PropTypes.func,
  onDownArrow: PropTypes.func,
  pickerRef: PropTypes.func,
};

RNPickerSelect.defaultProps = {
  placeholder: {
    label: 'Select an item...',
    value: null,
  },
  hideDoneBar: false,
  hideIcon: false,
  disabled: false,
  value: undefined,
  style: {},
  children: null,
  mode: 'dialog',
  onUpArrow: null,
  onDownArrow: null,
  pickerRef: null,
};

const styles = StyleSheet.create({
  viewContainer: {
    alignSelf: 'stretch',
  },
  chevron: {
    width: 15,
    height: 15,
    backgroundColor: 'transparent',
    borderTopWidth: 1.5,
    borderTopColor: '#D0D4DB',
    borderRightWidth: 1.5,
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
  chevronActive: {
    borderTopColor: '#007AFE',
    borderRightColor: '#007AFE',
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
    borderTopWidth: 0.5,
    borderTopColor: '#919498',
  },
  modalViewBottom: {
    height: 215,
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

