import React, { PureComponent } from 'react';
import { Keyboard, Modal, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';
import isEqual from 'lodash.isequal';
import { Picker } from '@react-native-community/picker';
import { defaultStyles } from './styles';

export default class RNPickerSelect extends PureComponent {
    static propTypes = {
        onValueChange: PropTypes.func.isRequired,
        items: PropTypes.arrayOf(
            PropTypes.shape({
                label: PropTypes.string.isRequired,
                value: PropTypes.any.isRequired,
                inputLabel: PropTypes.string,
                key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
                color: PropTypes.string,
            })
        ).isRequired,
        value: PropTypes.any, // eslint-disable-line react/forbid-prop-types
        placeholder: PropTypes.shape({
            label: PropTypes.string,
            value: PropTypes.any,
            key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            color: PropTypes.string,
        }),
        disabled: PropTypes.bool,
        itemKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        style: PropTypes.shape({}),
        children: PropTypes.any, // eslint-disable-line react/forbid-prop-types
        onOpen: PropTypes.func,
        useNativeAndroidPickerStyle: PropTypes.bool,

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
    };

    static handlePlaceholder({ items, placeholder }) {
        items.forEach((i, idx) => {
            if (!isEqual(placeholder[idx], {})) {
                i.splice(0, placeholder[idx]);
            }
        });
        return items;
    }

    static getSelectedItem({ items, key, value }) {
        items = Array.isArray(items[0]) ? items : [items];
        key = key && Array.isArray(key[0]) ? key : [key];
        value = value && Array.isArray(items[0]) ? value : [value];

        // One selectedItem/idx entry per wheel.
        // selectedItem is an array of picker items; [{label:la,value:va},{label:lb,value:vb}...]
        // idx is an array of item indices corresponding 1:1 with selectedItems. selectedItem[0] has an
        // index of idx[0], selectedItem[1] of idx[1], etc.
        selectedItem = [];
        idx = [];
        const oneWheel = items.length === 1;
        for (let wheelIndex = 0; wheelIndex < items.length; wheelIndex++) {
            let itemIndex = items[wheelIndex].findIndex((item) => {
                if (item.key && key) {
                    return isEqual(item.key, oneWheel ? key : key[wheelIndex]);
                }
                return isEqual(item.value, oneWheel ? value : value[wheelIndex]);
            });
            if (itemIndex === -1) {
                itemIndex = 0;
            }

            selectedItem.push(items[wheelIndex][itemIndex] || {});
            idx.push(itemIndex);
        }
        return {
            selectedItem,
            idx,
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        // update items if items or placeholder prop changes

        // Backward compatibility
        // Create array wrapper for single wheel
        let items = nextProps.items;
        if (!Array.isArray(items[0])) {
            items = [items];
        }
        // Create array wrapper for single wheel
        let placeholder = nextProps.placeholder;
        if (!Array.isArray(placeholder)) {
            placeholder = [placeholder];
        }

        items = RNPickerSelect.handlePlaceholder({
            items,
            placeholder,
        });
        const itemsChanged = !isEqual(prevState.items, items);

        // update selectedItem if value prop is defined and differs from currently selected item
        const { selectedItem, idx } = RNPickerSelect.getSelectedItem({
            items,
            key: nextProps.itemKey,
            value: nextProps.value,
        });

        const selectedItemChanged =
            !isEqual(nextProps.value, undefined) && !isEqual(prevState.selectedItem, selectedItem);

        if (itemsChanged || selectedItemChanged) {
            if (selectedItemChanged) {
                // Collect the values into an array for output to calling component.
                let outputValue = [];
                let outputIndex = idx;
                selectedItem.forEach(i => {
                    outputValue.push(i.value);
                });
                // Backward compatiblity
                //   If selected item is a one element array (one wheel) then unwrap the item from the array
                //   and pass back a simple object rather than a single element array.
                if (outputValue.length === 1) {
                    outputValue = outputValue[0];
                    outputIndex = idx[0];
                }
                
                nextProps.onValueChange(outputValue, outputIndex);
            }

            return {
                ...(itemsChanged ? { items } : {}),
                ...(selectedItemChanged ? { selectedItem } : {}),
            };
        }

        return null;
    }

    constructor(props) {
        super(props);

        // Backward compatibility
        //   Create array wrapper for single wheel. Calling component may use a single element
        //   array or a simple object if using one wheel.
        let items = props.items;
        if (!Array.isArray(items[0])) {
            items = [items];
        }
        let placeholder = props.placeholder;
        if (!Array.isArray(placeholder)) {
            placeholder = [placeholder];
        }

        items = RNPickerSelect.handlePlaceholder({
            items,
            placeholder: placeholder,
        });

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

    onUpArrow() {
        const { onUpArrow } = this.props;

        this.togglePicker(false, onUpArrow);
    }

    onDownArrow() {
        const { onDownArrow } = this.props;

        this.togglePicker(false, onDownArrow);
    }

    onValueChange(wheelIndex, value, index) {
        const { onValueChange } = this.props;
        const { selectedItem } = this.state;

        this.setState((prevState) => {
            selectedItem[wheelIndex] = prevState.items[wheelIndex][index];
            return {
                selectedItem,
            };
        }, () => {
            // The picker value is an array of value across each of the wheels.
            let value = selectedItem.map(item => {
                return item.value;
            });

            // Get value indices.
            let index = [];
            value.forEach((val, wheelIndex) => {
                const idx = this.state.items[wheelIndex].findIndex(el => el.value === val);
                index.push(idx);
            });

            // Backward compatibility
            //   Return a simple object if only one wheel is used.
            if (this.state.items.length === 1) {
                value = value[0];
                index = index[0];
            }
            onValueChange(value, index);
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

    triggerOpenCloseCallbacks() {
        const { onOpen, onClose } = this.props;
        const { showPicker } = this.state;

        if (!showPicker && onOpen) {
            onOpen();
        }

        if (showPicker && onClose) {
            onClose();
        }
    }

    togglePicker(animate = false, postToggleCallback) {
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

        this.triggerOpenCloseCallbacks();

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

    renderPickerItems(wheelIndex) {
        let { items } = this.state;

        items = [].concat(items[wheelIndex]);

        return items.map((item) => {
            return (
                <Picker.Item
                    label={item.label}
                    value={item.value}
                    key={item.key || item.label}
                    color={item.color}
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
                style={[defaultStyles.modalViewMiddle, style.modalViewMiddle]}
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
                                onDownArrow
                                    ? [defaultStyles.chevronActive, style.chevronActive]
                                    : {},
                            ]}
                        />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    testID="done_button"
                    onPress={() => {
                        this.togglePicker(true, onDonePress);
                    }}
                    onPressIn={() => {
                        this.setState({ doneDepressed: true });
                    }}
                    onPressOut={() => {
                        this.setState({ doneDepressed: false });
                    }}
                    hitSlop={{ top: 4, right: 4, bottom: 4, left: 4 }}
                    {...touchableDoneProps}
                >
                    <View testID="needed_for_touchable">
                        <Text
                            testID="done_text"
                            allowFontScaling={false}
                            style={[
                                defaultStyles.done,
                                style.done,
                                doneDepressed
                                    ? [defaultStyles.doneDepressed, style.doneDepressed]
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
        const { style, Icon } = this.props;

        if (!Icon) {
            return null;
        }

        return (
            <View
                testID="icon_container"
                style={[defaultStyles.iconContainer, style.iconContainer]}
            >
                <Icon testID="icon" />
            </View>
        );
    }

    renderTextInputOrChildren() {
        const { children, style, textInputProps } = this.props;
        const { selectedItem } = this.state;

        const containerStyle =
            Platform.OS === 'ios' ? style.inputIOSContainer : style.inputAndroidContainer;

        if (children) {
            return (
                <View pointerEvents="box-only" style={containerStyle}>
                    {children}
                </View>
            );
        }

        // Create the displayed label by concatenating values across all wheels.
        let label = '';
        selectedItem.forEach(i => {
            if (label.length > 0) {
                label += ' ';
            }
            label += i.inputLabel || i.label;
        });

        return (
            <View pointerEvents="box-only" style={containerStyle}>
                <TextInput
                    testID="text_input"
                    style={[
                        Platform.OS === 'ios' ? style.inputIOS : style.inputAndroid,
                        this.getPlaceholderStyle(),
                    ]}
                    value={label}
                    ref={this.setInputRef}
                    editable={false}
                    {...textInputProps}
                />
                {this.renderIcon()}
            </View>
        );
    }

    renderIOS() {
        const { style, modalProps, pickerProps, touchableWrapperProps } = this.props;
        const { animationType, orientation, selectedItem, showPicker, items } = this.state;

        return (
            <View style={[defaultStyles.viewContainer, style.viewContainer]}>
                <TouchableOpacity
                    testID="ios_touchable_wrapper"
                    onPress={() => {
                        this.togglePicker(true);
                    }}
                    activeOpacity={1}
                    {...touchableWrapperProps}
                >
                    {this.renderTextInputOrChildren()}
                </TouchableOpacity>
                <Modal
                    testID="ios_modal"
                    visible={showPicker}
                    transparent
                    animationType={animationType}
                    supportedOrientations={['portrait', 'landscape']}
                    onOrientationChange={this.onOrientationChange}
                    {...modalProps}
                >
                    <TouchableOpacity
                        style={[defaultStyles.modalViewTop, style.modalViewTop]}
                        testID="ios_modal_top"
                        onPress={() => {
                            this.togglePicker(true);
                        }}
                    />
                    {this.renderInputAccessoryView()}
                    <View
                        style={[
                            defaultStyles.modalViewBottom,
                            { height: orientation === 'portrait' ? 215 : 162 },
                            style.modalViewBottom,
                        ]}
                    >
                        <View style={[{justifyContent: 'center'}]}>
                            <View style={[{flexDirection: 'row', justifyContent: 'center',paddingLeft: 0}]}>
                                {items.map((wheel, wheelIndex) => {
                                    return (
                                        <View style={{width: '33%'}}>
                                            <Picker
                                                testID="ios_picker"
                                                onValueChange={(value, index) => this.onValueChange(wheelIndex, value, index)}
                                                selectedValue={selectedItem[wheelIndex].value}
                                                {...pickerProps}
                                            >
                                                {this.renderPickerItems(wheelIndex)}
                                            </Picker>
                                        </View>
                                    )}
                                )}
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }

    renderAndroidHeadless() {
        const { disabled, Icon, style, pickerProps, onOpen, touchableWrapperProps } = this.props;
        const { selectedItem } = this.state;

        return (
            <TouchableOpacity
                testID="android_touchable_wrapper"
                onPress={onOpen}
                activeOpacity={1}
                {...touchableWrapperProps}
            >
                <View style={style.headlessAndroidContainer}>
                    {this.renderTextInputOrChildren()}
                    <View style={[{justifyContent: 'center'}]}>
                        <View style={[{flexDirection: 'row', justifyContent: 'center',paddingLeft: 0}]}>
                            {items.map((wheel, wheelIndex) => {
                                return (
                                    <View style={{width: '33%'}}>
                                        <Picker
                                            style={[
                                                Icon ? { backgroundColor: 'transparent' } : {}, // to hide native icon
                                                defaultStyles.headlessAndroidPicker,
                                                style.headlessAndroidPicker,
                                            ]}
                                            testID="android_picker_headless"
                                            enabled={!disabled}
                                            onValueChange={(value, index) => this.onValueChange(wheelIndex, value, index)}
                                            selectedValue={selectedItem[wheelIndex].value}
                                            {...pickerProps}
                                        >
                                            {this.renderPickerItems(wheelIndex)}
                                        </Picker>
                                    </View>
                                )}
                            )}
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    renderAndroidNativePickerStyle() {
        const { disabled, Icon, style, pickerProps } = this.props;
        const { selectedItem } = this.state;

        return (
            <View style={[defaultStyles.viewContainer, style.viewContainer]}>
                    <View style={[{justifyContent: 'center'}]}>
                        <View style={[{flexDirection: 'row', justifyContent: 'center',paddingLeft: 0}]}>
                            {items.map((wheel, wheelIndex) => {
                                return (
                                    <View style={{width: '33%'}}>
                                        <Picker
                                            style={[
                                                Icon ? { backgroundColor: 'transparent' } : {}, // to hide native icon
                                                style.inputAndroid,
                                                this.getPlaceholderStyle(),
                                            ]}
                                            testID="android_picker_headless"
                                            enabled={!disabled}
                                            onValueChange={(value, index) => this.onValueChange(wheelIndex, value, index)}
                                            selectedValue={selectedItem[wheelIndex].value}
                                            {...pickerProps}
                                        >
                                            {this.renderPickerItems(wheelIndex)}
                                        </Picker>
                                    </View>
                                )}
                            )}
                        </View>
                    </View>
                {this.renderIcon()}
            </View>
        );
    }

    renderWeb() {
        const { disabled, style, pickerProps } = this.props;
        const { selectedItem } = this.state;

        return (
            <View style={[defaultStyles.viewContainer, style.viewContainer]}>
                <View style={[{justifyContent: 'center'}]}>
                    <View style={[{flexDirection: 'row', justifyContent: 'center',paddingLeft: 0}]}>
                    {items.map((wheel, wheelIndex) => {
                        return (
                            <View style={{width: '33%'}}>
                                <Picker
                                    style={[style.inputWeb]}
                                    testID="web_picker"
                                    onValueChange={(value, index) => this.onValueChange(wheelIndex, value, index)}
                                    selectedValue={selectedItem[wheelIndex].value}
                                    {...pickerProps}
                                >
                                    {this.renderPickerItems(wheelIndex)}
                                </Picker>
                            </View>
                        )}
                    )}
                    </View>
                </View>
                {this.renderIcon()}
            </View>
        );
    }

    render() {
        const { children, useNativeAndroidPickerStyle } = this.props;

        if (Platform.OS === 'ios') {
            return this.renderIOS();
        }

        if (Platform.OS === 'web') {
            return this.renderWeb();
        }

        if (children || !useNativeAndroidPickerStyle) {
            return this.renderAndroidHeadless();
        }
        return this.renderAndroidNativePickerStyle();
    }
}

export { defaultStyles };
