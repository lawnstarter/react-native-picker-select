import React from 'react';
import {
  Text,
  StyleSheet,
  View,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

import CustomButton from '.components/CustomButton'

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      favColor: '',
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <RNPickerSelect
          items={[
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
        ]}
          onSelect={
          (item) => {
            this.setState({
              favColor: item.value,
            });
           }
        }
        >
            <CustomButton text="Select your favorite color"/>
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