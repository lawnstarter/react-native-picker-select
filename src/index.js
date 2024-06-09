import { Picker } from '@react-native-picker/picker';
import isEqual from 'lodash.isequal';
import isObject from 'lodash.isobject';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Keyboard, Modal, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { defaultStyles } from './styles';

export default class RNPickerSelect extends PureComponent {
  static propTypes = {
    onValueChange: PropTypes.func.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.any.isRequired,
        testID: PropTypes.string,
        inputLabel: PropTypes.string,
        key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        color: PropTypes.string,
      })
    ).isRequired,
    value: PropTypes.any,
    placeholder: PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.any,
      key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      color: PropTypes.string,
    }),
    disabled: PropTypes.bool,
    itemKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    style: PropTypes.shape({}),
    children: PropTypes.any,
    onOpen: PropTypes.func,
    useNativeAndroidPickerStyle: PropTypes.bool,
    fixAndroidTouchableBug: PropTypes.bool,
    darkTheme: PropTypes.bool,

    // Custom Modal props (iOS only)
    doneText: PropTypes.string,
    onDonePress: PropTypes.func,
    onUpArrow: PropTypes.func,
    onDownArrow: PropTypes.func,
    onClose: PropTypes.func,

    // Modal props (iOS only)
    modalProps: PropTypes.shape({}),

    // TextInput props
    textInputProps: PropTypes.shape({}),

    // Picker props
    pickerProps: PropTypes.shape({}),

    // Touchable Done props (iOS only)
    touchableDoneProps: PropTypes.shape({}),

    // Touchable wrapper props
    touchableWrapperProps: PropTypes.shape({}),

    // Custom Icon
    Icon: PropTypes.func,
    InputAccessoryView: PropTypes.func,
  };

  static defaultProps = {
    value: undefined,
    placeholder: {
      label: 'Select an item...',
      value: null,
      color: '#9EA0A4',
    },
    disabled: false,
    itemKey: null,
    style: {},
    children: null,
    useNativeAndroidPickerStyle: true,
    fixAndroidTouchableBug: false,
    doneText: 'Done',
    onDonePress: null,
    onUpArrow: null,
    onDownArrow: null,
    onOpen: null,
    onClose: null,
    modalProps: {},
    textInputProps: {},
    pickerProps: {},
    touchableDoneProps: {},
    touchableWrapperProps: {},
    Icon: null,
    InputAccessoryView: null,
    darkTheme: false,
  };

  static handlePlaceholder({ placeholder }) {
    if (isEqual(placeholder, {})) {
      return [];
    }
    return [placeholder];
  }

  static getSelectedItem({ items, key, value }) {
    let idx = items.findIndex((item) => {
      if (item.key && key) {
        return isEqual(item.key, key);
      }
      if (isObject(item.value) || isObject(value)) {
        return isEqual(item.value, value);
      }
      // convert to string to make sure types match
      return isEqual(String(item.value), String(value));
    });
    if (idx === -1) {
      idx = 0;
    }
    return {
      selectedItem: items[idx] || {},
      idx,
    };
  }

  constructor(props) {
    super(props);

    const items = RNPickerSelect.handlePlaceholder({
      placeholder: props.placeholder,
    }).concat(props.items);

    const { selectedItem } = RNPickerSelect.getSelectedItem({
      items,
      key: props.itemKey,
      value: props.value,
    });

    this.state = {
      items,
      selectedItem,
      showPicker: false,
      animationType: undefined,
      orientation: 'portrait',
      doneDepressed: false,
    };

    this.onUpArrow = this.onUpArrow.bind(this);
    this.onDownArrow = this.onDownArrow.bind(this);
    this.onValueChange = this.onValueChange.bind(this);
    this.onOrientationChange = this.onOrientationChange.bind(this);
    this.setInputRef = this.setInputRef.bind(this);
    this.togglePicker = this.togglePicker.bind(this);
    this.renderInputAccessoryView = this.renderInputAccessoryView.bind(this);
  }

  componentDidUpdate = (prevProps, prevState) => {
    // update items if items or placeholder prop changes
    const items = RNPickerSelect.handlePlaceholder({
      placeholder: this.props.placeholder,
    }).concat(this.props.items);
    const itemsChanged = !isEqual(prevState.items, items);

    // update selectedItem if value or itemKey prop is defined and differs from currently selected item
    const { selectedItem, idx } = RNPickerSelect.getSelectedItem({
      items,
      key: this.props.itemKey,
      value: this.props.value,
    });
    const selectedItemChanged =
      (!isEqual(this.props.value, undefined) && !isEqual(prevState.selectedItem, selectedItem)) ||
      (!isEqual(this.props.itemKey, prevProps.itemKey));

    if (itemsChanged || selectedItemChanged) {
      this.props.onValueChange(selectedItem.value, idx);

      this.setState({
        ...(itemsChanged ? { items } : {}),
        ...(selectedItemChanged ? { selectedItem } : {}),
      });
    }
  };

  onUpArrow() {
    const { onUpArrow } = this.props;

    this.togglePicker(false, onUpArrow);
  }

  onDownArrow() {
    const { onDownArrow } = this.props;

    this.togglePicker(false, onDownArrow);
  }

  onValueChange(value, index) {
    const { onValueChange } = this.props;

    onValueChange(value, index);

    this.setState((prevState) => {
      return {
        selectedItem: prevState.items[index],
      };
    });
  }

  onOrientationChange({ nativeEvent }) {
    this.setState({
      orientation: nativeEvent.orientation,
    });
  }

  setInputRef(ref) {
    this.inputRef = ref;
  }

  getPlaceholderStyle() {
    const { placeholder, style } = this.props;
    const { selectedItem } = this.state;

    if (!isEqual(placeholder, {}) && selectedItem.label === placeholder.label) {
      return {
        ...defaultStyles.placeholder,
        ...style.placeholder,
      };
    }
    return {};
  }

  isDarkTheme() {
    const { darkTheme } = this.props;

    return Platform.OS === 'ios' && darkTheme;
  }

  triggerOpenCloseCallbacks(donePressed) {
    const { onOpen, onClose } = this.props;
    const { showPicker } = this.state;

    if (!showPicker && onOpen) {
      onOpen();
    }

    if (showPicker && onClose) {
      onClose(donePressed);
    }
  }

  togglePicker(animate = false, postToggleCallback, donePressed = false) {
    const { modalProps, disabled } = this.props;
    const { showPicker } = this.state;

    if (disabled) {
      return;
    }

    if (!showPicker) {
      Keyboard.dismiss();
    }

    const animationType =
      modalProps && modalProps.animationType ? modalProps.animationType : 'slide';

    this.triggerOpenCloseCallbacks(donePressed);

    this.setState(
      (prevState) => {
        return {
          animationType: animate ? animationType : undefined,
          showPicker: !prevState.showPicker,
        };
      },
      () => {
        if (postToggleCallback) {
          postToggleCallback();
        }
      }
    );
  }

  renderPickerItems() {
    const { items } = this.state;
    const defaultItemColor = this.isDarkTheme() ? '#fff' : undefined;

    return items.map((item) => {
      return (
        <Picker.Item
          label={item.label}
          value={item.value}
          key={item.key || item.label}
          color={item.color || defaultItemColor}
          testID={item.testID}
        />
      );
    });
  }

  renderInputAccessoryView() {
    const {
      InputAccessoryView,
      doneText,
      onUpArrow,
      onDownArrow,
      onDonePress,
      style,
      touchableDoneProps,
    } = this.props;

    const { doneDepressed } = this.state;

    if (InputAccessoryView) {
      return <InputAccessoryView testID="custom_input_accessory_view" />;
    }

    return (
      <View
        style={[
          defaultStyles.modalViewMiddle,
          this.isDarkTheme() ? defaultStyles.modalViewMiddleDark : {},
          this.isDarkTheme() ? style.modalViewMiddleDark : style.modalViewMiddle,
        ]}
        testID="input_accessory_view"
      >
        <View style={[defaultStyles.chevronContainer, style.chevronContainer]}>
          <TouchableOpacity
            activeOpacity={onUpArrow ? 0.5 : 1}
            onPress={onUpArrow ? this.onUpArrow : null}
          >
            <View
              style={[
                defaultStyles.chevron,
                style.chevron,
                defaultStyles.chevronUp,
                style.chevronUp,
                onUpArrow ? [defaultStyles.chevronActive, style.chevronActive] : {},
              ]}
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={onDownArrow ? 0.5 : 1}
            onPress={onDownArrow ? this.onDownArrow : null}
          >
            <View
              style={[
                defaultStyles.chevron,
                style.chevron,
                defaultStyles.chevronDown,
                style.chevronDown,
                onDownArrow ? [defaultStyles.chevronActive, style.chevronActive] : {},
              ]}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          testID="done_button"
          onPress={() => {
            this.togglePicker(true, onDonePress, true);
          }}
          onPressIn={() => {
            this.setState({
              doneDepressed: true,
            });
          }}
          onPressOut={() => {
            this.setState({
              doneDepressed: false,
            });
          }}
          hitSlop={{ top: 4, right: 4, bottom: 4, left: 4 }}
          {...touchableDoneProps}
        >
          <View
            accessible
            accessibilityRole="button"
            accessibilityLabel={doneText}
            style={[
              defaultStyles.done,
              this.isDarkTheme() ? defaultStyles.doneDark : {},
              this.isDarkTheme() ? style.doneDark : style.done,
              doneDepressed
                ? [defaultStyles.doneDepressed, style.doneDepressed]
                : {},
            ]}
          >
            <Text
              allowFontScaling={false}
              adjustsFontSizeToFit={false}
              style={[
                defaultStyles.doneText,
                this.isDarkTheme() ? defaultStyles.doneTextDark : {},
                this.isDarkTheme() ? style.doneTextDark : style.doneText,
                doneDepressed
                  ? [defaultStyles.doneTextDepressed, style.doneTextDepressed]
                  : {},
              ]}
            >
              {doneText}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  renderIcon() {
    const { Icon } = this.props;

    if (Icon) {
      return <Icon testID="icon_ios" />;
    }

    return null;
  }

  renderTextInputOrChildren() {
    const { children, style, textInputProps, fixAndroidTouchableBug } = this.props;
    const { selectedItem } = this.state;

    const containerStyle = Platform.OS === 'android' && fixAndroidTouchableBug
      ? { height: 0, width: 0, flex: 1 }
      : {};

    if (children) {
      return (
        <View pointerEvents="box-only" style={containerStyle}>
          {React.Children.map(children, (child) =>
            React.cloneElement(child, {
              pointerEvents: 'none',
              style: [child.props.style, this.getPlaceholderStyle()],
            })
          )}
        </View>
      );
    }

    return (
      <View pointerEvents="box-only" style={containerStyle}>
        <TextInput
          testID="text_input"
          style={[style.inputIOS, this.getPlaceholderStyle()]}
          value={selectedItem.inputLabel || selectedItem.label}
          ref={this.setInputRef}
          editable={false}
          {...textInputProps}
        />
        {this.renderIcon()}
      </View>
    );
  }

  renderIOS() {
    const { doneText, modalProps, pickerProps, style } = this.props;
    const { animationType, orientation, selectedItem, showPicker } = this.state;

    return (
      <View style={[defaultStyles.viewContainer, style.viewContainer]}>
        <TouchableOpacity
          testID="ios_touchable_wrapper"
          onPress={() => {
            this.togglePicker(true);
          }}
          activeOpacity={1}
        >
          {this.renderTextInputOrChildren()}
        </TouchableOpacity>

        <Modal
          testID="ios_modal"
          visible={showPicker}
          transparent
          animationType={animationType}
          supportedOrientations={['portrait', 'landscape']}
          onDismiss={() => {
            this.togglePicker(true, undefined, true);
          }}
          onRequestClose={() => {
            this.togglePicker(true, undefined, true);
          }}
          onOrientationChange={this.onOrientationChange}
          {...modalProps}
        >
          <TouchableOpacity
            style={[defaultStyles.modalViewTop, style.modalViewTop]}
            onPress={() => {
              this.togglePicker(true, undefined, true);
            }}
          />
          {this.renderInputAccessoryView()}
          <View
            style={[
              defaultStyles.modalViewBottom,
              this.isDarkTheme() ? defaultStyles.modalViewBottomDark : {},
              this.isDarkTheme() ? style.modalViewBottomDark : style.modalViewBottom,
            ]}
          >
            <Picker
              testID="ios_picker"
              selectedValue={selectedItem.value}
              onValueChange={this.onValueChange}
              prompt={doneText}
              {...pickerProps}
            >
              {this.renderPickerItems()}
            </Picker>
          </View>
        </Modal>
      </View>
    );
  }

  renderAndroidHeadless() {
    const { pickerProps, style, disabled } = this.props;
    const { selectedItem } = this.state;

    return (
      <View style={style.headlessAndroidContainer}>
        {this.renderTextInputOrChildren()}

        <Picker
          style={{ position: 'absolute', top: 0, width: '100%', height: '100%' }}
          testID="android_picker_headless"
          selectedValue={selectedItem.value}
          onValueChange={this.onValueChange}
          enabled={!disabled}
          {...pickerProps}
        >
          {this.renderPickerItems()}
        </Picker>
      </View>
    );
  }

  renderAndroidNativePickerStyle() {
    const { pickerProps, style, disabled } = this.props;
    const { selectedItem } = this.state;

    return (
      <View style={[defaultStyles.viewContainer, style.viewContainer]}>
        <Picker
          style={[defaultStyles.inputAndroid, style.inputAndroid]}
          testID="android_picker"
          selectedValue={selectedItem.value}
          onValueChange={this.onValueChange}
          enabled={!disabled}
          {...pickerProps}
        >
          {this.renderPickerItems()}
        </Picker>
      </View>
    );
  }

  renderWeb() {
    const { disabled, style, pickerProps } = this.props;
    const { selectedItem } = this.state;

    return (
      <View style={[defaultStyles.viewContainer, style.viewContainer]}>
        <select
          disabled={disabled}
          onChange={(e) => {
            this.onValueChange(e.target.value, e.target.selectedIndex);
          }}
          style={[defaultStyles.inputWeb, style.inputWeb]}
          value={selectedItem.value}
          {...pickerProps}
        >
          {this.renderPickerItems().map((item) => (
            <option key={item.key} value={item.props.value}>
              {item.props.label}
            </option>
          ))}
        </select>
      </View>
    );
  }

  render() {
    const { useNativeAndroidPickerStyle, fixAndroidTouchableBug } = this.props;

    if (Platform.OS === 'ios') {
      return this.renderIOS();
    }

    if (Platform.OS === 'web') {
      return this.renderWeb();
    }

    if (useNativeAndroidPickerStyle) {
      return this.renderAndroidNativePickerStyle();
    }

    return this.renderAndroidHeadless();
  }
}

export { defaultStyles };
