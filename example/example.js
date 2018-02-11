import React from 'react';
import {
  Text,
  StyleSheet,
  View,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

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
        <Text>What's your favorite color?</Text>
        <RNPickerSelect
          placeholder="Select a color..."
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
          style={{ ...pickerSelectStyles }}
        />
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

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingTop: 13,
    paddingHorizontal: 10,
    paddingBottom: 12,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    backgroundColor: 'white',
  },
});
