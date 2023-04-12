import React from 'react';
import { StyleSheet, View } from 'react-native';
import { PickerStateContext } from '../PickerStateProvider';
import { IOS_MODAL_ANIMATION_DURATION_MS, IOS_MODAL_HEIGHT } from '../constants';

function schedule(callback, timeout) {
    const handle = setTimeout(callback, timeout);
    return () => clearTimeout(handle);
}

/**
 * PickerAvoidingView is a React component that adjusts the view layout to avoid
 * being covered by an open iOS UIPickerView modal. It's meant to be similar to
 * the built-in KeyboardAvoidingView component, but specifically tailored for
 * iOS picker modals.
 *
 * In order for this component to work correctly, all the pickers and the
 * PickerAvoidingView should have a PickerStateProvider ancestor.
 *
 * @param {React.ReactNode} props.children - The child components that should be
 * protected from obstruction by the picker modal
 */
export function PickerAvoidingView(props) {
    const context = React.useContext(PickerStateContext);
    const isPickerOpen = context && context.isPickerOpen;

    const [shouldAddSpace, setShouldAddSpace] = React.useState(false);

    React.useEffect(() => {
        if (isPickerOpen) {
            // Add a delay, as adding the padding before the modal fully expanded gives a visually unpleasant effect
            return schedule(() => {
                setShouldAddSpace(true);
            }, IOS_MODAL_ANIMATION_DURATION_MS);
        } else {
            setShouldAddSpace(false);
        }
    }, [isPickerOpen]);

    return (
        <View
            style={StyleSheet.compose(props.style, {
                paddingBottom: shouldAddSpace ? IOS_MODAL_HEIGHT : 0,
            })}
        >
            {props.children}
        </View>
    );
}
