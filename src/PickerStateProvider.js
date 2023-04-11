import React from 'react';

/**
 * @typedef {Object} PickerStateData
 * @property {boolean} isPickerOpen - Indicates whether any picker is currently open
 *
 * PickerStateContext is a context that gives access to PickerStateData.
 */
export const PickerStateContext = React.createContext();

/**
 * PickerStateProvider provides PickerStateContext and manages the necessary
 * state.
 *
 * This component should be used as a single top-level provider for all picker
 * instances in your application.
 */
export function PickerStateProvider(props) {
    const [isPickerOpen, setIsPickerOpen] = React.useState(false);

    const context = {
        isPickerOpen,
        setIsPickerOpen,
    };

    return (
        <PickerStateContext.Provider value={context}>
            {props.children}
        </PickerStateContext.Provider>
    );
}
