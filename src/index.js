// eslint-disable-next-line no-unused-vars
import React, { PureComponent } from 'react';
import { ColorPropType, Keyboard, Platform } from 'react-native';

import PropTypes from 'prop-types';
import isEqual from 'lodash.isequal';

import styles from './styles';

import {
    handlePlaceholder,
    renderIOS,
    getSelectedItem,
    renderAndroidHeadless,
    renderAndroidNativePickerStyle,
} from './components';

export const defaultStyles = styles;

export default class RNPickerSelect extends PureComponent {
    static getDerivedStateFromProps(nextProps, prevState) {
        // update items if items or placeholder prop changes
        const items = handlePlaceholder({
            placeholder: nextProps.placeholder,
        }).concat(nextProps.items);
        const itemsChanged = !isEqual(prevState.items, items);

        // update selectedItem if value prop is defined and differs from currently selected item
        const { selectedItem, idx } = getSelectedItem({
            items,
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
                ...(itemsChanged ? { items } : {}),
                ...(selectedItemChanged ? { selectedItem } : {}),
            };
        }

        return null;
    }

    constructor(props) {
        super(props);

        const items = handlePlaceholder({
            placeholder: this.props.placeholder,
        }).concat(this.props.items);

        const { selectedItem } = getSelectedItem({
            items,
            key: this.props.itemKey,
            value: this.props.value,
        });

        this.state = {
            items,
            selectedItem,
            showPicker: false,
            animationType: undefined,
            orientation: 'portrait',
        };
    }

    onUpArrow = () => {
        const { onUpArrow } = this.props;

        this.togglePicker(false, onUpArrow);
    };

    onDownArrow = () => {
        const { onDownArrow } = this.props;

        this.togglePicker(false, onDownArrow);
    };

    onValueChange = (value, index) => {
        const { onValueChange } = this.props;

        onValueChange(value, index);

        this.setState((prevState) => {
            return {
                selectedItem: prevState.items[index],
            };
        });
    };

    onOrientationChange = ({ nativeEvent }) => {
        this.setState({
            orientation: nativeEvent.orientation,
        });
    };

    triggerOpenCloseCallbacks = () => {
        const { onOpen, onClose } = this.props;

        if (!this.state.showPicker && onOpen) {
            onOpen();
        }

        if (this.state.showPicker && onClose) {
            onClose();
        }
    };

    triggerDoneCallback = () => {
        const { hideDoneBar, onDonePress } = this.props;
        if (!hideDoneBar && onDonePress) {
            onDonePress();
        }
    };

    togglePicker = (animate = false, postToggleCallback) => {
        const { modalProps, disabled } = this.props;

        if (disabled) {
            return;
        }

        if (!this.state.showPicker) {
            Keyboard.dismiss();
        }

        const animationType =
            // eslint-disable-next-line react/prop-types
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
    };

    render() {
        const { children, useNativeAndroidPickerStyle } = this.props;
        const { items, showPicker, animationType, selectedItem, orientation } = this.state;

        const props = {
            ...this.props,
            orientation,
            selectedItem,
            animationType,
            showPicker,
            items,
            onValueChange: this.onValueChange,
            togglePicker: (value) => {
                this.togglePicker(value);
            },
            onOrientationChange: this.onOrientationChange,
            triggerDoneCallback: this.triggerDoneCallback,
            onUpArrow: this.onUpArrow,
            onDownArrow: this.onDownArrow,
        };

        if (Platform.OS === 'ios') {
            return renderIOS(props);
        }

        if (children || !useNativeAndroidPickerStyle) {
            return renderAndroidHeadless(props);
        }

        return renderAndroidNativePickerStyle(props);
    }
}

RNPickerSelect.propTypes = {
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
    // eslint-disable-next-line react/no-unused-prop-types
    placeholderTextColor: ColorPropType, // deprecated
    useNativeAndroidPickerStyle: PropTypes.bool,

    // Custom Modal props (iOS only)
    hideDoneBar: PropTypes.bool, // deprecated
    // eslint-disable-next-line react/no-unused-prop-types
    doneText: PropTypes.string,
    onDonePress: PropTypes.func,
    onUpArrow: PropTypes.func,
    onDownArrow: PropTypes.func,
    onOpen: PropTypes.func,
    onClose: PropTypes.func,

    // Modal props (iOS only)
    modalProps: PropTypes.shape({}),

    // TextInput props (iOS only)
    textInputProps: PropTypes.shape({}),

    // Picker props
    pickerProps: PropTypes.shape({}),

    // Custom Icon
    // eslint-disable-next-line react/no-unused-prop-types
    Icon: PropTypes.func,
    // eslint-disable-next-line react/no-unused-prop-types
    InputAccessoryView: PropTypes.func,
};

RNPickerSelect.defaultProps = {
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
    placeholderTextColor: '#C7C7CD', // deprecated
    useNativeAndroidPickerStyle: true,
    hideDoneBar: false, // deprecated
    doneText: 'Done',
    onDonePress: null,
    onUpArrow: null,
    onDownArrow: null,
    onOpen: null,
    onClose: null,
    modalProps: {},
    textInputProps: {},
    pickerProps: {},
    Icon: null,
    InputAccessoryView: null,
};
