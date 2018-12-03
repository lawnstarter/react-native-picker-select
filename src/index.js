import React, { PureComponent } from 'react';
import {
    ColorPropType,
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
    static propTypes = {
        onValueChange: PropTypes.func.isRequired,
        items: PropTypes.arrayOf(
            PropTypes.shape({
                label: PropTypes.string.isRequired,
                value: PropTypes.any.isRequired,
                key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
                color: ColorPropType,
            })
        ).isRequired,
        value: PropTypes.any, // eslint-disable-line react/forbid-prop-types
        placeholder: PropTypes.shape({
            label: PropTypes.string,
            value: PropTypes.any,
            key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            color: ColorPropType,
        }),
        disabled: PropTypes.bool,
        itemKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        style: PropTypes.shape({}),
        children: PropTypes.any, // eslint-disable-line react/forbid-prop-types
        hideIcon: PropTypes.bool,
        placeholderTextColor: ColorPropType,
        useNativeAndroidPickerStyle: PropTypes.bool,

        // Custom Modal props (iOS only)
        hideDoneBar: PropTypes.bool,
        doneText: PropTypes.string,
        onDonePress: PropTypes.func,
        onUpArrow: PropTypes.func,
        onDownArrow: PropTypes.func,

        // Modal props (iOS only)
        modalProps: PropTypes.shape({}),

        // TextInput props (iOS only)
        textInputProps: PropTypes.shape({}),

        // Picker props
        pickerProps: PropTypes.shape({}),
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
        hideIcon: false,
        placeholderTextColor: '#C7C7CD',
        useNativeAndroidPickerStyle: true,
        hideDoneBar: false,
        doneText: 'Done',
        onDonePress: null,
        onUpArrow: null,
        onDownArrow: null,
        modalProps: {},
        textInputProps: {},
        pickerProps: {},
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
            return isEqual(item.value, value);
        });
        if (idx === -1) {
            idx = 0;
        }
        return {
            selectedItem: items[idx],
            idx,
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        // update items if items prop changes
        const itemsChanged = !isEqual(prevState.items, nextProps.items);
        // update selectedItem if value prop is defined and differs from currently selected item
        const newItems = RNPickerSelect.handlePlaceholder({
            placeholder: nextProps.placeholder,
        }).concat(nextProps.items);
        const { selectedItem, idx } = RNPickerSelect.getSelectedItem({
            items: newItems,
            key: nextProps.itemKey,
            value: nextProps.value,
        });
        const selectedItemChanged =
            !isEqual(nextProps.value, undefined) && !isEqual(prevState.selectedItem, selectedItem);

        if (itemsChanged || selectedItemChanged) {
            if (selectedItemChanged) {
                nextProps.onValueChange(selectedItem.value, idx);
            }
            return {
                items: itemsChanged ? newItems : prevState.items,
                selectedItem: selectedItemChanged ? selectedItem : prevState.selectedItem,
            };
        }

        return null;
    }

    constructor(props) {
        super(props);

        const items = RNPickerSelect.handlePlaceholder({
            placeholder: this.props.placeholder,
        }).concat(this.props.items);

        const { selectedItem } = RNPickerSelect.getSelectedItem({
            items,
            key: this.props.itemKey,
            value: this.props.value,
        });

        this.state = {
            items,
            selectedItem,
            showPicker: false,
            animationType: undefined,
        };

        this.onUpArrow = this.onUpArrow.bind(this);
        this.onDownArrow = this.onDownArrow.bind(this);
        this.onValueChange = this.onValueChange.bind(this);
        this.setInputRef = this.setInputRef.bind(this);
        this.togglePicker = this.togglePicker.bind(this);
    }

    // these timeouts were a hacky first pass at ensuring the callback triggered after the modal animation
    // TODO: find a better approach
    onUpArrow() {
        const { onUpArrow } = this.props;

        this.togglePicker();
        setTimeout(onUpArrow);
    }

    onDownArrow() {
        const { onDownArrow } = this.props;

        this.togglePicker();
        setTimeout(onDownArrow);
    }

    onValueChange(value, index) {
        const { onValueChange } = this.props;

        onValueChange(value, index);

        this.setState({
            selectedItem: this.state.items[index],
        });
    }

    setInputRef(ref) {
        this.inputRef = ref;
    }

    getPlaceholderStyle() {
        const { placeholder, placeholderTextColor } = this.props;

        if (!isEqual(placeholder, {}) && this.state.selectedItem.label === placeholder.label) {
            return {
                color: placeholderTextColor,
            };
        }
        return {};
    }

    togglePicker(animate = false) {
        const { modalProps, disabled } = this.props;

        if (disabled) {
            return;
        }

        const animationType =
            modalProps && modalProps.animationType ? modalProps.animationType : 'slide';

        this.setState({
            animationType: animate ? animationType : undefined,
            showPicker: !this.state.showPicker,
        });

        if (!this.state.showPicker && this.inputRef) {
            this.inputRef.focus();
            this.inputRef.blur();
        }
    }

    renderPickerItems() {
        return this.state.items.map((item) => {
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

    renderDoneBar() {
        const { doneText, hideDoneBar, onUpArrow, onDownArrow, onDonePress, style } = this.props;

        if (hideDoneBar) {
            return null;
        }

        return (
            <View style={[defaultStyles.modalViewMiddle, style.modalViewMiddle]} testID="done_bar">
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
                    <View style={{ marginHorizontal: 10 }} />
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
                <TouchableWithoutFeedback
                    onPress={() => {
                        this.togglePicker(true);
                        if (onDonePress) {
                            onDonePress();
                        }
                    }}
                    hitSlop={{ top: 2, right: 2, bottom: 2, left: 2 }}
                    testID="done_button"
                >
                    <View testID="needed_for_touchable">
                        <Text style={[defaultStyles.done, style.done]}>{doneText}</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }

    renderIcon() {
        const { hideIcon, style } = this.props;

        if (hideIcon) {
            return null;
        }

        return <View testID="icon_ios" style={[defaultStyles.icon, style.icon]} />;
    }

    renderTextInputOrChildren() {
        const { children, hideIcon, style, textInputProps } = this.props;
        const containerStyle =
            Platform.OS === 'ios' ? style.inputIOSContainer : style.inputAndroidContainer;

        if (children) {
            return (
                <View pointerEvents="box-only" style={containerStyle}>
                    {children}
                </View>
            );
        }
        return (
            <View pointerEvents="box-only" style={containerStyle}>
                <TextInput
                    style={[
                        !hideIcon ? { paddingRight: 30 } : {},
                        Platform.OS === 'ios' ? style.inputIOS : style.inputAndroid,
                        this.getPlaceholderStyle(),
                    ]}
                    value={this.state.selectedItem.label}
                    ref={this.setInputRef}
                    editable={false}
                    {...textInputProps}
                />
                {this.renderIcon()}
            </View>
        );
    }

    renderIOS() {
        const { style, modalProps, pickerProps } = this.props;

        return (
            <View style={[defaultStyles.viewContainer, style.viewContainer]}>
                <TouchableWithoutFeedback
                    onPress={() => {
                        this.togglePicker(true);
                    }}
                >
                    {this.renderTextInputOrChildren()}
                </TouchableWithoutFeedback>
                <Modal
                    testID="RNPickerSelectModal"
                    visible={this.state.showPicker}
                    transparent
                    animationType={this.state.animationType}
                    supportedOrientations={['portrait', 'landscape']}
                    // onOrientationChange={TODO: use this to resize window}
                    {...modalProps}
                >
                    <TouchableOpacity
                        style={[defaultStyles.modalViewTop, style.modalViewTop]}
                        onPress={() => {
                            this.togglePicker(true);
                        }}
                    />
                    {this.renderDoneBar()}
                    <View style={[defaultStyles.modalViewBottom, style.modalViewBottom]}>
                        <Picker
                            testID="RNPickerSelectIOS"
                            onValueChange={this.onValueChange}
                            selectedValue={this.state.selectedItem.value}
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
        const { disabled, style, pickerProps } = this.props;
        return (
            <View style={[{ borderWidth: 0 }, style.headlessAndroidContainer]}>
                {this.renderTextInputOrChildren()}
                <Picker
                    style={[defaultStyles.headlessAndroidPicker, style.headlessAndroidPicker]}
                    testID="RNPickerSelectAndroidHeadless"
                    enabled={!disabled}
                    onValueChange={this.onValueChange}
                    selectedValue={this.state.selectedItem.value}
                    {...pickerProps}
                >
                    {this.renderPickerItems()}
                </Picker>
            </View>
        );
    }

    renderAndroid() {
        const {
            children,
            disabled,
            hideIcon,
            style,
            pickerProps,
            useNativeAndroidPickerStyle,
        } = this.props;

        if (children) {
            return this.renderAndroidHeadless();
        }

        if (useNativeAndroidPickerStyle) {
            return (
                <View style={[defaultStyles.viewContainer, style.viewContainer]}>
                    <Picker
                        style={[
                            hideIcon ? { backgroundColor: 'transparent' } : {},
                            style.inputAndroid,
                            this.getPlaceholderStyle(),
                        ]}
                        testID="RNPickerSelectAndroid"
                        enabled={!disabled}
                        onValueChange={this.onValueChange}
                        selectedValue={this.state.selectedItem.value}
                        {...pickerProps}
                    >
                        {this.renderPickerItems()}
                    </Picker>
                    <View style={[defaultStyles.underline, style.underline]} />
                </View>
            );
        }

        return (
            <View style={[defaultStyles.viewContainer, style.viewContainer]}>
                {this.renderAndroidHeadless()}
            </View>
        );
    }

    render() {
        return Platform.OS === 'ios' ? this.renderIOS() : this.renderAndroid();
    }
}

const defaultStyles = StyleSheet.create({
    viewContainer: {
        alignSelf: 'stretch',
    },
    chevronContainer: {
        flex: 1,
        flexDirection: 'row',
        marginLeft: 15,
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
        transform: [{ translateY: 17 }, { rotate: '-45deg' }],
    },
    chevronDown: {
        transform: [{ translateY: 8 }, { rotate: '135deg' }],
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
    headlessAndroidPicker: {
        position: 'absolute',
        top: 0,
        width: 1000,
        height: 1000,
        color: 'transparent',
    },
});
