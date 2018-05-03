import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

import CustomButton from '.components/CustomButton';

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            favColor: '',
            items: [
                {
                    label: 'Red',
                    value: 'red',
                },
                {
                    label: 'Orange',
                    value: 'orange',
                },
                {
                    label: 'Blue',
                    value: 'blue',
                },
            ],
        };
    }

    render() {
        return (
            <View style={styles.container}>
                <RNPickerSelect
                    items={this.state.items}
                    placeholder={{}}
                    onValueChange={(value) => {
                        this.setState({
                            favColor: value,
                        });
                    }}
                >
                    <CustomButton text="Select your favorite color" />
                </RNPickerSelect>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        paddingHorizontal: 10,
    },
});
