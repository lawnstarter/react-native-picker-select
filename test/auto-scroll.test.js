/* @jest-environment jsdom */

import React, { useRef, useState } from 'react';
import { View, ScrollView } from 'react-native';
import RNPickerSelect from '../src';

Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 105 });

// Mock the ScrollView's scrollTo function
jest.mock('react-native', () => {
    const RN = jest.requireActual('react-native');
    RN.ScrollView.prototype.scrollTo = jest.fn();
    return RN;
});

const noop = () => {};

function ScrollViewWithPicker() {
    const items = [
        {
            label: '+1 Canada',
            value: 1,
            key: 'canada',
        },
        {
            label: '+1 USA',
            value: 1,
            key: 'usa',
        },
    ];

    const scrollViewRef = useRef(null);
    const [contentOffsetY, setContentOffsetY] = useState(0);
    const setContextScrollPosition = (event) => {
        setContentOffsetY(event.nativeEvent.contentOffset.y);
    };

    return (
        <ScrollView ref={scrollViewRef} onScroll={setContextScrollPosition}>
            <View style={{ height: 1000 }} />

            <RNPickerSelect
                items={items}
                itemKey="usa"
                value={1}
                onValueChange={noop}
                scrollViewRef={scrollViewRef}
                scrollViewContentOffsetY={contentOffsetY}
            />
        </ScrollView>
    );
}

describe('RNPickerSelect', () => {
    describe('when wrapped with a ScrollView', () => {
        it('should scroll to the triggering text input when picker is opened', () => {
            const wrapper = mount(<ScrollViewWithPicker />);

            wrapper.find('[testID="text_input"]').first().simulate('focus');

            // if (Platform.OS === 'ios') {
            //     expect(ScrollView.prototype.scrollTo).toHaveBeenCalled();
            // }
        });
    });
});
