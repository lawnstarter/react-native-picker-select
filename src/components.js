import React from 'react';
import {
    Modal,
    Picker,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';

import isEqual from 'lodash.isequal';
import memoize from 'memoize-one';

import styles from './styles';

export const handlePlaceholder = memoize(({ placeholder }) => {
    if (isEqual(placeholder, {})) {
        return [];
    }
    return [placeholder];
});

export const renderPickerItems = memoize((items = []) => {
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
});

export const renderIcon = memoize(({ style = {}, Icon } = {}) => {
    if (!Icon) {
        return null;
    }

    return (
        <View testID="icon_container" style={[styles.iconContainer, style.iconContainer]}>
            <Icon testID="icon" />
        </View>
    );
});

export const getPlaceholderStyle = memoize((props = {}, selectedItem = {}) => {
    const { placeholder = {}, placeholderTextColor, style } = props;

    if (!isEqual(placeholder, {}) && selectedItem.label === placeholder.label) {
        return {
            ...styles.placeholder,
            color: placeholderTextColor, // deprecated
            ...style.placeholder,
        };
    }
    return {};
});

export const renderTextInputOrChildren = memoize(
    ({ children, style = {}, textInputProps = {}, selectedItem = {}, ...other }) => {
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
                        Platform.OS === 'ios' ? style.inputIOS : style.inputAndroid,
                        getPlaceholderStyle({ ...other, style }, selectedItem),
                    ]}
                    value={selectedItem.label}
                    editable={false}
                    {...(textInputProps || {})}
                />
                {renderIcon({ style, Icon: other.Icon })}
            </View>
        );
    }
);

export const getSelectedItem = memoize(({ items, key, value }) => {
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
        selectedItem: items[idx] || {},
        idx,
    };
});

export const renderAndroidHeadless = memoize((props) => {
    const {
        disabled,
        Icon,
        style = {},
        pickerProps = {},
        onValueChange,
        selectedItem = {},
        items,
    } = props;
    return (
        <View style={style.headlessAndroidContainer}>
            {renderTextInputOrChildren({ ...props, selectedItem })}
            <Picker
                style={[
                    Icon ? { backgroundColor: 'transparent' } : {}, // to hide native icon
                    styles.headlessAndroidPicker,
                    style.headlessAndroidPicker,
                ]}
                testID="android_picker_headless"
                enabled={!disabled}
                onValueChange={onValueChange}
                selectedValue={selectedItem && selectedItem.value}
                {...(pickerProps || {})}
            >
                {renderPickerItems(items)}
            </Picker>
        </View>
    );
});

export const renderAndroidNativePickerStyle = memoize((props) => {
    const {
        disabled,
        Icon,
        style = {},
        pickerProps = {},
        selectedItem = {},
        onValueChange,
        items,
    } = props;

    return (
        <View style={[styles.viewContainer, style && style.viewContainer]}>
            <Picker
                style={[
                    Icon ? { backgroundColor: 'transparent' } : {}, // to hide native icon
                    style.inputAndroid,
                    getPlaceholderStyle(props, selectedItem),
                ]}
                testID="android_picker"
                enabled={!disabled}
                onValueChange={onValueChange}
                selectedValue={selectedItem && selectedItem.value}
                {...pickerProps}
            >
                {renderPickerItems(items)}
            </Picker>
            {renderIcon(props)}
        </View>
    );
});

export const renderInputAccessoryView = memoize((props) => {
    const {
        InputAccessoryView,
        doneText,
        hideDoneBar,
        onUpArrow,
        onDownArrow,
        style = {},
        togglePicker,
    } = props;

    // deprecated
    if (hideDoneBar) {
        return null;
    }

    if (InputAccessoryView) {
        return <InputAccessoryView testID="custom_input_accessory_view" />;
    }

    return (
        <View style={[styles.modalViewMiddle, style.modalViewMiddle]} testID="input_accessory_view">
            <View style={[styles.chevronContainer, style.chevronContainer]}>
                <TouchableOpacity activeOpacity={onUpArrow ? 0.5 : 1} onPress={onUpArrow || null}>
                    <View
                        style={[
                            styles.chevron,
                            style.chevron,
                            styles.chevronUp,
                            style.chevronUp,
                            onUpArrow ? [styles.chevronActive, style.chevronActive] : {},
                        ]}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={onDownArrow ? 0.5 : 1}
                    onPress={onDownArrow || null}
                >
                    <View
                        style={[
                            styles.chevron,
                            style.chevron,
                            styles.chevronDown,
                            style.chevronDown,
                            onDownArrow ? [styles.chevronActive, style.chevronActive] : {},
                        ]}
                    />
                </TouchableOpacity>
            </View>
            <TouchableWithoutFeedback
                onPress={() => {
                    togglePicker(true);
                }}
                hitSlop={{ top: 4, right: 4, bottom: 4, left: 4 }}
                testID="done_button"
            >
                <View testID="needed_for_touchable">
                    <Text style={[styles.done, style.done]}>{doneText}</Text>
                </View>
            </TouchableWithoutFeedback>
        </View>
    );
});

export const renderIOS = memoize((props) => {
    const {
        style = {},
        modalProps,
        showPicker,
        pickerProps = {},
        orientation,
        onValueChange,
        onOrientationChange,
        selectedItem,
        togglePicker,
        items,
        animationType,
        triggerDoneCallback,
    } = props;
    return (
        <View style={[styles.viewContainer, style.viewContainer]}>
            <TouchableWithoutFeedback
                onPress={() => {
                    togglePicker(true);
                }}
                testID="ios_touchable_wrapper"
            >
                {renderTextInputOrChildren({ ...props, selectedItem })}
            </TouchableWithoutFeedback>
            <Modal
                testID="ios_modal"
                visible={showPicker}
                transparent
                animationType={animationType}
                supportedOrientations={['portrait', 'landscape']}
                onDismiss={triggerDoneCallback}
                onOrientationChange={onOrientationChange}
                {...modalProps}
            >
                <TouchableOpacity
                    style={[styles.modalViewTop, style.modalViewTop]}
                    testID="ios_modal_top"
                    onPress={() => {
                        togglePicker(true);
                    }}
                />
                {renderInputAccessoryView(props)}
                <View
                    style={[
                        styles.modalViewBottom,
                        { height: orientation === 'portrait' ? 215 : 162 },
                        style.modalViewBottom,
                    ]}
                >
                    <Picker
                        testID="ios_picker"
                        onValueChange={onValueChange}
                        selectedValue={selectedItem && selectedItem.value}
                        {...(pickerProps || {})}
                    >
                        {renderPickerItems(items)}
                    </Picker>
                </View>
            </Modal>
        </View>
    );
});
