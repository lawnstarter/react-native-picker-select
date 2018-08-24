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

function handlePlaceholder({ placeholder }) {
    if (isEqual(placeholder, {})) {
        return [];
    }
    return [placeholder];
}

function getSelectedItem({ items, key, value }) {
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
        placeholder: PropTypes.shape({
            label: PropTypes.string,
            value: PropTypes.any,
        }),
        hideDoneBar: PropTypes.bool,
        hideIcon: PropTypes.bool,
        disabled: PropTypes.bool,
        value: PropTypes.any, // eslint-disable-line react/forbid-prop-types
        itemKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        style: PropTypes.object, // eslint-disable-line react/forbid-prop-types
        children: PropTypes.any, // eslint-disable-line react/forbid-prop-types
        mode: PropTypes.string,
        animationType: PropTypes.string,
        onUpArrow: PropTypes.func,
        onDownArrow: PropTypes.func,
        doneText: PropTypes.string,
    };

    static defaultProps = {
        placeholder: {
            label: 'Select an item...',
            value: null,
        },
        hideDoneBar: false,
        hideIcon: false,
        disabled: false,
        value: undefined,
        itemKey: null,
        style: {},
        children: null,
        mode: 'dialog',
        animationType: 'slide',
        onUpArrow: null,
        onDownArrow: null,
        doneText: 'Done',
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        // update items if items prop changes
        const itemsChanged = !isEqual(prevState.items, nextProps.items);
        // update selectedItem if value prop is defined and differs from currently selected item
        const newItems = handlePlaceholder({ placeholder: nextProps.placeholder }).concat(
            nextProps.items
        );
        const { selectedItem, idx } = getSelectedItem({
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

        const items = handlePlaceholder({ placeholder: props.placeholder }).concat(props.items);
        const { selectedItem } = getSelectedItem({
            items,
            key: props.itemKey,
            value: props.value,
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
        this.togglePicker = this.togglePicker.bind(this);
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

    onValueChange(value, index) {
        this.props.onValueChange(value, index);

        this.setState({
            selectedItem: this.state.items[index],
        });
    }

    getPlaceholderStyle() {
        if (
            !isEqual(this.props.placeholder, {}) &&
            this.state.selectedItem.label === this.props.placeholder.label
        ) {
            return { color: this.props.style.placeholderColor || '#C7C7CD' };
        }
        return {};
    }

    togglePicker(animate = false) {
        if (this.props.disabled) {
            return;
        }
        this.setState({
            animationType: animate ? this.props.animationType : undefined,
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
        if (this.props.hideDoneBar) {
            return null;
        }

        return (
            <View style={[styles.modalViewMiddle, this.props.style.modalViewMiddle]}>
                <View style={{ flex: 1, flexDirection: 'row', marginLeft: 15 }}>
                    <TouchableOpacity
                        activeOpacity={this.props.onUpArrow ? 0.5 : 1}
                        onPress={this.props.onUpArrow ? this.onUpArrow : null}
                    >
                        <View
                            style={[
                                styles.chevron,
                                this.props.style.chevron,
                                styles.chevronUp,
                                this.props.style.chevronUp,
                                this.props.onUpArrow
                                    ? [styles.chevronActive, this.props.style.chevronActive]
                                    : {},
                            ]}
                        />
                    </TouchableOpacity>
                    <View style={{ marginHorizontal: 10 }} />
                    <TouchableOpacity
                        activeOpacity={this.props.onDownArrow ? 0.5 : 1}
                        onPress={this.props.onDownArrow ? this.onDownArrow : null}
                    >
                        <View
                            style={[
                                styles.chevron,
                                this.props.style.chevron,
                                styles.chevronDown,
                                this.props.style.chevronDown,
                                this.props.onDownArrow
                                    ? [styles.chevronActive, this.props.style.chevronActive]
                                    : {},
                            ]}
                        />
                    </TouchableOpacity>
                </View>
                <TouchableWithoutFeedback
                    onPress={() => {
                        this.togglePicker(true);
                    }}
                    hitSlop={{ top: 2, right: 2, bottom: 2, left: 2 }}
                >
                    <View>
                        <Text style={[styles.done, this.props.style.done]}>
                            {this.props.doneText}
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }

    renderIcon() {
        if (this.props.hideIcon) {
            return null;
        }

        return <View testID="icon_ios" style={[styles.icon, this.props.style.icon]} />;
    }

    renderTextInputOrChildren() {
        if (this.props.children) {
            return (
                <View pointerEvents="box-only" style={this.props.style.inputIOSContainer}>
                    {this.props.children}
                </View>
            );
        }
        return (
            <View pointerEvents="box-only" style={this.props.style.inputIOSContainer}>
                <TextInput
                    { ...this.props.androidTextInputProperties }
                    style={[
                        !this.props.hideIcon ? { paddingRight: 30 } : {},
                        this.props.style.inputIOS,
                        this.getPlaceholderStyle(),
                    ]}
                    value={this.state.selectedItem.label}
                    ref={(ref) => {
                        this.inputRef = ref;
                    }}
                />
                {this.renderIcon()}
            </View>
        );
    }

    renderIOS() {
        return (
            <View style={[styles.viewContainer, this.props.style.viewContainer]}>
                <TouchableWithoutFeedback
                    onPress={() => {
                        this.togglePicker(true);
                    }}
                >
                    {this.renderTextInputOrChildren()}
                </TouchableWithoutFeedback>
                <Modal
                    visible={this.state.showPicker}
                    transparent
                    animationType={this.state.animationType}
                    supportedOrientations={['portrait', 'landscape']}
                >
                    <TouchableOpacity
                        style={[styles.modalViewTop, this.props.style.modalViewTop]}
                        onPress={() => {
                            this.togglePicker(true);
                        }}
                    />
                    {this.renderDoneBar()}
                    <View style={[styles.modalViewBottom, this.props.style.modalViewBottom]}>
                        <Picker
                            onValueChange={this.onValueChange}
                            selectedValue={this.state.selectedItem.value}
                            testID="RNPickerSelectIOS"
                        >
                            {this.renderPickerItems()}
                        </Picker>
                    </View>
                </Modal>
            </View>
        );
    }

    renderAndroidHeadless() {
        return (
            <View style={[{ borderWidth: 0 }, this.props.style.headlessAndroidContainer]}>
                {this.props.children}
                <Picker
                    style={{ position: 'absolute', top: 0, width: 1000, height: 1000 }}
                    onValueChange={this.onValueChange}
                    selectedValue={this.state.selectedItem.value}
                    testID="RNPickerSelectAndroid"
                    mode={this.props.mode}
                    enabled={!this.props.disabled}
                >
                    {this.renderPickerItems()}
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
                    style={[
                        this.props.hideIcon ? { backgroundColor: 'transparent' } : {},
                        this.props.style.inputAndroid,
                        this.getPlaceholderStyle(),
                    ]}
                    onValueChange={this.onValueChange}
                    selectedValue={this.state.selectedItem.value}
                    testID="RNPickerSelectAndroid"
                    mode={this.props.mode}
                    enabled={!this.props.disabled}
                >
                    {this.renderPickerItems()}
                </Picker>
                <View style={[styles.underline, this.props.style.underline]} />
            </View>
        );
    }

    render() {
        return Platform.OS === 'ios' ? this.renderIOS() : this.renderAndroid();
    }
}

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
});
