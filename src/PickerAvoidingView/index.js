import React from 'react';
import { View } from 'react-native';

/**
 * As, currently, only on iOS the picker's modal resembles the software keyboard
 * in any way, the default implementation doesn't have any avoiding logic.
 *
 * @param {React.ReactNode} props.children - The child components to render
 * within the PickerAvoidingView.
 */
export function PickerAvoidingView(props) {
    // eslint-disable-next-line no-unused-vars
    const { enabled, ...viewProps } = props;
    return <View {...viewProps}>{props.children}</View>;
}
